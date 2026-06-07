package codesquad.airdnd.domain.listing;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import codesquad.airdnd.domain.listing.dto.request.ListingCreateRequest;
import codesquad.airdnd.domain.listing.dto.response.HostListingSummary;
import codesquad.airdnd.domain.listing.dto.response.HostListingsList;
import codesquad.airdnd.domain.listing.dto.response.ListingDetail;
import codesquad.airdnd.domain.listing.entity.Address;
import codesquad.airdnd.domain.listing.entity.Listing;
import codesquad.airdnd.domain.member.Member;
import codesquad.airdnd.global.exception.BusinessException;
import codesquad.airdnd.global.exception.ErrorCode;
import codesquad.airdnd.global.region.RegionCodeService;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ListingService {

	private static final BigDecimal LAT_MIN = BigDecimal.valueOf(33.0);
	private static final BigDecimal LAT_MAX = BigDecimal.valueOf(38.9);
	private static final BigDecimal LON_MIN = BigDecimal.valueOf(124.6);
	private static final BigDecimal LON_MAX = BigDecimal.valueOf(131.9);

	private final ListingRepository listingRepository;
	private final RegionCodeService regionCodeService;

	public void submitListing(Member host, ListingCreateRequest request) {
		validateKoreanBounds(request.latitude(), request.longitude());
		Address address = buildAddress(request);
		Listing listing = request.toListing(host, address);
		listingRepository.save(listing);
	}

	@Transactional(readOnly = true)
	public HostListingsList getHostListings(Member host) {
		List<Listing> listings = listingRepository.findAllByHost(host);

		return new HostListingsList(
			listings.stream()
				.map(listing -> HostListingSummary.from(listing,
					regionCodeService.getAddressSummary(
						listing.getAddress().getSidoCode(),
						listing.getAddress().getSigunguCode())))
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

	private void validateKoreanBounds(BigDecimal latitude, BigDecimal longitude) {
		boolean outOfBounds = latitude.compareTo(LAT_MIN) < 0 || latitude.compareTo(LAT_MAX) > 0
			|| longitude.compareTo(LON_MIN) < 0 || longitude.compareTo(LON_MAX) > 0;
		if (outOfBounds) {
			throw new BusinessException(ErrorCode.INVALID_LOCATION);
		}
	}

	private Address buildAddress(ListingCreateRequest request) {
		return new Address(
			request.roadAddress(), request.detailAddress(), request.postalCode(),
			request.latitude(), request.longitude(),
			"11", "11680"
		);
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
