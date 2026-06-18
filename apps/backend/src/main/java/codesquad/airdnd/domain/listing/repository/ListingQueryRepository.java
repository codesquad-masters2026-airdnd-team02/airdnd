package codesquad.airdnd.domain.listing.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import codesquad.airdnd.domain.listing.dto.query.ListingSearchResponse;
import codesquad.airdnd.domain.listing.dto.request.ListingSearchCondition;

public interface ListingQueryRepository {
	Page<ListingSearchResponse> searchListings(ListingSearchCondition condition, Pageable pageable);
}
