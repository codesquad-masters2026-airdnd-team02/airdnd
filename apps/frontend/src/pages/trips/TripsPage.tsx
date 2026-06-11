import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { listingImage } from '../reservation/utils';
import { Icon } from '../../shared/Icon';
import { useAppState } from '../../shared/AppState';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function dayMark(dateStr: string | null | undefined): { wd: string; day: string } {
  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return { wd: WEEKDAYS[d.getDay()], day: String(d.getDate()) };
    }
  }
  return { wd: '', day: '–' };
}

export function TripsPage() {
  const navigate = useNavigate();
  const { search, selectedListing: listing } = useAppState();
  const onViewListing = () => navigate(`/listings/${listing.id}`);
  const dates = search.dates || '날짜 미정';
  const checkIn = dayMark(search.range?.a);
  const checkOut = dayMark(search.range?.b);
  const [showTimeline, setShowTimeline] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)' }}>
      <Header mode="minimal" />

      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '130px 48px 80px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 34, marginBottom: 28 }}>
          여행
        </h1>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>{listing.loc}</h2>

        {/* 예약 카드 (클릭 시 타임라인 토글) */}
        <div
          onClick={() => setShowTimeline(v => !v)}
          style={{
            display: 'flex',
            gap: 32,
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: 16,
            boxShadow: 'var(--shadow-lg)',
            padding: 20,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 420,
              flexShrink: 0,
              borderRadius: 12,
              overflow: 'hidden',
              aspectRatio: '3 / 2',
            }}
          >
            <img
              src={listingImage(listing.img)}
              alt={listing.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <span
              style={{
                position: 'absolute',
                top: 14,
                left: 14,
                background: 'rgba(255,255,255,0.92)',
                borderRadius: 20,
                padding: '6px 14px',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--ink-2)',
              }}
            >
              대기 중
            </span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px 0' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26 }}>
              {listing.title}
            </div>
            <div style={{ fontSize: 16, color: 'var(--ink-3)', marginTop: 10 }}>
              {dates} · 호스트 airdnd님
            </div>

            <div
              style={{
                marginTop: 'auto',
                borderTop: '1px solid var(--line)',
                paddingTop: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: 20,
              }}
            >
              <div style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.5 }}>{listing.loc}</div>
              <button
                onClick={(e) => { e.stopPropagation(); onViewListing(); }}
                style={{
                  flexShrink: 0,
                  border: 'none',
                  borderRadius: 10,
                  background: 'var(--surface-alt-2)',
                  padding: '12px 22px',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--ink-1)',
                }}
              >
                찾아가는 길
              </button>
            </div>
          </div>
        </div>

        {/* 체크인 / 체크아웃 타임라인 (카드 클릭 시) */}
        <AnimatePresence initial={false}>
          {showTimeline && (
            <motion.div
              key="timeline"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ position: 'relative', marginTop: 24 }}>
                {/* 연결선: 체크아웃 요일과 안 겹치게 위에서 끝나고 아래로 갈수록 흐려짐 */}
                <div
                  style={{
                    position: 'absolute',
                    left: 31,
                    top: 44,
                    bottom: 78,
                    width: 1,
                    background: 'linear-gradient(to bottom, var(--line-strong), transparent)',
                  }}
                />
                <TimelineRow mark={checkIn} icon="🚪" text="오후 3:00 이후 체크인" />
                <TimelineRow mark={checkOut} icon="🏠" text="오전 11:00 이전 체크아웃" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TimelineRow({
  mark,
  icon,
  text,
}: {
  mark: { wd: string; day: string };
  icon: string;
  text: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16, position: 'relative' }}>
      <div style={{ width: 64, flexShrink: 0, textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 6 }}>{mark.wd}</div>
        <div
          style={{
            width: 44,
            height: 44,
            margin: '0 auto',
            borderRadius: '50%',
            background: 'var(--surface-alt-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          {mark.day}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          background: '#fff',
          border: '1px solid var(--line)',
          borderRadius: 16,
          boxShadow: 'var(--shadow-md)',
          padding: '18px 22px',
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            flexShrink: 0,
            borderRadius: 10,
            background: 'var(--surface-alt)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1, fontSize: 17, fontWeight: 600 }}>{text}</div>
        <Icon name="chevron-right" size={20} color="var(--ink-3)" />
      </div>
    </div>
  );
}
