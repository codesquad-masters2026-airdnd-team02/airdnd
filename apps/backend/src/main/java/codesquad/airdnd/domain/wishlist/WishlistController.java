package codesquad.airdnd.domain.wishlist;

import codesquad.airdnd.domain.wishlist.dto.response.WishlistGroupResponse;
import codesquad.airdnd.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/wishlists")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ApiResponse<List<WishlistGroupResponse>> getWishlists(){
        return ApiResponse.success(wishlistService.getWishlists());
    }
}
