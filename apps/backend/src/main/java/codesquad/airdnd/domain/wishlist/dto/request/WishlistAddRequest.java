package codesquad.airdnd.domain.wishlist.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record WishlistAddRequest(

        @NotBlank(message = "위시리스트의 이름은 한 글자 이상 채워져있어야 합니다.")
        @Size(max = 50)
        String name
) {
}