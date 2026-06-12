package codesquad.airdnd.domain.listing.entity;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import codesquad.airdnd.domain.member.Member;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Listing {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;

	@Enumerated(value = EnumType.STRING)
	private RoomType roomType;
	private String description;

	@Embedded
	private Address address;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "host_id")
	private Member host;

	@Embedded
	private Capacity capacity;

	private BigDecimal pricePerNight;

	@ElementCollection(fetch = FetchType.LAZY)
	@CollectionTable(name = "listing_amenity", joinColumns = @JoinColumn(name = "listing_id"))
	@Enumerated(EnumType.STRING)
	@Column(name = "amenity")
	private Set<Amenity> amenities = new HashSet<>();

	@Enumerated(value = EnumType.STRING)
	private ListingState state;

	@Builder
	public Listing(String name, RoomType roomType, String description, Address address, Member host, Capacity capacity,
		BigDecimal pricePerNight, Set<Amenity> amenities
	) {
		this.name = name;
		this.roomType = roomType;
		this.description = description;
		this.address = address;
		this.host = host;
		this.capacity = capacity;
		this.pricePerNight = pricePerNight;
		this.amenities = amenities;
		this.state = ListingState.PENDING;
	}

	public void deactivate() {
		state = ListingState.INACTIVE;
	}

	public void activate() {
		state = ListingState.APPROVED;
	}

	public boolean isOwnedBy(Member host) {
		return this.host.getId().equals(host.getId());
	}

	public boolean isApproved() {
		return state == ListingState.APPROVED;
	}
}
