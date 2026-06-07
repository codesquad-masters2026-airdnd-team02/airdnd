import { TEMP_LISTING_COORDINATES } from '../../../../shared/api/hostMapping';
import { Field, Section } from '../components/FormLayout';
import type { ListingFormData } from '../../../../types';
import type { ListingFormErrors } from '../types';

export function AddressStep({
  form,
  errors,
  isEdit,
  onSearchAddress,
  onDetailAddressChange,
}: {
  form: ListingFormData;
  errors: ListingFormErrors;
  isEdit: boolean;
  onSearchAddress: () => void;
  onDetailAddressChange: (value: string) => void;
}) {
  return (
    <Section title="주소">
      <Field label="우편번호 / 도로명 주소" required={!isEdit} error={errors.streetAddress || errors.zipCode}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <input
            className="host-input"
            placeholder="우편번호"
            value={form.zipCode}
            readOnly
            style={{ maxWidth: 130, background: 'var(--surface-alt)', cursor: 'default' }}
          />
          <button
            type="button"
            onClick={onSearchAddress}
            style={{
              height: 48,
              padding: '0 20px',
              borderRadius: 10,
              border: '1.5px solid var(--ink-1)',
              background: 'var(--ink-1)',
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 120ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#3a3a3a')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--ink-1)')}
          >
            주소 검색
          </button>
        </div>
        <input
          className="host-input"
          placeholder="도로명 주소 (주소 검색 후 자동 입력)"
          value={form.streetAddress}
          readOnly
          style={{ background: 'var(--surface-alt)', cursor: 'default' }}
        />
      </Field>
      <Field label="상세 주소" required={!isEdit} error={errors.detailAddress}>
        <input
          className="host-input"
          placeholder="예) 101호, 2층"
          value={form.detailAddress}
          onChange={e => onDetailAddressChange(e.target.value)}
        />
      </Field>
      <div style={{
        padding: '14px 16px',
        borderRadius: 10,
        background: 'var(--surface-alt)',
        color: 'var(--ink-3)',
        fontSize: 13,
        lineHeight: 1.6,
      }}>
        좌표는 다음 단계에서 카카오 JS 연동으로 확정 예정입니다. 현재는 임시 좌표
        ({TEMP_LISTING_COORDINATES.latitude}, {TEMP_LISTING_COORDINATES.longitude})를 함께 전송합니다.
      </div>
    </Section>
  );
}
