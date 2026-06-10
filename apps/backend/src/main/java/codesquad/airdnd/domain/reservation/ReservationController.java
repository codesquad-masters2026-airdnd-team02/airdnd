package codesquad.airdnd.domain.reservation;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import codesquad.airdnd.domain.reservation.dto.request.CreateReservationRequest;
import codesquad.airdnd.domain.reservation.dto.response.ReservationSummary;
import codesquad.airdnd.global.ApiResponse;
import codesquad.airdnd.global.auth.CurrentMember;
import codesquad.airdnd.global.auth.CurrentMemberInfo;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReservationController {
	private final ReservationService reservationService;

	@Operation(summary = "게스트 숙소 예약")
	@PostMapping("/listings/{listingId}/reservations")
	public ResponseEntity<ApiResponse<ReservationSummary>> createReservation(
		@CurrentMember CurrentMemberInfo guest, @PathVariable Long listingId,
		@RequestBody @Valid CreateReservationRequest request
	) {
		ReservationSummary response = reservationService.createReservation(guest.id(), listingId, request);
		return ResponseEntity.status(HttpStatus.CREATED)
			.body(ApiResponse.success(response));
	}

}
