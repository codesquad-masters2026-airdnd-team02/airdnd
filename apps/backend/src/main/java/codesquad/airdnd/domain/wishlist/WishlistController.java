package codesquad.airdnd.domain.wishlist;

import codesquad.airdnd.domain.wishlist.dto.response.WishlistDetailResponse;
import codesquad.airdnd.domain.wishlist.dto.response.WishlistResponse;
import codesquad.airdnd.global.ApiResponse;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/wishlists")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ApiResponse<List<WishlistResponse>> getWishlists(){
        return ApiResponse.success(wishlistService.getWishlists());
    }

    @GetMapping("/{wishlistId}")
    public ApiResponse<WishlistDetailResponse> getWishlist(
            @PathVariable @Min(1) Long wishlistId){

        return ApiResponse.success(wishlistService.getWishlist(wishlistId));
    }
}
