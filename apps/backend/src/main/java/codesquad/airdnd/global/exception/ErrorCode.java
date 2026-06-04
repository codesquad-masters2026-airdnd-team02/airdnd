package codesquad.airdnd.global.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

	// ===== Common =====
	INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON_001", "서버 내부 오류"),
	INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "COMMON_002","입력값이 올바르지 않습니다." ),

    // ==== MEMBER ====
    MEMBER_NOT_FOUND(HttpStatus.UNAUTHORIZED, "MEMBER_001", "존재하지 않는 회원입니다.");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
