package codesquad.airdnd.domain.wishlist.dto.response;

import codesquad.airdnd.domain.wishlist.entity.Wishlist;
import codesquad.airdnd.domain.wishlistItem.WishlistItem;

public record WishlistAddResponse(
        Long wishlistId,
        Long listingId,
        String name
) {

    public static WishlistAddResponse from(Wishlist wishlist, WishlistItem wishlistItem) {
        return new WishlistAddResponse(
                wishlistItem.getId().getWishlistId(),
                wishlistItem.getId().getListingId(),
                wishlist.getName());
    }
}
