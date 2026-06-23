package codesquad.airdnd.domain.review;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import codesquad.airdnd.domain.member.Member;
import codesquad.airdnd.domain.review.dto.request.ReviewCreateRequest;
import codesquad.airdnd.global.auth.AuthUtils;
import codesquad.airdnd.global.auth.LoginArgumentResolver;
import codesquad.airdnd.global.exception.BusinessException;
import codesquad.airdnd.global.exception.ErrorCode;

@WebMvcTest(ReviewController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(LoginArgumentResolver.class)
class ReviewControllerTest {

	private static final Long MEMBER_ID = 1L;
	private static final Long RES_ID = 100L;

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockitoBean
	private ReviewService reviewService;

	@MockitoBean
	private AuthUtils authUtils;

	@BeforeEach
	void setUpCurrentMember() {
		Member member = Member.builder().nickname("guest").build();
		ReflectionTestUtils.setField(member, "id", MEMBER_ID);
		given(authUtils.getCurrentMember()).willReturn(member);
	}

	private String body(int rating, String content) throws Exception {
		return objectMapper.writeValueAsString(new ReviewCreateRequest(rating, content));
	}

	@Nested
	@DisplayName("POST /api/reservations/{reservationId}/reviews")
	class CreateReview {

		@Test
		@DisplayName("작성 성공 시 201과 reviewId를 반환한다")
		void success() throws Exception {
			given(reviewService.create(MEMBER_ID, RES_ID, 5, "좋아요")).willReturn(7L);

			mockMvc.perform(post("/api/reservations/{id}/reviews", RES_ID)
					.contentType(MediaType.APPLICATION_JSON)
					.content(body(5, "좋아요")))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.data.reviewId").value(7L));
		}

		@Test
		@DisplayName("별점이 0이면 400과 COMMON_002를 반환한다")
		void rejectsRatingBelowRange() throws Exception {
			mockMvc.perform(post("/api/reservations/{id}/reviews", RES_ID)
					.contentType(MediaType.APPLICATION_JSON)
					.content(body(0, "내용")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.success").value(false))
				.andExpect(jsonPath("$.code").value("COMMON_002"));

			then(reviewService).shouldHaveNoInteractions();
		}

		@Test
		@DisplayName("별점이 6이면 400을 반환한다")
		void rejectsRatingAboveRange() throws Exception {
			mockMvc.perform(post("/api/reservations/{id}/reviews", RES_ID)
					.contentType(MediaType.APPLICATION_JSON)
					.content(body(6, "내용")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.success").value(false));

			then(reviewService).shouldHaveNoInteractions();
		}

		@Test
		@DisplayName("이미 리뷰가 있으면 409와 REVIEW_005를 반환한다")
		void duplicateReturnsConflict() throws Exception {
			given(reviewService.create(anyLong(), anyLong(), anyInt(), any()))
				.willThrow(new BusinessException(ErrorCode.DUPLICATE_REVIEW));

			mockMvc.perform(post("/api/reservations/{id}/reviews", RES_ID)
					.contentType(MediaType.APPLICATION_JSON)
					.content(body(5, "좋아요")))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.success").value(false))
				.andExpect(jsonPath("$.code").value("REVIEW_005"));
		}

		@Test
		@DisplayName("예약 본인이 아니면 403과 REVIEW_003을 반환한다")
		void notOwnerReturnsForbidden() throws Exception {
			given(reviewService.create(anyLong(), anyLong(), anyInt(), any()))
				.willThrow(new BusinessException(ErrorCode.REVIEW_NOT_RESERVATION_OWNER));

			mockMvc.perform(post("/api/reservations/{id}/reviews", RES_ID)
					.contentType(MediaType.APPLICATION_JSON)
					.content(body(5, "좋아요")))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code").value("REVIEW_003"));
		}
	}
}
