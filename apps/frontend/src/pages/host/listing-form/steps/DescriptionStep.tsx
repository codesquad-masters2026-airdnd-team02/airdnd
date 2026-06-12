import type { RefObject } from 'react';
import { Field, Section } from '../components/FormLayout';
import type { ListingFormData } from '../../../../types';
import type { ListingFormErrors, SetListingFormValue } from '../types';

export function DescriptionStep({
  form,
  errors,
  descriptionInputRef,
  setField,
}: {
  form: ListingFormData;
  errors: ListingFormErrors;
  descriptionInputRef: RefObject<HTMLTextAreaElement | null>;
  setField: SetListingFormValue;
}) {
  return (
    <Section title="숙소 설명">
      <Field label="설명" error={errors.description}>
        <div style={{
          border: '1.5px solid var(--line-strong)',
          borderRadius: 12,
          background: '#fff',
          overflow: 'hidden',
          transition: 'border-color 160ms ease',
        }}>
          <textarea
            ref={descriptionInputRef}
            placeholder="예) 남향 창으로 햇빛이 잘 들어오는 조용한 숙소입니다. 지하철역까지 도보 5분이고, 주변에 편의점과 카페가 가까워 장기 숙박에도 편리합니다."
            value={form.description}
            onChange={e => setField('description', e.target.value)}
            style={{
              width: '100%',
              minHeight: 220,
              padding: '18px 18px 10px',
              border: 'none',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'var(--font-sans)',
              fontSize: 15,
              lineHeight: 1.7,
              color: 'var(--ink-1)',
              background: '#fff',
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            padding: '10px 16px 14px',
            color: 'var(--ink-4)',
            fontSize: 12,
            borderTop: '1px solid var(--line)',
          }}>
            <span>선택 입력</span>
            <span>{form.description.length.toLocaleString('ko-KR')}자</span>
          </div>
        </div>
      </Field>
    </Section>
  );
}
