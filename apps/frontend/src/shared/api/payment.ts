const BASE = 'http://localhost:8080';

/** POST /api/payments/{resId}/prepare 가 돌려주는 결제 준비 정보.
 *  orderId/orderName/successUrl/failUrl/amount 모두 서버가 확정한 값으로, 그대로 토스에 넘긴다. */
export interface PaymentPrepareResponse {
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
  /** 결제 금액(원 단위). 서버는 BigDecimal → JSON 숫자로 직렬화한다. */
  amount: number;
}

interface Envelope {
  success?: boolean;
  data?: PaymentPrepareResponse;
  message?: string;
}

/** 예약(resId)에 대한 결제를 준비한다. 예약은 PENDING 상태여야 하고, 인증 회원(스텁: id=1)의 것이어야 한다. */
export async function preparePayment(reservationId: number): Promise<PaymentPrepareResponse> {
  const res = await fetch(`${BASE}/api/payments/${reservationId}/prepare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  let body: Envelope | null = null;
  try {
    body = await res.json();
  } catch {
    /* 바디 없음 */
  }

  if (!res.ok || !body?.success || !body.data) {
    throw new Error(body?.message ?? `결제 준비에 실패했어요 (${res.status})`);
  }
  return body.data;
}
