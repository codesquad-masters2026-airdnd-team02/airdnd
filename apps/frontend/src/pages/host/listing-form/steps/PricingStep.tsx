import type { RefObject } from 'react';
import { Field, Section } from '../components/FormLayout';
import { formatCurrency, formatKoreanMoney, parseCurrencyInput } from '../formatters';
import type { ListingFormData } from '../../../../types';
import type { ListingFormErrors, SetListingFormValue } from '../types';

export function PricingStep({
  form,
  errors,
  priceInputRef,
  setField,
}: {
  form: ListingFormData;
  errors: ListingFormErrors;
  priceInputRef: RefObject<HTMLInputElement | null>;
  setField: SetListingFormValue;
}) {
  return (
    <Section title="요금">
      <Field label="1박 요금 (₩)" required error={errors.price}>
        <div style={{
          border: '1.5px solid var(--line-strong)',
          borderRadius: 12,
          background: '#fff',
          padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 24,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              fontSize: 15,
              fontWeight: 800,
              color: 'var(--ink-3)',
              flexShrink: 0,
            }}>₩</span>
            <input
              ref={priceInputRef}
              inputMode="numeric"
              placeholder="0"
              value={formatCurrency(form.price)}
              onChange={e => setField('price', parseCurrencyInput(e.target.value))}
              style={{
                width: '100%',
                height: 42,
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--ink-1)',
                textAlign: 'right',
                background: 'transparent',
              }}
            />
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-3)', flexShrink: 0 }}>원</span>
          </div>
          <div style={{
            marginTop: 10,
            padding: '10px 0 0',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            alignItems: 'center',
          }}>
            <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>한글 금액</span>
            <span style={{ fontSize: 14, color: 'var(--ink-1)', fontWeight: 700, textAlign: 'right' }}>
              {formatKoreanMoney(form.price)}
            </span>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 8 }}>
          수수료 및 세금은 별도로 부과됩니다.
        </p>
      </Field>
    </Section>
  );
}
