package codesquad.airdnd.domain.payment.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String orderId;

    // TOSS 승인 후 채워짐
    private String paymentKey;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(nullable = false, unique = true)
    private Long reservationId;
    
    // TOSS 승인 후 채워짐
    private String method;

    // TOSS 승인 후 채워짐
    private LocalDateTime approvedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Builder(access = AccessLevel.PRIVATE)
    private Payment(String orderId, BigDecimal amount, Long reservationId) {
        this.orderId = orderId;
        this.amount = amount;
        this.reservationId = reservationId;
        this.status = PaymentStatus.READY;   // Payment 생성 시 READY가 디폴트
        this.createdAt = LocalDateTime.now();
    }

    public static Payment ready(String orderId, BigDecimal amount, Long reservationId) {
        return Payment.builder()
                .orderId(orderId)
                .amount(amount)
                .reservationId(reservationId)
                .build();
    }

    // TODO: 추후 결제 승인 / 실패 메서드 따로 빼기 -> complete, fail
}
