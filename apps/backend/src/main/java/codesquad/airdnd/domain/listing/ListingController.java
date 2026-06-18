package codesquad.airdnd.domain.listing;

import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import codesquad.airdnd.domain.listing.dto.request.ListingPageRequest;
import codesquad.airdnd.domain.listing.dto.request.ListingSearchCondition;
import codesquad.airdnd.domain.listing.dto.response.ListingCardResponse;
import codesquad.airdnd.global.response.ApiResponse;
import codesquad.airdnd.global.response.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/listings")
public class ListingController {
	private final ListingSearchService listingSearchService;

	@GetMapping
	public ApiResponse<PageResponse<ListingCardResponse>> getListings(
		@ModelAttribute ListingSearchCondition condition,
		@ModelAttribute @Valid ListingPageRequest pageRequest
	) {
		PageResponse<ListingCardResponse> response = listingSearchService.search(condition, pageRequest);
		return ApiResponse.success(response);
	}
}
