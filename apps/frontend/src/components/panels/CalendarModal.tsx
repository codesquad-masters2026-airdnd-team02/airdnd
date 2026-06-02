import { useState } from 'react';
import { Icon } from '../../shared/Icon';
import type { SearchState, DateRange } from '../../types';

const WD = ['일', '월', '화', '수', '목', '금', '토'];

// Fixed months matching the source Figma: May 2021 (starts Sat=6) and June 2021 (starts Tue=2)
const MONTHS = [
  { y: 2021, m: 5, first: 6, days: 31 },
  { y: 2021, m: 6, first: 2, days: 30 },
];

interface CalendarModalProps {
  value: SearchState;
  onChange: (v: SearchState) => void;
}

export function CalendarModal({ value, onChange }: CalendarModalProps) {
  const [range, setRange] = useState<DateRange>(value.range ?? { a: null, b: null });

  function pick(key: string) {
    let next: DateRange;
    if (!range.a || (range.a && range.b)) {
      next = { a: key, b: null };
    } else {
      next = key < range.a ? { a: key, b: null } : { a: range.a, b: key };
    }
    setRange(next);
    if (next.a && next.b) {
      const fmt = (k: string) => `${parseInt(k.split('-')[1])}월 ${parseInt(k.split('-')[2])}일`;
      onChange({ ...value, range: next, dates: `${fmt(next.a)} – ${fmt(next.b)}` });
    } else {
      onChange({ ...value, range: next, dates: '' });
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: 48, justifyContent: 'center' }}>
        <ChevronBtn dir="left" />
        {MONTHS.map((mo) => (
          <Month key={mo.m} mo={mo} range={range} onPick={pick} />
        ))}
        <ChevronBtn dir="right" />
      </div>
    </div>
  );
}

function ChevronBtn({ dir }: { dir: 'left' | 'right' }) {
  return (
    <div
      className="cal-chev"
      style={{
        position: 'absolute',
        top: 0,
        [dir === 'left' ? 'left' : 'right']: -8,
        width: 36,
        height: 36,
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 120ms ease',
      }}
    >
      <Icon
        name={dir === 'left' ? 'chevron-left' : 'chevron-right'}
        size={20}
        color="var(--ink-1)"
      />
    </div>
  );
}

interface MonthProps {
  mo: { y: number; m: number; first: number; days: number };
  range: DateRange;
  onPick: (key: string) => void;
}

function Month({ mo, range, onPick }: MonthProps) {
  const cells: (number | null)[] = [];
  for (let i = 0; i < mo.first; i++) cells.push(null);
  for (let d = 1; d <= mo.days; d++) cells.push(d);

  // Zero-pad month and day so string comparison works correctly (e.g. "09" < "16")
  const key = (d: number) =>
    `${mo.y}-${String(mo.m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const isStart = (d: number) => key(d) === range.a;
  const isEnd   = (d: number) => key(d) === range.b;
  const inRange = (d: number) => {
    if (!range.a || !range.b) return false;
    const k = key(d);
    return k > range.a && k < range.b;
  };
  // Crude "past" disabling: May 1–15 shown muted like the source
  const isPast = (d: number) => mo.m === 5 && d <= 15;

  return (
    <div style={{ width: 300 }}>
      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 16, marginBottom: 18 }}>
        {mo.y}년 {mo.m}월
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {WD.map((w) => (
          <div
            key={w}
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: 'var(--ink-3)',
              paddingBottom: 8,
            }}
          >
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} style={{ height: 42 }} />;
          const start    = isStart(d);
          const end      = isEnd(d);
          const endpoint = start || end;
          const rng      = inRange(d);
          const dis      = isPast(d);

          // Band spans the full cell; half-band on start/end to cap the range strip neatly
          let bandBg = 'transparent';
          if (rng) {
            bandBg = 'var(--surface-alt-2)';
          } else if (start && range.b) {
            // right half only (band extends rightward from start)
            bandBg = 'linear-gradient(to right, transparent 50%, var(--surface-alt-2) 50%)';
          } else if (end && range.a) {
            // left half only (band extends leftward to end)
            bandBg = 'linear-gradient(to left, transparent 50%, var(--surface-alt-2) 50%)';
          }

          return (
            <div
              key={i}
              style={{
                height: 42,
                background: bandBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <button
                disabled={dis}
                onClick={() => onPick(key(d))}
                className="cal-day"
                style={{
                  width: 38,
                  height: 38,
                  border: 'none',
                  borderRadius: '50%',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: dis ? 'default' : 'pointer',
                  background: endpoint ? 'var(--selected)' : 'transparent',
                  color: dis ? 'var(--ink-4)' : endpoint ? '#fff' : 'var(--ink-1)',
                  transition: 'background 120ms ease',
                  position: 'relative',
                  zIndex: 1,
                  flexShrink: 0,
                }}
              >
                {d}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
