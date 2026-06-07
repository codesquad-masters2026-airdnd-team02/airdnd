package codesquad.airdnd.domain.listing;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import codesquad.airdnd.domain.listing.dto.response.HostListingSummary;
import codesquad.airdnd.domain.listing.dto.response.HostListingsList;
import codesquad.airdnd.domain.listing.dto.response.ListingDetail;
import codesquad.airdnd.domain.listing.entity.Listing;
import codesquad.airdnd.domain.listing.dto.request.ListingCreateRequest;
import codesquad.airdnd.domain.member.Member;
import codesquad.airdnd.global.exception.BusinessException;
import codesquad.airdnd.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ListingService {
	private final ListingRepository listingRepository;

	public void submitListing(Member host, ListingCreateRequest request) {
		Listing listing = request.toListing(host);
		listingRepository.save(listing);
	}

	@Transactional(readOnly = true)
	public HostListingsList getHostListings(Member host) {
		List<Listing> listings = listingRepository.findAllByHost(host);

		return new HostListingsList(
			listings.stream()
				.map(HostListingSummary::from)
				.toList()
		);
	}

	@Transactional(readOnly = true)
	public ListingDetail getListingDetail(Member host, Long listingsId) {
		Listing listing = findById(listingsId);
		validateOwner(listing, host);
		return ListingDetail.from(listing);
	}

	public void activate(Member host, Long listingsId) {
		Listing listing = findById(listingsId);
		validateOwner(listing, host);
		validateApproved(listing);
		listing.activate();
	}

	public void deactivate(Member host, Long listingsId) {
		Listing listing = findById(listingsId);
		validateOwner(listing, host);
		validateApproved(listing);
		listing.deactivate();
	}

	private Listing findById(Long listingId) {
		return listingRepository.findById(listingId)
			.orElseThrow(() -> new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR));
	}

	private void validateOwner(Listing listing, Member host) {
		if (!listing.isOwnedBy(host)) {
			throw new BusinessException(ErrorCode.NOT_LISTING_OWNER);
		}
	}

	private void validateApproved(Listing listing) {
		if (!listing.isApproved()) {
			throw new BusinessException(ErrorCode.LISTING_NOT_APPROVED);
		}
	}
}
