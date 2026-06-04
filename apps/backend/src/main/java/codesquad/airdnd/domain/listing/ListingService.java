package codesquad.airdnd.domain.listing;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import codesquad.airdnd.domain.listing.entity.Listing;
import codesquad.airdnd.domain.listing.dto.ListingCreateRequest;
import codesquad.airdnd.domain.member.Member;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ListingService {
	private final ListingRepository listingRepository;

	@Transactional
	public void submitListing(Member member, ListingCreateRequest request) {
		Listing listing = request.toListing(member);
		listingRepository.save(listing);
	}
}
