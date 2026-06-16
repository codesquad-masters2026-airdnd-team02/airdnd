package codesquad.airdnd.domain.payment;

import codesquad.airdnd.domain.listing.entity.Listing;
import codesquad.airdnd.domain.member.Member;
import codesquad.airdnd.domain.member.MemberRepository;
import codesquad.airdnd.domain.payment.dto.response.PaymentPrepareResponse;
import codesquad.airdnd.domain.payment.entity.Payment;
import codesquad.airdnd.domain.reservation.ReservationRepository;
import codesquad.airdnd.domain.reservation.entity.Reservation;
import codesquad.airdnd.global.config.TossProperties;
import codesquad.airdnd.global.exception.BusinessException;
import codesquad.airdnd.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final MemberRepository memberRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final TossProperties tossProperties;

    @Transactional
    public PaymentPrepareResponse prepare(Long memberId, Long resId){
        Reservation reservation = reservationRepository.findByReservationIdAndGuest_Id(resId, memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_RESERVATION));

        Listing listing = reservation.getListing();

        if(!reservation.isPending()){
            throw new BusinessException(ErrorCode.NOT_PENDING_RESERVATION);
        }

        paymentRepository.findByReservationId(reservation.getReservationId())
                .ifPresent(p -> { throw new BusinessException(ErrorCode.ALREADY_IN_PROGRESS_PAYMENT); });

        try {
            Payment payment = paymentRepository.save(
                    Payment.ready(UUID.randomUUID().toString(),
                            reservation.getTotalPrice(),
                            reservation.getReservationId()));

            paymentRepository.flush();

            return PaymentPrepareResponse.of(
                    payment.getOrderId(), listing.getName(),
                    tossProperties.successUrl(), tossProperties.failUrl(), payment.getAmount());

        } catch (DataIntegrityViolationException e) {
            throw new BusinessException(ErrorCode.ALREADY_IN_PROGRESS_PAYMENT);
        }
    }
}
