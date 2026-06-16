package codesquad.airdnd.domain.payment;

import codesquad.airdnd.domain.payment.dto.response.PaymentPrepareResponse;
import codesquad.airdnd.global.ApiResponse;
import codesquad.airdnd.global.auth.CurrentMember;
import codesquad.airdnd.global.auth.CurrentMemberInfo;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Validated
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/{resId}/prepare")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<PaymentPrepareResponse> prepare(
        @CurrentMember CurrentMemberInfo currentMember,
        @PathVariable @Min(1) Long resId
    ){
        return ApiResponse.success(paymentService.prepare(currentMember.id(), resId));
    }
}
