package codesquad.airdnd.domain.listing.repository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import codesquad.airdnd.domain.listing.entity.ListingImage;

public interface ListingImageRepository extends JpaRepository<ListingImage, Long> {
	@Query("select i from ListingImage i where i.listing.id in :listingIds order by i.sortOrder asc")
	List<ListingImage> findAllByListingIds(@Param("listingIds") List<Long> listingIds);

	default Map<Long, List<String>> findImagesByListingIds(List<Long> listingIds) {
		return findAllByListingIds(listingIds).stream()
			.collect(Collectors.groupingBy(
				img -> img.getListing().getId(),
				Collectors.mapping(ListingImage::getImageUrl, Collectors.toList())
			));
	}
}
