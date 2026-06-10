package codesquad.airdnd.domain.reservation;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import codesquad.airdnd.domain.listing.ListingRepository;
import codesquad.airdnd.domain.listing.entity.Listing;
import codesquad.airdnd.domain.member.Member;
import codesquad.airdnd.domain.member.MemberRepository;
import codesquad.airdnd.domain.reservation.dto.request.CreateReservationRequest;
import codesquad.airdnd.domain.reservation.dto.response.ReservationSummary;
import codesquad.airdnd.domain.reservation.entity.GuestCounts;
import codesquad.airdnd.domain.reservation.entity.Reservation;
import codesquad.airdnd.domain.reservation.entity.ReservationDate;
import codesquad.airdnd.global.exception.BusinessException;
import codesquad.airdnd.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservationService {
	private final ReservationRepository resRepository;
	private final ReservationDateRepository resDateRepository;

	private final ListingRepository listingRepository;
	private final MemberRepository memberRepository;

	@Transactional
	public ReservationSummary createReservation(
		Long guestId, Long listingId,
		CreateReservationRequest request
	) {
		Listing listing = listingRepository.findById(listingId)
			.orElseThrow(() -> new BusinessException(ErrorCode.LISTING_NOT_FOUND));

		if (!listing.isApproved()) {
			throw new BusinessException(ErrorCode.LISTING_NOT_APPROVED);
		}

		Member guest = memberRepository.getReferenceById(guestId);

		GuestCounts guestCounts = request.toGuestCounts();
		Reservation reservation = Reservation.create(
			guest,
			listing, request.checkInDate(),
			request.checkOutDate(),
			guestCounts
		);

		resRepository.save(reservation);
		List<ReservationDate> dates = ReservationDate.from(reservation);

		try {
			resDateRepository.saveAll(dates);
			resDateRepository.flush();
		} catch (DataIntegrityViolationException e) {
			throw new BusinessException(ErrorCode.ALREADY_RESERVED);
		}

		return ReservationSummary.from(reservation);
	}
}
