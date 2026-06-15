package codesquad.airdnd.domain.reservation.dto.request;

import codesquad.airdnd.domain.reservation.entity.CancelReason;
import jakarta.validation.constraints.NotNull;

public record ReservationCancelRequest(
	@NotNull CancelReason reason,
	String message
) {

}
