package codesquad.airdnd.domain.wishlist.dto.response;

import codesquad.airdnd.domain.wishlist.entity.Wishlist;

public record WishlistAddResponse(
        Long id,
        String name
) {

    public static WishlistAddResponse from(Wishlist wishlist) {
        return new WishlistAddResponse(wishlist.getId(), wishlist.getName());
    }
}
