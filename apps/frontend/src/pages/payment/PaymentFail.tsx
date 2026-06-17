import { useSearchParams } from 'react-router-dom';

/**
 * 토스 결제창이 결제 요청 실패/취소 시 리다이렉트하는 페이지.
 * URL 형식: /payments/fail?code=...&message=...&orderId=...
 *
 * 실패 페이지에서는 confirm(결제 승인)을 절대 호출하지 않는다. 오류 정보 표시만 한다.
 */
export function PaymentFail() {
  const [params] = useSearchParams();
  const code = params.get('code');
  const message = params.get('message');
  const orderId = params.get('orderId');

  return (
    <div style={wrapStyle}>
      <div style={{ fontSize: 48, lineHeight: 1 }}>⚠️</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '16px 0 4px' }}>결제에 실패했어요</h1>
      <p style={{ color: 'var(--brand-coral)', marginBottom: 24 }}>{message ?? '결제가 취소되었거나 오류가 발생했어요.'}</p>
      <dl style={{ textAlign: 'left', margin: 0 }}>
        <Row label="code" value={code} />
        <Row label="orderId" value={orderId} />
      </dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--line-soft)' }}>
      <dt style={{ width: 120, color: 'var(--ink-3)', flex: 'none' }}>{label}</dt>
      <dd style={{ margin: 0, wordBreak: 'break-all', fontWeight: 600 }}>{value ?? '-'}</dd>
    </div>
  );
}

const wrapStyle = {
  maxWidth: 520,
  margin: '0 auto',
  padding: '80px 24px',
  textAlign: 'center',
  fontFamily: 'var(--font-sans)',
} as const;
