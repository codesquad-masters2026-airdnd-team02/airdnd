import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Home } from './pages/Home';
import { Results, LISTINGS } from './pages/Results';
import { Detail } from './pages/Detail';
import { HostDashboard } from './pages/host/HostDashboard';
import { HostListingForm } from './pages/host/HostListingForm';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { MyPage } from './pages/mypage/MyPage';
import { WishlistPage } from './pages/wishlist/WishlistPage';
import { WishlistDetailPage } from './pages/wishlist/WishlistDetailPage';
import { Icon } from './shared/Icon';
import {
  getHostListingsOptions,
  activateListingMutation,
  deactivateListingMutation,
} from './shared/api/generated/@tanstack/react-query.gen';
import { toHostListing, HOST_STUB } from './shared/api/hostMapping';
import type { SearchState, Listing, HostListing, View } from './types';

const DEFAULT_SEARCH: SearchState = {
  dates: '',
  range: null,
  price: null,
  priceLabel: '',
  guests: { adult: 1, child: 0, infant: 0 },
  guestLabel: '',
};

export default function App() {
  const [view, setView] = useState<View>('home');
  const [listing, setListing] = useState<Listing>(LISTINGS[0]);
  const [confirm, setConfirm] = useState(false);
  const [search, setSearch] = useState<SearchState>(DEFAULT_SEARCH);
  const [editingListing, setEditingListing] = useState<HostListing | null>(null);
  const [selectedWishlistId, setSelectedWishlistId] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // ── 호스트 숙소 목록 조회 ──
  const {
    data: hostListingsData,
    isLoading: isListingsLoading,
    refetch: refetchListings,
  } = useQuery(getHostListingsOptions({ query: { host: HOST_STUB } }));

  const hostListings = hostListingsData?.data?.listings?.map(toHostListing) ?? [];

  // ── 활성화 / 비활성화 ──
  const activateMutation = useMutation(activateListingMutation());
  const deactivateMutation = useMutation(deactivateListingMutation());

  function toggleActive(id: string) {
    const target = hostListings.find(l => l.id === id);
    if (!target) return;

    const listingsId = Number(id);

    if (target.active) {
      deactivateMutation.mutate(
        { path: { listingsId }, query: { host: HOST_STUB } },
        { onSuccess: () => refetchListings() },
      );
    } else {
      activateMutation.mutate(
        { path: { listingsId }, query: { host: HOST_STUB } },
        {
          onSuccess: () => refetchListings(),
          onError: () => alert('활성화에 실패했습니다. 관리자 승인이 필요한 숙소입니다.'),
        },
      );
    }
  }

  // 숙소 등록/수정 완료 후 대시보드로 복귀
  function handleFormSave() {
    setEditingListing(null);
    refetchListings();
    setView('host-dashboard');
  }

  function openDetail(l: Listing) {
    setListing(l);
    setView('detail');
  }

  function openEdit(l: HostListing) {
    setEditingListing(l);
    setView('host-edit');
  }

  return (
    <div>
      {view === 'home' && (
        <Home
          search={search}
          onChange={setSearch}
          onSearch={() => setView('results')}
          onHosting={() => setView('host-dashboard')}
          onAdmin={() => setView('admin')}
          onMyPage={() => setView('mypage')}
        />
      )}
      {view === 'results' && (
        <Results
          search={search}
          onLogo={() => setView('home')}
          onSearchPill={() => setView('home')}
          onOpen={openDetail}
          onHosting={() => setView('host-dashboard')}
          onAdmin={() => setView('admin')}
          onMyPage={() => setView('mypage')}
        />
      )}
      {view === 'detail' && (
        <Detail
          listing={listing}
          search={search}
          onLogo={() => setView('home')}
          onBack={() => setView('results')}
          onReserve={() => setConfirm(true)}
          onHosting={() => setView('host-dashboard')}
          onAdmin={() => setView('admin')}
          onMyPage={() => setView('mypage')}
        />
      )}
      {view === 'host-dashboard' && (
        <HostDashboard
          listings={hostListings}
          isLoading={isListingsLoading}
          onLogo={() => setView('home')}
          onNew={() => { setEditingListing(null); setView('host-new'); }}
          onEdit={openEdit}
          onToggleActive={toggleActive}
        />
      )}
      {view === 'admin' && (
        <AdminDashboard
          onLogo={() => setView('home')}
        />
      )}
      {view === 'mypage' && (
        <MyPage
          onLogo={() => setView('home')}
          onHosting={() => setView('host-dashboard')}
          onWishlists={() => setView('wishlists')}
        />
      )}
      {view === 'wishlists' && (
        <WishlistPage
          onLogo={() => setView('home')}
          onHosting={() => setView('host-dashboard')}
          onOpenWishlist={(id) => { setSelectedWishlistId(id); setView('wishlist-detail'); }}
        />
      )}
      {view === 'wishlist-detail' && selectedWishlistId !== null && (
        <WishlistDetailPage
          wishlistId={selectedWishlistId}
          onBack={() => setView('wishlists')}
          onLogo={() => setView('home')}
          onHosting={() => setView('host-dashboard')}
        />
      )}
      {(view === 'host-new' || view === 'host-edit') && (
        <HostListingForm
          listing={view === 'host-edit' ? editingListing : null}
          onSave={handleFormSave}
          onBack={() => setView('host-dashboard')}
        />
      )}

      {/* Confirmation modal */}
      {confirm && (
        <div
          onClick={() => setConfirm(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '40px 44px',
              width: 420,
              textAlign: 'center',
              boxShadow: 'var(--shadow-pop)',
            }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--brand-coral)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Icon name="check" size={30} color="#fff" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, marginBottom: 10 }}>
              예약이 요청되었어요!
            </div>
            <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.6, marginBottom: 28 }}>
              호스트가 확정하면 알림을 보내드릴게요.<br />
              예약 확정 전에는 요금이 청구되지 않습니다.
            </div>
            <button
              onClick={() => setConfirm(false)}
              style={{
                width: '100%', height: 48, border: 'none', borderRadius: 10,
                background: 'var(--cta-dark)', color: '#fff',
                fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, cursor: 'pointer',
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
