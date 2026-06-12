package codesquad.airdnd.domain.auth;

import codesquad.airdnd.domain.auth.dto.SessionResponse;
import codesquad.airdnd.domain.auth.dto.SignupRequest;
import codesquad.airdnd.global.ApiResponse;
import codesquad.airdnd.global.auth.security.AirdndUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Long> signup(
            @RequestBody @Valid SignupRequest request
    ){
        return ApiResponse.success(authService.signup(request));
    }

    @GetMapping("/session")
    public ApiResponse<SessionResponse> session(
            @AuthenticationPrincipal AirdndUserDetails principal
    ){
        SessionResponse response = (principal != null) ?
                SessionResponse.of(principal.getMember()) : SessionResponse.anonymous();
        return ApiResponse.success(response);
    }
}
