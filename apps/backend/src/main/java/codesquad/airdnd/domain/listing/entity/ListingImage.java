package codesquad.airdnd.domain.listing.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "listing_image")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ListingImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    private Listing listing;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(name = "is_cover", nullable = false)
    private boolean cover;

    @Builder
    protected ListingImage(Listing listing, String imageUrl, int sortOrder, boolean cover) {
        this.listing = listing;
        this.imageUrl = imageUrl;
        this.sortOrder = sortOrder;
        this.cover = cover;
    }
}
