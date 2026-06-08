import { useState, useEffect } from 'react';
import { HostHeader } from '../../components/HostHeader';
import { Icon } from '../../shared/Icon';
import type { WishlistSummary } from '../../types';

interface WishlistPageProps {
  onLogo: () => void;
  onHosting?: () => void;
  onOpenWishlist?: (id: number) => void;
}

export function WishlistPage({ onLogo, onHosting, onOpenWishlist }: WishlistPageProps) {
  const [wishlists, setWishlists] = useState<WishlistSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/wishlists')
      .then(res => res.json())
      .then(json => setWishlists(json.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <HostHeader
        onLogo={onLogo}
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={onHosting}
              style={{
                background: 'none', border: 'none',
                fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
                color: 'var(--ink-1)', cursor: 'pointer', padding: '0 8px',
              }}
            >
              호스팅 하기
            </button>
            <button
              onClick={onLogo}
              style={{
                height: 40, padding: '0 18px', borderRadius: 10,
                border: '1px solid var(--line-strong)', background: '#fff',
                fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
                color: 'var(--ink-2)', cursor: 'pointer',
              }}
            >
              홈으로
            </button>
          </div>
        }
      />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 40px 100px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700,
          color: 'var(--ink-1)', marginBottom: 32,
        }}>
          위시리스트
        </h1>

        {loading ? (
          <div style={{ color: 'var(--ink-3)', fontSize: 15 }}>불러오는 중...</div>
        ) : wishlists.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 28,
          }}>
            {wishlists.map(w => (
              <WishlistCard key={w.id} wishlist={w} onClick={() => onOpenWishlist?.(w.id)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function WishlistCard({ wishlist, onClick }: { wishlist: WishlistSummary; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: '100%', aspectRatio: '1 / 1',
        borderRadius: 16, overflow: 'hidden',
        background: 'var(--surface-alt-2)',
      }}>
        {wishlist.imgUrl ? (
          <img
            src={wishlist.imgUrl}
            alt={wishlist.name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 220ms ease',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="image" size={44} color="var(--ink-4)" />
          </div>
        )}
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-1)' }}>
          {wishlist.name}
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
          저장된 항목 {wishlist.itemCount}개
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', paddingTop: 100 }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'var(--surface-alt-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <Icon name="heart" size={32} color="var(--ink-3)" />
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-1)', marginBottom: 8 }}>
        저장된 위시리스트가 없어요
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>
        마음에 드는 숙소를 위시리스트에 추가해보세요.
      </div>
    </div>
  );
}
