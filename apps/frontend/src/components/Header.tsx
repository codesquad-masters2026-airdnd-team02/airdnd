import { Icon } from '../shared/Icon';
import logoSvg from '../assets/logo.svg';
import type { SearchState } from '../types';

interface HeaderProps {
  mode?: 'full' | 'compact';
  search?: SearchState;
  onLogo?: () => void;
  onSearchPill?: () => void;
}

export function Header({ mode = 'full', search, onLogo, onSearchPill }: HeaderProps) {
  const compact = mode === 'compact';

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

      {/* Center: search pill (compact) or nav (full) */}
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
      ) : (
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
      )}

      {/* Right: account pill */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <div
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
      </div>
    </header>
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
