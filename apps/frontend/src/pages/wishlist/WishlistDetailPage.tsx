import { useState, useEffect } from 'react';
import { HostHeader } from '../../components/HostHeader';
import { Icon } from '../../shared/Icon';
import type { WishlistDetail, WishlistDetailItem } from '../../types';

interface WishlistDetailPageProps {
  wishlistId: number;
  onBack: () => void;
  onLogo: () => void;
  onHosting?: () => void;
}

export function WishlistDetailPage({ wishlistId, onBack, onLogo, onHosting }: WishlistDetailPageProps) {
  const [detail, setDetail] = useState<WishlistDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/wishlists/${wishlistId}`)
      .then(res => res.json())
      .then(json => setDetail(json.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [wishlistId]);

  const items = detail?.items ?? [];

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

      <main style={{ maxWidth: 1040, margin: '0 auto', padding: '32px 40px 100px' }}>
        <button
          onClick={onBack}
          aria-label="뒤로"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 40, height: 40, borderRadius: '50%',
            border: 'none', background: 'none', cursor: 'pointer',
            marginLeft: -8, marginBottom: 4,
          }}
        >
          <Icon name="chevron-left" size={24} color="var(--ink-1)" />
        </button>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700,
          color: 'var(--ink-1)', margin: '0 0 20px',
        }}>
          {detail?.name ?? ' '}
        </h1>

        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          <PillButton>날짜 입력하기</PillButton>
          <PillButton>게스트 {items.length}명</PillButton>
          <PillButton>공유하기</PillButton>
        </div>

        {loading ? (
          <div style={{ color: 'var(--ink-3)', fontSize: 15 }}>불러오는 중...</div>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 28,
          }}>
            {items.map(item => <ListingCard key={item.listingId} item={item} />)}
          </div>
        )}
      </main>
    </div>
  );
}

function PillButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      style={{
        height: 38, padding: '0 16px', borderRadius: 999,
        border: '1px solid var(--line-strong)', background: '#fff',
        fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
        color: 'var(--ink-2)', cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function ListingCard({ item }: { item: WishlistDetailItem }) {
  const [hovered, setHovered] = useState(false);
  const cover = item.imageUrls?.[0];

  return (
    <div>
      <div
        style={{ position: 'relative', cursor: 'pointer' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          width: '100%', aspectRatio: '1 / 1',
          borderRadius: 16, overflow: 'hidden',
          background: 'var(--surface-alt-2)',
        }}>
          {cover ? (
            <img
              src={cover}
              alt={item.listingName}
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
            }} />
          )}
        </div>

        <div style={{
          position: 'absolute', top: 12, right: 12,
          width: 30, height: 30, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="heart" size={26} color="#fff" fill="var(--brand-coral)" strokeWidth={1.6} />
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-1)' }}>
          {item.listingName}
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 4 }}>
          ₩{item.pricePerNight.toLocaleString()} <span style={{ color: 'var(--ink-3)' }}>/박</span>
        </div>

        <div style={{
          marginTop: 12, padding: '10px 14px',
          borderRadius: 12, border: '1px solid var(--line)',
          fontSize: 13,
          color: item.note ? 'var(--ink-1)' : 'var(--ink-3)',
          cursor: 'pointer',
        }}>
          {item.note ? item.note : '메모 추가'}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'var(--surface-alt-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <Icon name="heart" size={32} color="var(--ink-3)" />
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-1)', marginBottom: 8 }}>
        저장된 숙소가 없어요
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>
        마음에 드는 숙소를 이 위시리스트에 추가해보세요.
      </div>
    </div>
  );
}
