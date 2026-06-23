package codesquad.airdnd.domain.review;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import codesquad.airdnd.domain.member.Member;
import codesquad.airdnd.domain.member.MemberRepository;
import codesquad.airdnd.domain.reservation.ReservationRepository;
import codesquad.airdnd.domain.reservation.entity.Reservation;
import codesquad.airdnd.domain.review.entity.Review;
import codesquad.airdnd.domain.review.repository.ReviewRepository;
import codesquad.airdnd.global.exception.BusinessException;
import codesquad.airdnd.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

	private final ReviewRepository reviewRepository;
	private final ReservationRepository reservationRepository;
	private final MemberRepository memberRepository;
	private final ListingReviewSummaryService summaryService;

	@Transactional
	public Long create(Long memberId, Long reservationId, int rating, String content) {
		Reservation reservation = reservationRepository.findById(reservationId)
			.orElseThrow(() -> new BusinessException(ErrorCode.RESERVATION_NOT_FOUND));

		if (reviewRepository.existsByReservation_ReservationId(reservationId)) {
			throw new BusinessException(ErrorCode.DUPLICATE_REVIEW);
		}

		Member author = memberRepository.getReferenceById(memberId);
		Review review = Review.create(reservation, author, rating, content);
		reviewRepository.save(review);

		summaryService.addReview(reservation.getListing(), rating);
		return review.getId();
	}
}
