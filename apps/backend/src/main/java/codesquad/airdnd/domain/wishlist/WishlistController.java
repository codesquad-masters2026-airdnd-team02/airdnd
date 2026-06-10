package codesquad.airdnd.domain.wishlist;

import codesquad.airdnd.domain.wishlist.dto.request.ExistingWishlistAddRequest;
import codesquad.airdnd.domain.wishlist.dto.request.NewWishlistAddRequest;
import codesquad.airdnd.domain.wishlist.dto.response.ExistingWishlistAddResponse;
import codesquad.airdnd.domain.wishlist.dto.response.NewWishlistAddResponse;
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

    @PostMapping("/items")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<NewWishlistAddResponse> addItemInNewWishlist(
            @RequestBody @Valid NewWishlistAddRequest request
    ){

        return ApiResponse.success(wishlistService.addItemInNewWishlist(request));
    }

    // TODO: ConstraintViolationException 전역 에러 처리 필요 (Validated)
    @PostMapping("/{wishlistId}/items")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ExistingWishlistAddResponse> addItemInExistingWishlist(
            @PathVariable @Min(value = 1, message = "최소 1 이상의 값이어야 합니다.") Long wishlistId,
            @RequestBody @Valid ExistingWishlistAddRequest request
    ){

        return ApiResponse.success(wishlistService.addItemInExistingWishlist(wishlistId, request));
    }
}
