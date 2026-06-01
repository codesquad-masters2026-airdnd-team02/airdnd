import { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { Results, LISTINGS } from './pages/Results';
import { Detail } from './pages/Detail';
import { HostDashboard } from './pages/host/HostDashboard';
import { HostListingForm } from './pages/host/HostListingForm';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { MyPage } from './pages/mypage/MyPage';
import { Icon } from './shared/Icon';
import type { SearchState, Listing, HostListing, View } from './types';

const DEFAULT_SEARCH: SearchState = {
  dates: '',
  range: null,
  price: null,
  priceLabel: '',
  guests: { adult: 1, child: 0, infant: 0 },
  guestLabel: '',
};

const SAMPLE_HOST_LISTINGS: HostListing[] = [
  {
    id: '1',
    title: 'Spacious and Comfortable cozy house #4',
    loc: '서초구, 서울',
    roomType: '집 전체',
    description: '깨끗하고 아늑한 공간에서 여행을 살아보세요. 대중교통이 가깝고 주변에 카페와 편의시설이 많습니다.',
    price: 82953,
    maxGuests: 3,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ['주방', '무선 인터넷', '에어컨', '헤어드라이어'],
    imageUrls: [],
    active: true,
  },
  {
    id: '2',
    title: '#자가격리 #공부 #강남 #선릉역3분',
    loc: 'Yeoksam-dong, Gangnam-gu, 서울',
    roomType: '집 전체',
    description: '강남 중심가에 위치한 깔끔한 숙소입니다. 선릉역 도보 3분 거리입니다.',
    price: 96095,
    maxGuests: 4,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: ['주방', '무선 인터넷', '에어컨', 'TV'],
    imageUrls: [],
    active: false,
  },
  {
    id: '3',
    title: '[장기 임대 할인] 강남 양재천 실평수 30평',
    loc: 'Yangjae-dong, Seocho-gu, 서울',
    roomType: '집 전체',
    description: '양재천 바로 옆 넓고 쾌적한 숙소입니다. 장기 투숙 시 할인 혜택을 드립니다.',
    price: 115126,
    maxGuests: 6,
    bedrooms: 2,
    beds: 3,
    bathrooms: 1,
    amenities: ['주방', '무선 인터넷', '에어컨', '세탁기', '무료 주차'],
    imageUrls: [],
    active: true,
  },
];

export default function App() {
  const [view, setView] = useState<View>('home');
  const [listing, setListing] = useState<Listing>(LISTINGS[0]);
  const [confirm, setConfirm] = useState(false);
  const [search, setSearch] = useState<SearchState>(DEFAULT_SEARCH);
  const [hostListings, setHostListings] = useState<HostListing[]>(SAMPLE_HOST_LISTINGS);
  const [editingListing, setEditingListing] = useState<HostListing | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  function openDetail(l: Listing) {
    setListing(l);
    setView('detail');
  }

  function openEdit(l: HostListing) {
    setEditingListing(l);
    setView('host-edit');
  }

  function saveHostListing(data: Omit<HostListing, 'id' | 'active'>) {
    if (editingListing) {
      setHostListings(prev =>
        prev.map(l => l.id === editingListing.id ? { ...editingListing, ...data } : l)
      );
    } else {
      const newListing: HostListing = {
        ...data,
        id: Date.now().toString(),
        active: true,
      };
      setHostListings(prev => [...prev, newListing]);
    }
    setEditingListing(null);
    setView('host-dashboard');
  }

  function toggleActive(id: string) {
    setHostListings(prev =>
      prev.map(l => l.id === id ? { ...l, active: !l.active } : l)
    );
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
        />
      )}
      {(view === 'host-new' || view === 'host-edit') && (
        <HostListingForm
          listing={view === 'host-edit' ? editingListing : null}
          onSave={saveHostListing}
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
