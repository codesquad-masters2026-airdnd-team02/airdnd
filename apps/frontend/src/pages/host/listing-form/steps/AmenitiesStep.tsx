import { Icon } from '../../../../shared/Icon';
import { AMENITIES } from '../constants';
import { Section } from '../components/FormLayout';
import type { ListingFormData } from '../../../../types';

export function AmenitiesStep({
  form,
  onToggleAmenity,
}: {
  form: ListingFormData;
  onToggleAmenity: (amenity: string) => void;
}) {
  return (
    <Section title="편의시설">
      <div className="host-amenities-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
      }}>
        {AMENITIES.map(a => {
          const checked = form.amenities.includes(a);
          return (
            <label
              key={a}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 14px',
                borderRadius: 10,
                border: `1.5px solid ${checked ? 'var(--ink-1)' : 'var(--line-strong)'}`,
                background: checked ? 'var(--surface-alt-2)' : '#fff',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: checked ? 600 : 400,
                color: 'var(--ink-1)',
                transition: 'all 120ms ease',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleAmenity(a)}
                style={{ display: 'none' }}
              />
              <span style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                border: `2px solid ${checked ? 'var(--ink-1)' : 'var(--line-strong)'}`,
                background: checked ? 'var(--ink-1)' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 120ms ease',
              }}>
                {checked && <Icon name="check" size={11} color="#fff" strokeWidth={3} />}
              </span>
              {a}
            </label>
          );
        })}
      </div>
    </Section>
  );
}
