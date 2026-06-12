import { Section, StepperField } from '../components/FormLayout';
import type { ListingFormData } from '../../../../types';
import type { SetListingFormValue } from '../types';

export function CapacityStep({
  form,
  setField,
}: {
  form: ListingFormData;
  setField: SetListingFormValue;
}) {
  return (
    <Section title="공간 구성">
      <div className="host-capacity-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        <StepperField
          label="최대 인원"
          sub="숙박 가능한 최대 인원"
          value={form.maxGuests}
          min={1}
          max={20}
          onChange={v => setField('maxGuests', v)}
          unit="명"
        />
        <StepperField
          label="침실"
          value={form.bedrooms}
          min={0}
          max={20}
          onChange={v => setField('bedrooms', v)}
          unit="개"
        />
        <StepperField
          label="침대"
          value={form.beds}
          min={1}
          max={20}
          onChange={v => setField('beds', v)}
          unit="개"
        />
        <StepperField
          label="욕실"
          value={form.bathrooms}
          min={1}
          max={20}
          onChange={v => setField('bathrooms', v)}
          unit="개"
        />
      </div>
    </Section>
  );
}
