package codesquad.airdnd.domain.listing.dto.request;

import codesquad.airdnd.domain.listing.dto.query.AmenityFilter;
import codesquad.airdnd.domain.listing.dto.query.CapacityFilter;
import codesquad.airdnd.domain.listing.dto.query.MapBoundsFilter;
import codesquad.airdnd.domain.listing.dto.query.PriceFilter;
import codesquad.airdnd.domain.listing.dto.query.RoomTypeFilter;
import jakarta.validation.Valid;

public record ListingSearchCondition(
	 MapBoundsFilter mapBounds
	// PriceFilter price,
	// CapacityFilter capacity,
	// RoomTypeFilter roomType,
	// AmenityFilter amenity
) {
	// public PriceFilter price() {
	// 	return price != null ? price : new PriceFilter(null, null);
	// }
	//
	// public CapacityFilter capacity() {
	// 	return capacity != null ? capacity : new CapacityFilter(null, null, null, null);
	// }
	//
	// public RoomTypeFilter roomType() {
	// 	return roomType != null ? roomType : new RoomTypeFilter(null);
	// }
	//
	// public AmenityFilter amenity() {
	// 	return amenity != null ? amenity : new AmenityFilter(null);
	// }
}
