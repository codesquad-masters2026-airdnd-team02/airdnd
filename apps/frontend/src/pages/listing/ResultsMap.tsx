import { useState, useEffect, useRef } from 'react';
import { Icon } from '../../shared/Icon';
import { won } from '../../shared/utils';
import { createMap, type MapController, type MarkerHandle } from '../../shared/map';
import type { ListingCardResponse } from '../../shared/api/generated/types.gen';

function setPinActive(el: HTMLElement, active: boolean) {
  el.style.background = active ? 'var(--ink-1)' : '#fff';
  el.style.color = active ? '#fff' : '';
  el.style.zIndex = active ? '10' : '';
  el.style.transform = active ? 'scale(1.08)' : 'scale(1)';
}

export function ResultsMap({
  cards,
  onOpen,
  hoveredId,
  likedIds,
}: {
  cards: ListingCardResponse[];
  onOpen: (c: ListingCardResponse) => void;
  hoveredId: number | null;
  likedIds: Set<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapController | null>(null);
  const [ready, setReady] = useState(false);
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;
  const likedIdsRef = useRef(likedIds);
  likedIdsRef.current = likedIds;
  // listingId → 핀 DOM + 오버레이 핸들 + 하트 element
  const pinsRef = useRef<Map<number, { el: HTMLElement; handle: MarkerHandle; heart: HTMLElement }>>(
    new Map(),
  );
  const cardsKey = cards.map(c => c.id).join(',');
  const likedKey = [...likedIds].sort().join(',');

  // 지도 1회 생성
  useEffect(() => {
    if (!ref.current) return;
    let cancelled = false;
    createMap(ref.current, { center: { lat: 37.495, lng: 127.04 }, level: 6 })
      .then(map => {
        if (cancelled) return;
        mapRef.current = map;
        setReady(true);
      })
      .catch(err => console.error(err));
    return () => {
      cancelled = true;
      mapRef.current = null;
    };
  }, []);

  // 카드(페이지) 변경 시 기존 마커 제거 후 새로 그림
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    pinsRef.current.forEach(({ handle }) => handle.remove());
    pinsRef.current.clear();

    // 현재 페이지 핀들의 중심으로 부드럽게 이동(줌 유지)
    const coords = cards
      .filter(c => c.lat != null && c.lng != null)
      .map(c => ({ lat: c.lat!, lng: c.lng! }));
    if (coords.length > 0) {
      const center = {
        lat: coords.reduce((s, c) => s + c.lat, 0) / coords.length,
        lng: coords.reduce((s, c) => s + c.lng, 0) / coords.length,
      };
      map.panTo(center);
    }

    cards.forEach(c => {
      if (c.lat == null || c.lng == null) return;
      const el = document.createElement('div');
      el.style.cssText =
        'display:flex;align-items:center;gap:6px;background:#fff;border-radius:30px;box-shadow:0 2px 8px rgba(0,0,0,0.25);padding:8px 14px;font-weight:700;font-size:14px;cursor:pointer;white-space:nowrap;transition:all 120ms ease;';
      const priceSpan = document.createElement('span');
      priceSpan.textContent = won(c.totalPrice ?? 0);
      const heart = document.createElement('span');
      heart.textContent = '♥';
      const isLiked = c.id != null && likedIdsRef.current.has(c.id);
      heart.style.cssText = `color:var(--brand-coral);font-size:13px;display:${isLiked ? 'inline' : 'none'};`;
      el.append(priceSpan, heart);
      const handle = map.addHtmlMarker({
        coord: { lat: c.lat, lng: c.lng },
        element: el,
        onClick: () => onOpenRef.current(c),
        yAnchor: 1.4,
      });
      el.addEventListener('mouseenter', () => {
        handle.setZIndex(10);
        setPinActive(el, true);
      });
      el.addEventListener('mouseleave', () => {
        handle.setZIndex(0);
        setPinActive(el, false);
      });
      if (c.id != null) pinsRef.current.set(c.id, { el, handle, heart });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, cardsKey]);

  // 카드 hover → 해당 핀 강조 + 맨 앞으로
  useEffect(() => {
    pinsRef.current.forEach(({ el, handle }, id) => {
      const active = id === hoveredId;
      handle.setZIndex(active ? 10 : 0);
      setPinActive(el, active);
    });
  }, [hoveredId]);

  // 위시리스트 상태 → 핀 가격 옆 하트 표시
  useEffect(() => {
    pinsRef.current.forEach(({ heart }, id) => {
      heart.style.display = likedIds.has(id) ? 'inline' : 'none';
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [likedKey]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={ref} style={{ width: '100%', height: '100%' }} />
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          borderRadius: 10,
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden',
        }}
      >
        <ZoomButton icon="plus" onClick={() => mapRef.current?.zoomIn()} />
        <div style={{ height: 1, background: 'var(--line)' }} />
        <ZoomButton icon="minus" onClick={() => mapRef.current?.zoomOut()} />
      </div>
    </div>
  );
}

function ZoomButton({ icon, onClick }: { icon: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 40,
        height: 40,
        border: 'none',
        background: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-alt-2)')}
      onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
    >
      <Icon name={icon} size={18} />
    </button>
  );
}
