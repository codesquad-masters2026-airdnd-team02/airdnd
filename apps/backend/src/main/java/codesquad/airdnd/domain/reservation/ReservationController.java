package codesquad.airdnd.domain.reservation;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/listings/{listingId}/reservations")
public class ReservationController {
	private final ReservationService reservationService;
}
