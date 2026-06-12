import { Icon } from '../../../../shared/Icon';
import { Section } from '../components/FormLayout';
import type { ListingFormData } from '../../../../types';

export function ImagesStep({
  form,
  onSetImageUrl,
  onAddImageUrl,
  onRemoveImageUrl,
}: {
  form: ListingFormData;
  onSetImageUrl: (index: number, value: string) => void;
  onAddImageUrl: () => void;
  onRemoveImageUrl: (index: number) => void;
}) {
  return (
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
                onChange={e => onSetImageUrl(i, e.target.value)}
              />
            </div>
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
              onClick={() => onRemoveImageUrl(i)}
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
        onClick={onAddImageUrl}
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
  );
}
