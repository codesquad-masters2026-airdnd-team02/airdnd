import type { RefObject } from 'react';
import { ROOM_TYPES } from '../constants';
import { Field, Section } from '../components/FormLayout';
import type { ListingFormData } from '../../../../types';
import type { ListingFormErrors, SetListingFormValue } from '../types';

export function BasicInfoStep({
  form,
  errors,
  titleInputRef,
  setField,
}: {
  form: ListingFormData;
  errors: ListingFormErrors;
  titleInputRef: RefObject<HTMLInputElement | null>;
  setField: SetListingFormValue;
}) {
  return (
    <Section title="기본 정보">
      <Field label="숙소 이름" required error={errors.title}>
        <input
          ref={titleInputRef}
          className="host-input"
          placeholder="게스트에게 표시될 숙소 이름을 입력하세요"
          value={form.title}
          onChange={e => setField('title', e.target.value)}
        />
      </Field>

      <Field label="방 유형">
        <div style={{ display: 'flex', gap: 12 }}>
          {ROOM_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setField('roomType', t)}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 10,
                border: `2px solid ${form.roomType === t ? 'var(--ink-1)' : 'var(--line-strong)'}`,
                background: form.roomType === t ? 'var(--ink-1)' : '#fff',
                color: form.roomType === t ? '#fff' : 'var(--ink-1)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 120ms ease',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>
    </Section>
  );
}
