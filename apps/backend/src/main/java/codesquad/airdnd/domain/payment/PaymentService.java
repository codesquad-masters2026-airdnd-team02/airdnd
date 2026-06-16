package codesquad.airdnd.domain.payment;

import codesquad.airdnd.domain.listing.entity.Listing;
import codesquad.airdnd.domain.payment.dto.request.PaymentConfirmRequest;
import codesquad.airdnd.domain.payment.dto.response.PaymentConfirmResponse;
import codesquad.airdnd.domain.payment.dto.request.TossConfirmRequest;
import codesquad.airdnd.domain.payment.dto.response.TossConfirmResponse;
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
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final TossProperties tossProperties;
    private final RestClient tossRestClient;

    @Transactional
    public PaymentPrepareResponse preparePayment(Long memberId, Long resId){
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

    @Transactional
    public PaymentConfirmResponse confirmPayment(Long memberId, PaymentConfirmRequest request){


        Payment payment = paymentRepository.findByOrderId(request.orderId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_PAYMENT));

        if(!payment.isReady()){
            throw new BusinessException(ErrorCode.NOT_READY_PAYMENT);
        }

        if(!payment.isEqualAmount(request.amount())){
            throw new BusinessException(ErrorCode.NOT_EQUAL_INFO_PAYMENT);
        }

        Reservation reservation = reservationRepository.findById(payment.getReservationId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_RESERVATION));

        if(!reservation.isOwner(memberId)){
            throw new BusinessException(ErrorCode.NOT_OWNER_PAYMENT);
        }

        TossConfirmRequest tossRequest =
                new TossConfirmRequest(request.paymentKey(), payment.getOrderId(), payment.getAmount().intValueExact());

        TossConfirmResponse tossResponse;
        try {
            tossResponse = tossRestClient.post()
                    .uri(tossProperties.confirmUri())
                    .header("Idempotency-Key", UUID.randomUUID().toString())
                    .body(tossRequest)
                    .retrieve()
                    .body(TossConfirmResponse.class);
        } catch (RestClientException e) {
            throw new BusinessException(ErrorCode.CONFIRM_FAILED_PAYMENT);
        }

        if(tossResponse == null){
            throw new BusinessException(ErrorCode.CONFIRM_FAILED_PAYMENT);
        }

        payment.complete(
                tossResponse.paymentKey(),
                tossResponse.method(),
                OffsetDateTime.parse(tossResponse.approvedAt()).toLocalDateTime());

        reservation.confirm();

        return PaymentConfirmResponse.from(payment);
    }
}
