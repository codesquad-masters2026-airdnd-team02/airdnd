import { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { Results, LISTINGS } from './pages/Results';
import { Detail } from './pages/Detail';
import { Icon } from './shared/Icon';
import type { SearchState, Listing, View } from './types';

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  function openDetail(l: Listing) {
    setListing(l);
    setView('detail');
  }

  return (
    <div>
      {view === 'home' && (
        <Home
          search={search}
          onChange={setSearch}
          onSearch={() => setView('results')}
        />
      )}
      {view === 'results' && (
        <Results
          search={search}
          onLogo={() => setView('home')}
          onSearchPill={() => setView('home')}
          onOpen={openDetail}
        />
      )}
      {view === 'detail' && (
        <Detail
          listing={listing}
          search={search}
          onLogo={() => setView('home')}
          onBack={() => setView('results')}
          onReserve={() => setConfirm(true)}
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
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'var(--brand-coral)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <Icon name="check" size={30} color="#fff" />
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 22,
                marginBottom: 10,
              }}
            >
              예약이 요청되었어요!
            </div>
            <div
              style={{
                fontSize: 14,
                color: 'var(--ink-3)',
                lineHeight: 1.6,
                marginBottom: 28,
              }}
            >
              호스트가 확정하면 알림을 보내드릴게요.
              <br />
              예약 확정 전에는 요금이 청구되지 않습니다.
            </div>
            <button
              onClick={() => setConfirm(false)}
              style={{
                width: '100%',
                height: 48,
                border: 'none',
                borderRadius: 10,
                background: 'var(--cta-dark)',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
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
