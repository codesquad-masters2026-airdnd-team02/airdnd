package codesquad.airdnd.domain.listing.entity;

import java.math.BigDecimal;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class Address {
	private String roadAddress;
	private String detailAddress;
	private String postalCode;
	private BigDecimal latitude;
	private BigDecimal longitude;
	private String sidoCode;
	private String sigunguCode;
}
