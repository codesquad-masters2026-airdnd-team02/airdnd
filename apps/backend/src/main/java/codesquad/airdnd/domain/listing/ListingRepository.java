package codesquad.airdnd.domain.listing;

import org.springframework.data.jpa.repository.JpaRepository;

import codesquad.airdnd.domain.listing.entity.Listing;

public interface ListingRepository extends JpaRepository<Listing, Long> {
}
