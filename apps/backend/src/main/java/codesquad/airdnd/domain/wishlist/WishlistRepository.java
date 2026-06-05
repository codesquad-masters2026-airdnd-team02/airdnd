package codesquad.airdnd.domain.wishlist;

import codesquad.airdnd.domain.wishlist.dto.response.WishlistGroupResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    @Query(value = """
        WITH latest_item AS (
                SELECT wishlist_id, listing_id
                FROM (
                    SELECT
                        wishlist_id,
                        listing_id,
                        ROW_NUMBER() OVER (PARTITION BY wishlist_id ORDER BY created_at DESC) AS rn
                    FROM wishlist_item
                    WHERE wishlist_id IN (SELECT id FROM wishlist WHERE member_id = :memberId)
                ) ranked
                WHERE ranked.rn = 1
            ),
            best_image AS (
                SELECT listing_id, image_url
                FROM (
                    SELECT
                        listing_id, 
                        image_url,
                        ROW_NUMBER() OVER (PARTITION BY listing_id ORDER BY is_cover DESC, sort_order ASC) AS rn
                    FROM listing_image
                ) ranked
                WHERE ranked.rn = 1
            )
            SELECT
                w.id,
                w.name,
                COUNT(wi.listing_id) AS itemCount,
                bi.image_url AS imgUrl
            FROM wishlist w
            LEFT JOIN wishlist_item wi ON wi.wishlist_id = w.id
            LEFT JOIN latest_item li ON li.wishlist_id = w.id
            LEFT JOIN best_image bi ON bi.listing_id = li.listing_id
            WHERE w.member_id = :memberId
            GROUP BY w.id, w.name, bi.image_url
        """, nativeQuery = true)
    List<WishlistGroupResponse> findWishlistsByMember(@Param("memberId") Long memberId);
}
