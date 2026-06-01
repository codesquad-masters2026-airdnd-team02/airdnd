import { Header } from '../components/Header';
import { Icon } from '../shared/Icon';
import { won } from '../shared/utils';
import type { Listing, SearchState } from '../types';

import listing1 from '../assets/listing-1.png';
import listing2 from '../assets/listing-2.png';
import listing3 from '../assets/listing-3.png';
import listing4 from '../assets/listing-4.png';

const ASSET_MAP: Record<string, string> = {
  'listing-1': listing1,
  'listing-2': listing2,
  'listing-3': listing3,
  'listing-4': listing4,
};

const AMENITIES = ['주방', '무선 인터넷', '에어컨', '헤어드라이어', '세탁기', '무료 주차'];

interface DetailProps {
  listing: Listing;
  search: SearchState;
  onBack: () => void;
  onLogo: () => void;
  onReserve: () => void;
}

export function Detail({ listing, search, onBack, onLogo, onReserve }: DetailProps) {
  const l = listing;
  const nights = 1;
  const fee = Math.round(l.price * 0.099);
  const tax = Math.round(l.price * 0.014);
  const total = l.price * nights + fee + tax;

  const checkin = search.dates ? search.dates.split(' – ')[0] : '날짜 입력';
  const checkout = search.dates ? search.dates.split(' – ')[1] : '날짜 입력';

  return (
    <div>
      <Header mode="compact" search={search} onSearchPill={onBack} onLogo={onLogo} />
      <div style={{ padding: '28px 80px 80px', maxWidth: 1320, margin: '0 auto' }}>
        {/* Back link */}
        <div
          className="back"
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            marginBottom: 16,
            fontSize: 14,
            color: 'var(--ink-2)',
            transition: 'color 120ms ease',
          }}
        >
          <Icon name="chevron-left" size={18} />
          검색 결과로
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 26,
            marginBottom: 6,
          }}
        >
          {l.title}
        </h1>

        {/* Rating + location */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          <Icon name="star" size={15} color="var(--star)" fill="var(--star)" />
          <b>{l.rating}</b>
          <span style={{ color: 'var(--ink-3)' }}>· 후기 {l.reviews}개 · {l.loc}</span>
        </div>

        {/* Photo gallery */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: 8,
            height: 420,
            borderRadius: 16,
            overflow: 'hidden',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              gridRow: '1 / span 2',
              background: `url(${ASSET_MAP[l.img]}) center/cover`,
            }}
          />
          <div style={{ background: `url(${ASSET_MAP['listing-2']}) center/cover` }} />
          <div style={{ background: `url(${ASSET_MAP['listing-3']}) center/cover` }} />
          <div style={{ background: `url(${ASSET_MAP['listing-4']}) center/cover` }} />
          <div style={{ background: `url(${ASSET_MAP['listing-1']}) center/cover` }} />
        </div>

        <div style={{ display: 'flex', gap: 64, alignItems: 'flex-start' }}>
          {/* Left: listing info */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                paddingBottom: 24,
                borderBottom: '1px solid var(--line)',
              }}
            >
              {l.loc}, 호스트 airdnd님
            </div>
            <div
              style={{
                fontSize: 15,
                color: 'var(--ink-1)',
                lineHeight: 1.9,
                padding: '24px 0',
                borderBottom: '1px solid var(--line)',
              }}
            >
              {l.specs}
              <br />
              {l.amen}
              <br />
              <br />
              깨끗하고 아늑한 공간에서 여행을 살아보세요. 대중교통이 가깝고, 주변에 카페와
              편의시설이 많아 단기 여행은 물론 장기 체류에도 좋습니다. 체크인 전 안내 메시지를
              보내드립니다.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, paddingTop: 24 }}>
              {AMENITIES.map((a) => (
                <span
                  key={a}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 30,
                    border: '1px solid var(--line-strong)',
                    fontSize: 14,
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Right: reservation cost card */}
          <div style={{ flex: '0 0 360px', position: 'sticky', top: 100 }}>
            <div
              style={{
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: 16,
                boxShadow: 'var(--shadow-lg)',
                padding: 24,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span>
                  <b style={{ fontSize: 22 }}>{won(l.price)}</b>{' '}
                  <span style={{ color: 'var(--ink-3)' }}>/ 박</span>
                </span>
                <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 700 }}>
                  후기 {l.reviews}개
                </span>
              </div>

              {/* Date + guest field group */}
              <div
                style={{
                  border: '1px solid var(--line-strong)',
                  borderRadius: 10,
                  margin: '16px 0',
                }}
              >
                <div style={{ display: 'flex' }}>
                  <FieldCell label="체크인" val={checkin} borderRight />
                  <FieldCell label="체크아웃" val={checkout} />
                </div>
                <div style={{ borderTop: '1px solid var(--line-strong)' }}>
                  <FieldCell label="인원" val={search.guestLabel || '게스트 1명'} />
                </div>
              </div>

              <button
                onClick={onReserve}
                className="reserve-btn"
                style={{
                  width: '100%',
                  height: 50,
                  border: 'none',
                  borderRadius: 10,
                  background: 'var(--cta-dark)',
                  color: '#fff',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: 'pointer',
                  transition: 'background 120ms ease',
                }}
              >
                예약하기
              </button>

              <div
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  color: 'var(--ink-3)',
                  margin: '16px 0 20px',
                }}
              >
                예약 확정 전에는 요금이 청구되지 않습니다.
              </div>

              <PriceRow label={`${won(l.price)} x ${nights}박`} value={won(l.price * nights)} />
              <PriceRow label="서비스 수수료" value={won(fee)} />
              <PriceRow label="숙박세와 수수료" value={won(tax)} />

              <div
                style={{
                  borderTop: '1px solid var(--line)',
                  marginTop: 14,
                  paddingTop: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                <span>총 합계</span>
                <span>{won(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldCell({
  label,
  val,
  borderRight,
}: {
  label: string;
  val: string;
  borderRight?: boolean;
}) {
  return (
    <div
      style={{
        flex: 1,
        padding: '11px 14px',
        borderRight: borderRight ? '1px solid var(--line-strong)' : 'none',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 3 }}>{val}</div>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 15,
        color: 'var(--ink-1)',
        padding: '6px 0',
      }}
    >
      <span
        style={{
          textDecoration: 'underline',
          textDecorationColor: 'var(--ink-4)',
        }}
      >
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}
