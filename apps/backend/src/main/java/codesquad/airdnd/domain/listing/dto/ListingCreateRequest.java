package codesquad.airdnd.domain.listing.dto;

import java.math.BigDecimal;
import java.util.Set;

import codesquad.airdnd.domain.listing.entity.Amenity;
import codesquad.airdnd.domain.listing.entity.Listing;
import codesquad.airdnd.domain.listing.entity.RoomType;
import codesquad.airdnd.domain.member.Member;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ListingCreateRequest(
	@NotBlank String name,

	@NotBlank String city,
	@NotBlank String district,
	@NotBlank String streetAddress,
	@NotBlank String detailAddress,
	@NotBlank String zipCode,

	@NotBlank RoomType roomType,

	@Min(1) int maxGuests,
	@Min(0) int bedrooms,
	@Min(0) int beds,
	@Min(0) int bathrooms,

	String description,

	@NotNull
	@Positive
	@Digits(integer = 10, fraction = 2)
	BigDecimal pricePerNight,


	Set<Amenity> amenities
) {
	public Listing toListing(Member member) {
		return Listing.builder()
			.name(name)
			.roomType(roomType)
			.description(description)
			.address(null)
			.host(member)
			.capacity(null)
			.pricePerNight(pricePerNight)
			.amenities(amenities)
			.build();
	}
}
