import { useState, useRef, useEffect } from 'react';
import { Icon } from '../shared/Icon';
import logoSvg from '../assets/logo.svg';
import type { SearchState } from '../types';

interface HeaderProps {
  mode?: 'full' | 'compact' | 'minimal';
  search?: SearchState;
  onLogo?: () => void;
  onSearchPill?: () => void;
  onHosting?: () => void;
  onAdmin?: () => void;
  onMyPage?: () => void;
}

export function Header({ mode = 'full', search, onLogo, onSearchPill, onHosting, onAdmin, onMyPage }: HeaderProps) {
  const compact = mode === 'compact';
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header
      style={{
        position: compact ? 'sticky' : 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        height: compact ? 80 : 94,
        display: 'flex',
        alignItems: 'center',
        padding: '0 48px',
        background: compact ? 'var(--surface)' : 'transparent',
        borderBottom: compact ? '1px solid var(--line)' : 'none',
      }}
    >
      {/* Left: wordmark */}
      <div style={{ flex: 1 }}>
        <img
          src={logoSvg}
          alt="airdnd"
          onClick={onLogo}
          style={{ height: 44, cursor: 'pointer', display: 'block' }}
        />
      </div>

      {/* Center: search pill (compact) / nav (full) / 없음 (minimal) */}
      {compact ? (
        <div
          onClick={onSearchPill}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            height: 48,
            padding: '0 8px 0 20px',
            borderRadius: 60,
            flexShrink: 0,
            border: '1px solid var(--line-strong)',
            boxShadow: 'var(--shadow-md)',
            cursor: 'pointer',
            background: '#fff',
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap' }}>
            {search?.dates || '날짜 입력'}
          </span>
          <PillDivider />
          <span style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap' }}>
            {search?.priceLabel || '금액대'}
          </span>
          <PillDivider />
          <span style={{ fontSize: 14, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>
            {search?.guestLabel || '게스트 추가'}
          </span>
          <span
            style={{
              marginLeft: 14,
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'var(--brand-coral)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="search" size={16} color="#fff" />
          </span>
        </div>
      ) : mode === 'full' ? (
        <nav
          style={{
            display: 'flex',
            gap: 60,
            fontSize: 16,
            color: 'var(--ink-1)',
            fontWeight: 500,
          }}
        >
          <a className="gnb-link">숙소</a>
          <a className="gnb-link">체험</a>
          <a className="gnb-link">온라인 체험</a>
        </nav>
      ) : null}

      {/* Right: hosting button + account pill */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
        <button
          onClick={onHosting}
          style={{
            height: 40,
            padding: '0 16px',
            border: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--ink-1)',
            cursor: 'pointer',
            borderRadius: 8,
            transition: 'background 120ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          호스팅 하기
        </button>
        <div ref={menuRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setMenuOpen(v => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              height: 44,
              padding: '4px 4px 4px 16px',
              borderRadius: 60,
              border: '1px solid var(--line-strong)',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            <Icon name="menu" size={16} color="var(--ink-1)" />
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'var(--ink-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="user" size={16} color="#fff" />
            </span>
          </div>

          {menuOpen && (
            <div
              className="popover-enter"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: 200,
                background: '#fff',
                borderRadius: 14,
                boxShadow: 'var(--shadow-pop)',
                border: '1px solid var(--line)',
                overflow: 'hidden',
                zIndex: 60,
              }}
            >
              <MenuItem onClick={() => { setMenuOpen(false); onMyPage?.(); }}>
                마이 페이지
              </MenuItem>
              <div style={{ height: 1, background: 'var(--line)' }} />
              <MenuItem onClick={() => { setMenuOpen(false); onAdmin?.(); }}>
                관리자 페이지
              </MenuItem>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuItem({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        padding: '13px 18px',
        fontSize: 14,
        fontWeight: 500,
        color: disabled ? 'var(--ink-4)' : 'var(--ink-1)',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        transition: 'background 100ms ease',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'var(--surface-alt-2)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </div>
  );
}

function PillDivider() {
  return (
    <span
      style={{
        width: 1,
        height: 22,
        background: 'var(--line)',
        margin: '0 16px',
        flexShrink: 0,
      }}
    />
  );
}
