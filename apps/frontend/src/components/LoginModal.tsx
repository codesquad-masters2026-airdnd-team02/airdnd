import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../shared/Icon';
import { useAppState } from '../shared/AppState';
import { API_BASE } from '../shared/api/config';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * 로그인 / 회원 가입 모달.
 * 에어비앤비 로그인 UI를 본떴으나 입력은 전화번호·이메일 대신 아이디/비밀번호를 받는다.
 * 현재는 UI 골격만 — 실제 인증 API 연동은 추후 작업.
 */
export function LoginModal({ open, onClose }: LoginModalProps) {
  const navigate = useNavigate();
  const { setLoggedIn } = useAppState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState<'id' | 'pw' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 열릴 때마다 입력 초기화
  useEffect(() => {
    if (open) {
      setUsername('');
      setPassword('');
      setFocused(null);
      setSubmitting(false);
      setError(null);
    }
  }, [open]);

  // ESC 로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const canContinue = username.trim().length > 0 && password.length > 0 && !submitting;

  const handleContinue = async () => {
    if (!canContinue) return;
    setSubmitting(true);
    setError(null);
    try {
      // 세션 폼 로그인(/login) → JWT 발급 REST 로그인(/api/auth/login, JSON)으로 전환.
      // 토큰은 httpOnly 쿠키로 내려오므로 credentials:'include'만 있으면 별도 토큰 저장이 필요 없다.
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: username.trim(), password }),
        credentials: 'include',
      });
      if (res.status === 200) {
        setLoggedIn(true);
        onClose();
        navigate('/');
      } else {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch {
      setError('로그인 요청에 실패했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="로그인 또는 회원 가입"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          width: 480,
          maxWidth: '100%',
          boxShadow: 'var(--shadow-pop)',
          padding: '0 32px 32px',
          boxSizing: 'border-box',
        }}
      >
        {/* 헤더: 닫기 버튼 */}
        <header
          style={{
            position: 'relative',
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <button
            aria-label="닫기"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 6,
              display: 'flex',
              color: 'var(--ink-1)',
            }}
          >
            <Icon name="x" size={20} />
          </button>
        </header>

        {/* 브랜드 마크 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <BrandMark />
        </div>

        <h2
          style={{
            margin: 0,
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--ink-strong)',
          }}
        >
          로그인 또는 회원 가입
        </h2>

        {/* 입력: 아이디 / 비밀번호 (에어비앤비처럼 한 박스에 묶음) */}
        <div
          style={{
            marginTop: 24,
            borderRadius: 12,
            border: '1px solid var(--line-strong)',
            overflow: 'hidden',
          }}
        >
          <input
            value={username}
            placeholder="아이디"
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setFocused('id')}
            onBlur={() => setFocused(null)}
            style={fieldStyle(focused === 'id', true)}
          />
          <div style={{ height: 1, background: 'var(--line)' }} />
          <input
            value={password}
            type="password"
            placeholder="비밀번호"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocused('pw')}
            onBlur={() => setFocused(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canContinue) handleContinue();
            }}
            style={fieldStyle(focused === 'pw', false)}
          />
        </div>

        {/* 계속 버튼 */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          style={{
            marginTop: 16,
            width: '100%',
            height: 52,
            border: 'none',
            borderRadius: 10,
            background: canContinue
              ? 'linear-gradient(to right, #E61E4D, #E31C5F 50%, #D70466)'
              : 'var(--surface-alt-2)',
            color: canContinue ? '#fff' : 'var(--ink-4)',
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            fontWeight: 700,
            cursor: canContinue ? 'pointer' : 'default',
          }}
        >
          {submitting ? '로그인 중...' : '계속'}
        </button>

        {error && (
          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--brand-coral)', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* 구분선: 또는 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            margin: '20px 0 16px',
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>또는</span>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>

        {/* 소셜 로그인 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <SocialButton label="네이버로 로그인">
            <span style={{ color: '#03C75A', fontSize: 22, fontWeight: 900 }}>N</span>
          </SocialButton>
          <SocialButton
            label="구글로 로그인"
            onClick={() => {
              // 백엔드 OAuth2 인가 엔드포인트로 이동 → Google 로그인 → 백엔드 콜백에서 JWT 쿠키 발급 후 프론트로 복귀
              window.location.href = `${API_BASE}/oauth2/authorization/google`;
            }}
          >
            <GoogleG />
          </SocialButton>
          <SocialButton label="애플로 로그인">
            <AppleLogo />
          </SocialButton>
        </div>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--ink-3)' }}>
          계정이 없으신가요?{' '}
          <button
            onClick={() => { onClose(); navigate('/signup'); }}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--ink-1)',
              textDecoration: 'underline',
            }}
          >
            회원 가입
          </button>
        </div>
      </div>
    </div>
  );
}

function fieldStyle(focused: boolean, top: boolean) {
  return {
    width: '100%',
    height: 56,
    padding: '0 16px',
    boxSizing: 'border-box',
    border: 'none',
    outline: focused ? '2px solid var(--ink-1)' : 'none',
    outlineOffset: -2,
    borderRadius: top ? '12px 12px 0 0' : '0 0 12px 12px',
    fontFamily: 'var(--font-sans)',
    fontSize: 15,
    color: 'var(--ink-1)',
    background: '#fff',
  } as const;
}

function SocialButton({ label, children, onClick }: { label: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={{
        width: 64,
        height: 56,
        borderRadius: 12,
        border: '1px solid var(--line-strong)',
        background: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 120ms ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-alt-2)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
    >
      {children}
    </button>
  );
}

/** 코랄 삼각형 브랜드 마크 (로고에서 심볼만 추출) */
function BrandMark() {
  return (
    <svg viewBox="0 0 72 72" width="40" height="40" aria-hidden>
      <rect x="8" y="8" width="56" height="56" rx="14.6" fill="#E84C60" />
      <polygon points="36,19.2 19.2,52.8 52.8,52.8" fill="#fff" />
      <polygon points="36,33.7 30.4,52.8 41.6,52.8" fill="#E84C60" />
    </svg>
  );
}

function GoogleG() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#000" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 2.98-.84.94-2.2 1.66-3.32 1.57-.14-1.13.46-2.32 1.12-3.05.74-.83 2.04-1.46 3.32-1.5zM20.6 17.06c-.6 1.38-.88 1.99-1.65 3.21-1.07 1.7-2.58 3.82-4.46 3.83-1.66.02-2.09-1.08-4.35-1.07-2.26.01-2.73 1.09-4.4 1.07-1.88-.02-3.31-1.92-4.38-3.62C-1.13 17.07-1.41 11.4 1.05 8.4 2.21 6.99 3.99 6.1 5.7 6.1c1.74 0 2.83 1.08 4.27 1.08 1.4 0 2.25-1.08 4.27-1.08 1.52 0 3.13.83 4.28 2.26-3.76 2.06-3.15 7.43.08 8.7z" />
    </svg>
  );
}
