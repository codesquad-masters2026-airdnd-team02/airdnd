package codesquad.airdnd.domain.wishlist;

import codesquad.airdnd.domain.wishlist.dto.request.WishlistAddRequest;
import codesquad.airdnd.domain.wishlist.dto.response.WishlistAddResponse;
import codesquad.airdnd.domain.wishlist.dto.response.WishlistDetailResponse;
import codesquad.airdnd.domain.wishlist.dto.response.WishlistResponse;
import codesquad.airdnd.global.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
    public ApiResponse<WishlistDetailResponse> getWishlistDetail(
            @PathVariable @Min(1) Long wishlistId){

        return ApiResponse.success(wishlistService.getWishlist(wishlistId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<WishlistAddResponse> addWishlist(
            @RequestBody @Valid WishlistAddRequest wishlistAddRequest
    ){

        return ApiResponse.success(wishlistService.addWishlist(wishlistAddRequest));
    }
}
