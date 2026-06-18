package codesquad.airdnd.domain.listing;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import codesquad.airdnd.domain.listing.dto.query.ListingSearchResponse;
import codesquad.airdnd.domain.listing.dto.request.ListingPageRequest;
import codesquad.airdnd.domain.listing.dto.request.ListingSearchCondition;
import codesquad.airdnd.domain.listing.dto.response.ListingCardResponse;
import codesquad.airdnd.domain.listing.repository.ListingImageRepository;
import codesquad.airdnd.domain.listing.repository.ListingQueryRepository;
import codesquad.airdnd.domain.wishlistItem.WishlistItemRepository;
import codesquad.airdnd.global.response.PageResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ListingSearchService {
	private final ListingQueryRepository listingQueryRepository;
	private final ListingImageRepository imageRepository;
	private final WishlistItemRepository wishlistItemRepository;

	public PageResponse<ListingCardResponse> search(ListingSearchCondition condition, ListingPageRequest pageRequest) {
		Page<ListingSearchResponse> page = listingQueryRepository.searchListings(condition, pageRequest.toPageable());

		List<Long> listingIds = page.getContent().stream()
			.map(ListingSearchResponse::id)
			.toList();

		Map<Long, List<String>> imageMap = imageRepository.findImagesByListingIds(listingIds);
		Set<Long> isWishlistedIds = wishlistItemRepository.findItemsByListingIds(listingIds);

		Page<ListingCardResponse> cardPage = page.map(c -> ListingCardResponse.from(
			c, imageMap.getOrDefault(c.id(), List.of()), isWishlistedIds.contains(c.id())
		));

		return PageResponse.from(cardPage);
	}
}
