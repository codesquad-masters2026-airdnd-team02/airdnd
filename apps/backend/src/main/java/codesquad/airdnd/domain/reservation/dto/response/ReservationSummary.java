package codesquad.airdnd.domain.reservation.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import codesquad.airdnd.domain.reservation.entity.Reservation;
import codesquad.airdnd.domain.reservation.entity.ReservationState;

public record ReservationSummary(
	Long reservationId,
	Long listingId,
	String listingTitle,
	LocalDate checkInDate,
	LocalDate checkOutDate,
	GuestCountsResponse guestCounts,
	BigDecimal totalPrice,
	ReservationState state
) {
	public static ReservationSummary from(Reservation r) {
		return new ReservationSummary(
			r.getReservationId(),
			r.getListing().getId(),
			r.getListing().getName(),
			r.getCheckInDate(),
			r.getCheckOutDate(),
			GuestCountsResponse.from(r.getGuestCounts()),
			r.getTotalPrice(),
			r.getState()
		);
	}
}
