package codesquad.airdnd.domain.review.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import codesquad.airdnd.domain.review.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

	boolean existsByReservation_ReservationId(Long reservationId);
}
