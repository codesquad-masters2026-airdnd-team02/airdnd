package codesquad.airdnd.domain.wishlist;

import codesquad.airdnd.domain.member.Member;
import codesquad.airdnd.domain.wishlist.dto.response.WishlistGroupResponse;
import codesquad.airdnd.global.auth.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final AuthUtils authUtils;

    public List<WishlistGroupResponse> getWishlists(){
        Member member = authUtils.getCurrentMember(); // TODO: Stub
        return wishlistRepository.findWishlistsByMember(member.getId());
    }
}
