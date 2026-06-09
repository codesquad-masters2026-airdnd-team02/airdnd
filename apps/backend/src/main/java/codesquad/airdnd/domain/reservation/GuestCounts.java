package codesquad.airdnd.domain.reservation;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GuestCounts {
	private int adultGuestNum;
	private int childGuestNum;
	private int babyGuestNum;
	private int petGuestNum;
}
