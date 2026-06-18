import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { SlimHeader } from './components/SlimHeader';
import { ReservationSummary } from './components/ReservationSummary';
import { PaymentModal, type PayStatus } from './components/PaymentModal';
import { createReservationMutation } from '../../shared/api/generated/@tanstack/react-query.gen';
import { GUEST_STUB, toReservationRequest, reservationErrorMessage } from '../../shared/api/reservationMapping';
import { preparePayment, cancelPayment } from '../../shared/api/payment';
import { startCardPayment } from '../../shared/payment/toss';
import { Icon } from '../../shared/Icon';
import { won } from '../../shared/utils';
import { nightsOf } from './utils';
import { LISTINGS } from '../Results';
import { useAppState } from '../../shared/AppState';
import tossLogo from '../../assets/toss-logo.png';
import gpayLogo from '../../assets/gpay-logo.png';

type PayMethod = 'toss' | 'gpay';

export function Checkout() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { search, setSearch, selectedListing } = useAppState();
  const listing = LISTINGS.find((item) => String(item.id) === id) ?? selectedListing;
  const onChange = setSearch;
  const onBack = () => navigate(`/listings/${listing.id}`);

  const [payStatus, setPayStatus] = useState<PayStatus | null>(null);
  const [payError, setPayError] = useState<string>('');
  const [method, setMethod] = useState<PayMethod>('toss');

  const reserveMutation = useMutation(createReservationMutation());

  function fail(message: string) {
    setPayError(message);
    setPayStatus('fail');
  }

  function handlePay() {
    let body;
    try {
      body = toReservationRequest(search);
    } catch (e) {
      fail(e instanceof Error ? e.message : '예약 정보를 확인해주세요.');
      return;
    }
    setPayStatus('loading');
    reserveMutation.mutate(
      { path: { listingId: listing.id }, query: { guest: GUEST_STUB }, body },
      {
        onSuccess: async (res) => {
          const reservationId = res.data?.reservationId;
          if (reservationId == null) {
            fail('예약 번호를 받지 못했어요.');
            return;
          }
          let prepare;
          try {
            prepare = await preparePayment(reservationId);
          } catch (e) {
            // prepare 실패 — 아직 hold(READY 결제)가 없으니 cancel 불필요.
            fail(e instanceof Error ? e.message : '결제 준비에 실패했어요.');
            return;
          }
          try {
            // 결제창 호출. 결제 성공/실패는 토스가 success/fail 페이지로 리다이렉트한다.
            await startCardPayment(prepare);
          } catch (e) {
            // 사용자가 결제창을 닫는(X) 등 요청이 중단되면 리다이렉트 없이 여기로 떨어진다.
            // failUrl을 안 거치므로 잡아둔 hold를 여기서 직접 해제한다(best-effort).
            cancelPayment(prepare.orderId).catch(() => {});
            fail(e instanceof Error ? e.message : '결제가 취소되었어요.');
          }
        },
        onError: (err) => fail(reservationErrorMessage(err)),
      },
    );
  }

  const nights = nightsOf(search);
  const roomTotal = listing.price * nights;
  const total = roomTotal;
  const paying = payStatus === 'loading';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)' }}>
      <SlimHeader />

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 48px 80px 160px' }}>
        {/* 스크롤 시 좌측에 고정되는 뒤로가기 버튼 */}
        <div style={{ position: 'sticky', top: 96, height: 0, zIndex: 30 }}>
          <button
            onClick={onBack}
            aria-label="뒤로"
            style={{
              marginLeft: -64,
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: 'none',
              background: 'var(--surface-alt-2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 120ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--line)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface-alt-2)')}
          >
            <Icon name="chevron-left" size={22} />
          </button>
        </div>

        {/* 타이틀 */}
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 30, marginBottom: 36 }}>
          확인 및 결제
        </h1>

        <div style={{ display: 'flex', gap: 64, alignItems: 'flex-start' }}>
          {/* 좌측: 결제 (토스 단일) */}
          <div style={{ flex: 1, maxWidth: 480 }}>
            <section
              style={{
                border: '1px solid var(--line)',
                borderRadius: 16,
                padding: 24,
                background: '#fff',
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink-1)', margin: '0 0 16px' }}>
                결제 수단
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <MethodRow
                  logo={tossLogo}
                  logoHeight={34}
                  label="토스페이먼츠"
                  selected={method === 'toss'}
                  onSelect={() => setMethod('toss')}
                />
                <MethodRow
                  logo={gpayLogo}
                  logoHeight={22}
                  label="Google Pay"
                  selected={method === 'gpay'}
                  onSelect={() => setMethod('gpay')}
                />
              </div>

              {method === 'toss' ? (
                <>
                  <button
                    onClick={handlePay}
                    disabled={paying}
                    style={{
                      width: '100%',
                      height: 52,
                      marginTop: 20,
                      border: 'none',
                      borderRadius: 12,
                      background: paying ? 'var(--surface-alt-2)' : 'var(--cta-dark)',
                      color: paying ? 'var(--ink-4)' : '#fff',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: paying ? 'default' : 'pointer',
                    }}
                  >
                    {paying ? '결제 진행 중…' : `${won(total)} 결제하기`}
                  </button>
                  <p style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center', marginTop: 12 }}>
                    결제하기를 누르면 토스 결제창이 열립니다.
                  </p>
                </>
              ) : (
                <button
                  disabled
                  style={{
                    width: '100%',
                    height: 52,
                    marginTop: 20,
                    border: 'none',
                    borderRadius: 12,
                    background: 'var(--surface-alt-2)',
                    color: 'var(--ink-4)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'default',
                  }}
                >
                  아직 지원하지 않는 결제수단이에요
                </button>
              )}
            </section>
          </div>

          {/* 우측: 예약 요약 */}
          <aside style={{ flex: '0 0 400px', position: 'sticky', top: 112 }}>
            <ReservationSummary
              listing={listing}
              nights={nights}
              roomTotal={roomTotal}
              total={total}
              search={search}
              onChange={onChange}
            />
          </aside>
        </div>
      </div>

      {payStatus && (
        <PaymentModal
          status={payStatus}
          errorMessage={payError}
          onClose={onBack}
        />
      )}
    </div>
  );
}

function MethodRow({
  logo,
  logoHeight,
  label,
  selected,
  onSelect,
}: {
  logo: string;
  logoHeight: number;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        width: '100%',
        padding: '16px 18px',
        border: `1px solid ${selected ? 'var(--ink-1)' : 'var(--line)'}`,
        borderRadius: 12,
        background: '#fff',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <span style={{ width: 84, display: 'flex', alignItems: 'center', flex: 'none' }}>
        <img src={logo} alt={label} style={{ height: logoHeight, width: 'auto', maxWidth: '100%', objectFit: 'contain' }} />
      </span>
      <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: 'var(--ink-1)' }}>{label}</span>
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          flex: 'none',
          border: selected ? '6px solid var(--ink-1)' : '2px solid var(--line-strong)',
        }}
        aria-hidden
      />
    </button>
  );
}
