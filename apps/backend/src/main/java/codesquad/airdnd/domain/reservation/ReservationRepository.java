package codesquad.airdnd.domain.reservation;

import org.springframework.data.jpa.repository.JpaRepository;

import codesquad.airdnd.domain.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Optional<Reservation> findByReservationIdAndGuest_Id(Long resId, Long memberId);
}
