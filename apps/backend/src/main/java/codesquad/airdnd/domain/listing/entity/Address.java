package codesquad.airdnd.domain.listing.entity;

import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class Address {
	private String city;
	private String district;
	private String streetAddress;
	private String detailAddress;
	private String zipCode;
}
