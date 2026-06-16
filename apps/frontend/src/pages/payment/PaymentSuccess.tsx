import { useSearchParams } from 'react-router-dom';

/**
 * 토스 결제창이 결제 요청 성공 후 리다이렉트하는 페이지.
 * URL 형식: /payments/success?paymentType=...&amount=...&orderId=...&paymentKey=...
 *
 * 이 브랜치 범위에서는 파라미터 수신·표시까지만 한다.
 * 실제 결제 승인(confirm)은 백엔드 범위 밖이라 호출하지 않는다.
 */
export function PaymentSuccess() {
  const [params] = useSearchParams();
  const paymentKey = params.get('paymentKey');
  const orderId = params.get('orderId');
  const amount = params.get('amount');
  const paymentType = params.get('paymentType');

  // TODO: confirm 호출 — paymentKey/orderId/amount 를 백엔드 결제 승인 API로 전달해 결제를 확정한다.

  return (
    <div style={wrapStyle}>
      <div style={{ fontSize: 48, lineHeight: 1 }}>✅</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '16px 0 4px' }}>결제 요청이 완료됐어요</h1>
      <p style={{ color: 'var(--ink-3)', marginBottom: 24 }}>
        아래 정보로 결제 승인(confirm)을 진행할 수 있어요. (현재 브랜치 범위 밖)
      </p>
      <dl style={listStyle}>
        <Row label="orderId" value={orderId} />
        <Row label="paymentKey" value={paymentKey} />
        <Row label="amount" value={amount} />
        <Row label="paymentType" value={paymentType} />
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

const listStyle = { textAlign: 'left', margin: 0 } as const;
