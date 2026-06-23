package codesquad.airdnd.domain.review;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import codesquad.airdnd.domain.review.dto.request.ReviewCreateRequest;
import codesquad.airdnd.domain.review.dto.response.ReviewCreatedResponse;
import codesquad.airdnd.global.auth.CurrentMember;
import codesquad.airdnd.global.auth.CurrentMemberInfo;
import codesquad.airdnd.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReviewController {

	private final ReviewService reviewService;

	@Operation(summary = "게스트 리뷰 작성")
	@PostMapping("/reservations/{reservationId}/reviews")
	public ResponseEntity<ApiResponse<ReviewCreatedResponse>> createReview(
		@CurrentMember CurrentMemberInfo guest, @PathVariable Long reservationId,
		@RequestBody @Valid ReviewCreateRequest request
	) {
		Long reviewId = reviewService.create(guest.id(), reservationId, request.rating(), request.content());
		return ResponseEntity.status(HttpStatus.CREATED)
			.body(ApiResponse.success(ReviewCreatedResponse.from(reviewId)));
	}
}
