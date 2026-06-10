package codesquad.airdnd.domain.reservation;

import org.springframework.data.jpa.repository.JpaRepository;

import codesquad.airdnd.domain.reservation.entity.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
}
