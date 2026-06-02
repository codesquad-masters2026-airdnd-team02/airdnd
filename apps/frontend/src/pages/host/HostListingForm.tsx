import { useState } from 'react';
import { HostHeader } from '../../components/HostHeader';
import { Icon } from '../../shared/Icon';
import type { HostListing, RoomType } from '../../types';

const ROOM_TYPES: RoomType[] = ['집 전체', '개인실', '다인실'];

const AMENITIES = [
  '주방', '무선 인터넷', '에어컨', '헤어드라이어',
  '세탁기', '무료 주차', 'TV', '수영장',
  '반려동물 동반 가능', '조식 포함', '헬스장', '엘리베이터',
];

type FormData = Omit<HostListing, 'id' | 'active'>;

interface HostListingFormProps {
  listing?: HostListing | null;
  onSave: (data: FormData) => void;
  onBack: () => void;
}

const DEFAULT_FORM: FormData = {
  title: '',
  loc: '',
  roomType: '집 전체',
  description: '',
  price: 0,
  maxGuests: 1,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
  amenities: [],
  imageUrls: [''],
};

export function HostListingForm({ listing, onSave, onBack }: HostListingFormProps) {
  const isEdit = !!listing;
  const [form, setForm] = useState<FormData>(
    listing
      ? {
          title: listing.title,
          loc: listing.loc,
          roomType: listing.roomType,
          description: listing.description,
          price: listing.price,
          maxGuests: listing.maxGuests,
          bedrooms: listing.bedrooms,
          beds: listing.beds,
          bathrooms: listing.bathrooms,
          amenities: listing.amenities,
          imageUrls: listing.imageUrls.length > 0 ? listing.imageUrls : [''],
        }
      : DEFAULT_FORM
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  function toggleAmenity(a: string) {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter(x => x !== a)
        : [...f.amenities, a],
    }));
  }

  function setImageUrl(idx: number, val: string) {
    setForm(f => {
      const next = [...f.imageUrls];
      next[idx] = val;
      return { ...f, imageUrls: next };
    });
  }

  function addImageUrl() {
    setForm(f => ({ ...f, imageUrls: [...f.imageUrls, ''] }));
  }

  function removeImageUrl(idx: number) {
    setForm(f => ({
      ...f,
      imageUrls: f.imageUrls.length === 1 ? [''] : f.imageUrls.filter((_, i) => i !== idx),
    }));
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = '숙소 이름을 입력해주세요.';
    if (!form.loc.trim()) e.loc = '주소 또는 지역을 입력해주세요.';
    if (!form.description.trim()) e.description = '설명을 입력해주세요.';
    if (!form.price || form.price <= 0) e.price = '올바른 가격을 입력해주세요.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSave({ ...form, imageUrls: form.imageUrls.filter(u => u.trim()) });
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-alt)' }}>
      <HostHeader
        title={isEdit ? '숙소 수정' : '새 숙소 등록'}
        onLogo={onBack}
      />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 100px' }}>

        {/* ── 기본 정보 ── */}
        <Section title="기본 정보">
          <Field label="숙소 이름" required error={errors.title}>
            <input
              className="host-input"
              placeholder="게스트에게 표시될 숙소 이름을 입력하세요"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
          </Field>

          <Field label="주소 또는 지역" required error={errors.loc}>
            <input
              className="host-input"
              placeholder="예) 강남구 역삼동, 서울"
              value={form.loc}
              onChange={e => set('loc', e.target.value)}
            />
          </Field>

          <Field label="방 유형">
            <div style={{ display: 'flex', gap: 12 }}>
              {ROOM_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => set('roomType', t)}
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

        {/* ── 공간 구성 ── */}
        <Section title="공간 구성">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <StepperField
              label="최대 인원"
              sub="숙박 가능한 최대 인원"
              value={form.maxGuests}
              min={1}
              max={20}
              onChange={v => set('maxGuests', v)}
              unit="명"
            />
            <StepperField
              label="침실"
              value={form.bedrooms}
              min={0}
              max={20}
              onChange={v => set('bedrooms', v)}
              unit="개"
            />
            <StepperField
              label="침대"
              value={form.beds}
              min={1}
              max={20}
              onChange={v => set('beds', v)}
              unit="개"
            />
            <StepperField
              label="욕실"
              value={form.bathrooms}
              min={1}
              max={20}
              onChange={v => set('bathrooms', v)}
              unit="개"
            />
          </div>
        </Section>

        {/* ── 설명 ── */}
        <Section title="숙소 설명">
          <Field label="설명" required error={errors.description}>
            <textarea
              className="host-input"
              placeholder="숙소의 특징, 위치, 주변 환경 등을 자유롭게 작성해주세요"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              style={{ height: 'auto', minHeight: 140, padding: '14px 16px', resize: 'vertical', lineHeight: 1.7 }}
            />
          </Field>
        </Section>

        {/* ── 요금 ── */}
        <Section title="요금">
          <Field label="1박 요금 (₩)" required error={errors.price}>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 15,
                color: 'var(--ink-3)',
                pointerEvents: 'none',
              }}>₩</span>
              <input
                className="host-input"
                type="number"
                min={0}
                placeholder="0"
                value={form.price || ''}
                onChange={e => set('price', Number(e.target.value))}
                style={{ paddingLeft: 32 }}
              />
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 8 }}>
              수수료 및 세금은 별도로 부과됩니다.
            </p>
          </Field>
        </Section>

        {/* ── 편의시설 ── */}
        <Section title="편의시설">
          <div style={{
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
                    onChange={() => toggleAmenity(a)}
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

        {/* ── 이미지 ── */}
        <Section title="이미지">
          <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 16 }}>
            이미지 URL을 입력하세요. 첫 번째 이미지가 대표 이미지로 사용됩니다.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {form.imageUrls.map((url, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    className="host-input"
                    placeholder={i === 0 ? '대표 이미지 URL' : `이미지 URL ${i + 1}`}
                    value={url}
                    onChange={e => setImageUrl(i, e.target.value)}
                  />
                </div>
                {/* Preview */}
                {url.trim() && (
                  <img
                    src={url}
                    alt=""
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      objectFit: 'cover',
                      border: '1px solid var(--line)',
                      flexShrink: 0,
                    }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <button
                  onClick={() => removeImageUrl(i)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    border: '1px solid var(--line-strong)',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: 'var(--ink-3)',
                  }}
                >
                  <Icon name="x" size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addImageUrl}
            style={{
              marginTop: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px dashed var(--line-strong)',
              background: '#fff',
              color: 'var(--ink-2)',
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 120ms ease',
              width: '100%',
              justifyContent: 'center',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-alt-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
          >
            <Icon name="plus" size={16} />
            이미지 URL 추가
          </button>
        </Section>

        {/* ── Submit ── */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTop: '1px solid var(--line)',
          padding: '16px 48px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          zIndex: 30,
        }}>
          <button
            onClick={onBack}
            style={{
              height: 48,
              padding: '0 28px',
              borderRadius: 10,
              border: '1px solid var(--line-strong)',
              background: '#fff',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: 15,
              color: 'var(--ink-1)',
              cursor: 'pointer',
              transition: 'background 120ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-alt-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            style={{
              height: 48,
              padding: '0 36px',
              borderRadius: 10,
              border: 'none',
              background: 'var(--cta-dark)',
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              transition: 'background 120ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#3a3a3a')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--cta-dark)')}
          >
            {isEdit ? '수정 완료' : '숙소 등록'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '28px 32px',
      marginBottom: 16,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <h2 style={{
        fontSize: 18,
        fontWeight: 700,
        color: 'var(--ink-1)',
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: '1px solid var(--line)',
      }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: 14,
        fontWeight: 700,
        color: 'var(--ink-1)',
        marginBottom: 8,
      }}>
        {label}
        {required && <span style={{ color: 'var(--brand-coral)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: 13, color: 'var(--brand-coral)', marginTop: 6 }}>{error}</p>
      )}
    </div>
  );
}

function StepperField({
  label,
  sub,
  value,
  min,
  max,
  onChange,
  unit,
}: {
  label: string;
  sub?: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  unit: string;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      borderRadius: 12,
      border: '1px solid var(--line-strong)',
      background: '#fff',
    }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            border: '1px solid var(--ink-4)',
            background: '#fff',
            cursor: value <= min ? 'default' : 'pointer',
            opacity: value <= min ? 0.35 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 120ms ease',
          }}
        >
          <Icon name="minus" size={15} />
        </button>
        <span style={{ minWidth: 36, textAlign: 'center', fontWeight: 700, fontSize: 16 }}>
          {value}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--ink-3)', marginLeft: 2 }}>{unit}</span>
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            border: '1px solid var(--ink-4)',
            background: '#fff',
            cursor: value >= max ? 'default' : 'pointer',
            opacity: value >= max ? 0.35 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 120ms ease',
          }}
        >
          <Icon name="plus" size={15} />
        </button>
      </div>
    </div>
  );
}
