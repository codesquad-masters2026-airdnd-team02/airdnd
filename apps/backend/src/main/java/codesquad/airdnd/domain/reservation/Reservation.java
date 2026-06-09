package codesquad.airdnd.domain.reservation;

import java.math.BigDecimal;
import java.time.LocalDate;

import codesquad.airdnd.domain.listing.entity.Listing;
import codesquad.airdnd.domain.member.Member;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Reservation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long reservationId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "guest_id")
	private Member guest;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "listing_id")
	private Listing listing;

	private LocalDate checkInDate;
	private LocalDate checkOutDate;

	@Enumerated(value = EnumType.STRING)
	private ReservationState state;

	@Embedded
	private GuestCounts guestCounts;

	private BigDecimal totalPrice;
}
