import { API_BASE as BASE } from './config';

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

/** POST /api/payments/confirm 의 결과 (결제 승인 완료 정보). */
export interface PaymentConfirmResult {
  orderId: string;
  /** "DONE" 이면 승인 완료. */
  status: string;
  amount: number;
  method: string;
  /** ISO 8601 문자열. 표시 시 new Date()로 파싱. */
  approvedAt: string;
  reservationId: number;
}

interface Envelope<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

/** 예약(resId)에 대한 결제를 준비한다. 예약은 PENDING 상태여야 하고, 인증 회원(스텁: id=1)의 것이어야 한다. */
export async function preparePayment(reservationId: number): Promise<PaymentPrepareResponse> {
  const res = await fetch(`${BASE}/api/payments/${reservationId}/prepare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  let body: Envelope<PaymentPrepareResponse> | null = null;
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

/**
 * POST /api/payments/confirm — 토스 결제 승인.
 * amount는 반드시 JSON 숫자로 전송한다(URL 문자열 그대로 보내지 말 것).
 *
 * TODO: 실제 세션 인증 도입 시 fetch에 `credentials: 'include'`를 추가하고,
 *       백엔드 WebConfig의 `allowCredentials(true)`와 한 쌍으로 맞춘다(prepare도 동일).
 *       지금은 LoginArgumentResolver가 회원을 고정(id=1)해 세션이 쓰이지 않으므로 생략.
 */
export async function confirmPayment(params: {
  orderId: string;
  paymentKey: string;
  amount: number;
}): Promise<PaymentConfirmResult> {
  const res = await fetch(`${BASE}/api/payments/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  let body: Envelope<PaymentConfirmResult> | null = null;
  try {
    body = await res.json();
  } catch {
    /* 바디 없음 */
  }

  if (!res.ok || !body?.success || !body.data) {
    throw new Error(body?.message ?? `결제 승인에 실패했어요 (${res.status})`);
  }
  return body.data;
}
