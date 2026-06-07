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
    MEMBER_NOT_FOUND(HttpStatus.UNAUTHORIZED, "MEMBER_001", "존재하지 않는 회원입니다."),

	// ===== Listing =====
	LISTING_NOT_FOUND(HttpStatus.NOT_FOUND, "LISTING_001", "숙소를 찾을 수 없습니다."),
	NOT_LISTING_OWNER(HttpStatus.FORBIDDEN, "LISTING_002" ,"숙소 접근 권한이 없습니다." ),
	LISTING_NOT_APPROVED(HttpStatus.CONFLICT, "LISTING_003", "승인되지 않은 숙소입니다."),
	;
	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
