package codesquad.airdnd.domain.review;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import codesquad.airdnd.domain.listing.entity.Listing;
import codesquad.airdnd.domain.member.Member;
import codesquad.airdnd.domain.member.MemberRepository;
import codesquad.airdnd.domain.reservation.ReservationRepository;
import codesquad.airdnd.domain.reservation.entity.Reservation;
import codesquad.airdnd.domain.review.entity.Review;
import codesquad.airdnd.domain.review.repository.ReviewRepository;
import codesquad.airdnd.global.exception.BusinessException;
import codesquad.airdnd.global.exception.ErrorCode;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

	private static final Long MEMBER_ID = 10L;
	private static final Long RES_ID = 100L;
	private static final Long REVIEW_ID = 500L;
	private static final Long LISTING_ID = 1L;

	@Mock
	private ReviewRepository reviewRepository;

	@Mock
	private ReservationRepository reservationRepository;

	@Mock
	private MemberRepository memberRepository;

	@Mock
	private ListingReviewSummaryService summaryService;

	@InjectMocks
	private ReviewService reviewService;

	@Mock
	private Reservation reservation;

	@Mock
	private Member author;

	@Mock
	private Listing listing;

	@Mock
	private Review review;

	@Nested
	@DisplayName("리뷰 작성 (create)")
	class Create {

		@Test
		@DisplayName("리뷰를 저장하고 통계에 점수를 반영한다")
		void savesReviewAndUpdatesSummary() {
			given(reservationRepository.findById(RES_ID)).willReturn(Optional.of(reservation));
			given(reviewRepository.existsByReservation_ReservationId(RES_ID)).willReturn(false);
			given(memberRepository.getReferenceById(MEMBER_ID)).willReturn(author);
			given(author.getId()).willReturn(MEMBER_ID);
			given(reservation.isOwnedBy(MEMBER_ID)).willReturn(true);
			given(reservation.isCompleted()).willReturn(true);
			given(reservation.getListing()).willReturn(listing);

			reviewService.create(MEMBER_ID, RES_ID, 5, "좋아요");

			then(reviewRepository).should().save(any(Review.class));
			then(summaryService).should().addReview(listing, 5);
		}

		@Test
		@DisplayName("이미 리뷰가 있으면 예외이고 저장·통계 갱신을 하지 않는다")
		void rejectsDuplicate() {
			given(reservationRepository.findById(RES_ID)).willReturn(Optional.of(reservation));
			given(reviewRepository.existsByReservation_ReservationId(RES_ID)).willReturn(true);

			assertThatThrownBy(() -> reviewService.create(MEMBER_ID, RES_ID, 5, "좋아요"))
				.isInstanceOf(BusinessException.class)
				.hasFieldOrPropertyWithValue("errorCode", ErrorCode.DUPLICATE_REVIEW);

			then(reviewRepository).should(never()).save(any());
			then(summaryService).shouldHaveNoInteractions();
		}

		@Test
		@DisplayName("예약이 존재하지 않으면 예외다")
		void rejectsMissingReservation() {
			given(reservationRepository.findById(RES_ID)).willReturn(Optional.empty());

			assertThatThrownBy(() -> reviewService.create(MEMBER_ID, RES_ID, 5, "좋아요"))
				.isInstanceOf(BusinessException.class)
				.hasFieldOrPropertyWithValue("errorCode", ErrorCode.RESERVATION_NOT_FOUND);

			then(summaryService).shouldHaveNoInteractions();
		}
	}

	@Nested
	@DisplayName("리뷰 삭제 (delete)")
	class Delete {

		@Test
		@DisplayName("본인 리뷰를 삭제하고 통계에서 점수를 차감한다")
		void deletesAndUpdatesSummary() {
			given(reviewRepository.findById(REVIEW_ID)).willReturn(Optional.of(review));
			given(review.isWrittenBy(MEMBER_ID)).willReturn(true);
			given(review.getListingId()).willReturn(LISTING_ID);
			given(review.getRating()).willReturn(5);

			reviewService.delete(MEMBER_ID, REVIEW_ID);

			then(reviewRepository).should().delete(review);
			then(summaryService).should().removeReview(LISTING_ID, 5);
		}

		@Test
		@DisplayName("리뷰가 존재하지 않으면 예외다")
		void rejectsMissingReview() {
			given(reviewRepository.findById(REVIEW_ID)).willReturn(Optional.empty());

			assertThatThrownBy(() -> reviewService.delete(MEMBER_ID, REVIEW_ID))
				.isInstanceOf(BusinessException.class)
				.hasFieldOrPropertyWithValue("errorCode", ErrorCode.REVIEW_NOT_FOUND);

			then(summaryService).shouldHaveNoInteractions();
		}

		@Test
		@DisplayName("본인이 작성한 리뷰가 아니면 예외이고 삭제·통계 갱신을 하지 않는다")
		void rejectsNonAuthor() {
			given(reviewRepository.findById(REVIEW_ID)).willReturn(Optional.of(review));
			given(review.isWrittenBy(MEMBER_ID)).willReturn(false);

			assertThatThrownBy(() -> reviewService.delete(MEMBER_ID, REVIEW_ID))
				.isInstanceOf(BusinessException.class)
				.hasFieldOrPropertyWithValue("errorCode", ErrorCode.REVIEW_NOT_AUTHOR);

			then(reviewRepository).should(never()).delete(any());
			then(summaryService).shouldHaveNoInteractions();
		}
	}
}
