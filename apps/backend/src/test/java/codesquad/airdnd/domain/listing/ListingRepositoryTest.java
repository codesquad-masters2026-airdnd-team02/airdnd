package codesquad.airdnd.domain.listing;

import static org.assertj.core.api.Assertions.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import codesquad.airdnd.domain.listing.entity.Address;
import codesquad.airdnd.domain.listing.entity.Capacity;
import codesquad.airdnd.domain.listing.entity.Listing;
import codesquad.airdnd.domain.listing.entity.RoomType;
import codesquad.airdnd.domain.member.Member;

@DataJpaTest
class ListingRepositoryTest {

	@Autowired
	private ListingRepository listingRepository;

	@Autowired
	private TestEntityManager em;

	private Member host;
	private Member otherHost;

	@BeforeEach
	void setUp() {
		host = em.persist(Member.builder()
			.nickname("testHost")
			.build());
		otherHost = em.persist(Member.builder()
			.nickname("otherHost")
			.build());
		em.flush();
	}

	@Test
	@DisplayName("호스트 본인의 숙소만 반환한다")
	void findAllByHost_returnsOnlyOwnListings() {
		// given
		em.persist(buildListing("내 숙소 A", host));
		em.persist(buildListing("내 숙소 B", host));
		em.persist(buildListing("다른 호스트 숙소", otherHost));
		em.flush();

		// when
		List<Listing> result = listingRepository.findAllByHost(host);

		// then
		assertThat(result).hasSize(2);
		assertThat(result).extracting(Listing::getName)
			.containsExactlyInAnyOrder("내 숙소 A", "내 숙소 B");
	}

	@Test
	@DisplayName("다른 호스트의 숙소는 반환되지 않는다")
	void findAllByHost_doesNotReturnOtherHostListings() {
		// given
		em.persist(buildListing("다른 호스트 숙소", otherHost));
		em.flush();

		// when
		List<Listing> result = listingRepository.findAllByHost(host);

		// then
		assertThat(result).isEmpty();
	}

	@Test
	@DisplayName("등록된 숙소가 없으면 빈 목록을 반환한다")
	void findAllByHost_returnsEmptyListWhenNoListings() {
		// when
		List<Listing> result = listingRepository.findAllByHost(host);

		// then
		assertThat(result).isEmpty();
	}

	@Test
	@DisplayName("숙소가 여러 개 있어도 호스트 ID 기준으로 정확히 필터링된다")
	void findAllByHost_filtersAccuratelyByHostId() {
		// given
		em.persist(buildListing("호스트 A 숙소 1", host));
		em.persist(buildListing("호스트 B 숙소 1", otherHost));
		em.persist(buildListing("호스트 B 숙소 2", otherHost));
		em.flush();

		// when
		List<Listing> hostResult = listingRepository.findAllByHost(host);
		List<Listing> otherResult = listingRepository.findAllByHost(otherHost);

		// then
		assertThat(hostResult).hasSize(1);
		assertThat(otherResult).hasSize(2);
	}

	// ===== helper =====

	private Listing buildListing(String name, Member owner) {
		return Listing.builder()
			.name(name)
			.roomType(RoomType.ENTIRE_PLACE)
			.description("설명")
			.address(new Address("서울 강남구 테헤란로 152", "101호", "06236",
				BigDecimal.valueOf(37.5012), BigDecimal.valueOf(127.0396),
				"11", "11680"))
			.host(owner)
			.capacity(new Capacity(2, 1, 1, 1))
			.pricePerNight(BigDecimal.valueOf(50000))
			.amenities(Set.of())
			.build();
	}
}
