import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HostHeader } from '../../components/HostHeader';
import { createListingMutation } from '../../shared/api/generated/@tanstack/react-query.gen';
import { toCreateRequest, HOST_STUB, TEMP_LISTING_COORDINATES } from '../../shared/api/hostMapping';
import { useHostListings } from '../../shared/useHostListings';
import type { HostListing, ListingFormData } from '../../types';
import { FormActions } from './listing-form/components/FormActions';
import { WizardProgress } from './listing-form/components/FormLayout';
import { DaumPostcodeModal } from './listing-form/components/DaumPostcodeModal';
import { DEFAULT_FORM, STEPS } from './listing-form/constants';
import type { ListingFormErrors } from './listing-form/types';
import { AddressStep } from './listing-form/steps/AddressStep';
import { AmenitiesStep } from './listing-form/steps/AmenitiesStep';
import { BasicInfoStep } from './listing-form/steps/BasicInfoStep';
import { CapacityStep } from './listing-form/steps/CapacityStep';
import { DescriptionStep } from './listing-form/steps/DescriptionStep';
import { ImagesStep } from './listing-form/steps/ImagesStep';
import { PricingStep } from './listing-form/steps/PricingStep';

function toInitialForm(listing?: HostListing | null): ListingFormData {
  if (!listing) return DEFAULT_FORM;

  return {
    title: listing.title,
    // 주소는 API 목록 응답에 summary만 포함되어 개별 필드 없음
    city: '',
    district: '',
    streetAddress: '',
    detailAddress: '',
    zipCode: '',
    latitude: TEMP_LISTING_COORDINATES.latitude,
    longitude: TEMP_LISTING_COORDINATES.longitude,
    roomType: listing.roomType,
    description: listing.description,
    price: listing.price,
    maxGuests: listing.maxGuests,
    bedrooms: listing.bedrooms,
    beds: listing.beds,
    bathrooms: listing.bathrooms,
    amenities: listing.amenities,
    imageUrls: listing.imageUrls.length > 0 ? listing.imageUrls : [''],
  };
}

export function HostListingForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { listings } = useHostListings();
  const listing = id ? listings.find((l) => l.id === id) ?? null : null;
  const onSave = () => navigate('/host');
  const onBack = () => navigate('/host');

  const isEdit = !!id;
  const [form, setForm] = useState<ListingFormData>(() => toInitialForm(listing));

  useEffect(() => {
    if (listing) setForm(toInitialForm(listing));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing?.id]);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<ListingFormErrors>({});
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const createMutation = useMutation(createListingMutation());
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === STEPS.length - 1;

  useEffect(() => {
    const focusTargets = {
      0: titleInputRef,
      3: descriptionInputRef,
      4: priceInputRef,
    };
    const target = focusTargets[currentStep as keyof typeof focusTargets];
    if (!target) return;

    const frameId = window.requestAnimationFrame(() => {
      target.current?.focus();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [currentStep]);

  function handlePostcodeComplete(data: { zonecode: string; roadAddress: string; sido: string; sigungu: string }) {
    setForm(f => ({
      ...f,
      zipCode: data.zonecode,
      streetAddress: data.roadAddress,
      city: data.sido,
      district: data.sigungu,
    }));
    setErrors(e => ({
      ...e,
      zipCode: undefined,
      streetAddress: undefined,
      city: undefined,
      district: undefined,
    }));
  }

  function setField<K extends keyof ListingFormData>(key: K, val: ListingFormData[K]) {
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
    const nextErrors: ListingFormErrors = {};

    if (!form.title.trim()) nextErrors.title = '숙소 이름을 입력해주세요.';
    if (!isEdit) {
      if (!form.streetAddress.trim()) nextErrors.streetAddress = '주소 검색 버튼을 눌러 주소를 선택해주세요.';
      if (!form.detailAddress.trim()) nextErrors.detailAddress = '상세 주소를 입력해주세요.';
    }
    if (!form.price || form.price <= 0) nextErrors.price = '올바른 가격을 입력해주세요.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateCurrentStep(): boolean {
    const nextErrors: ListingFormErrors = {};

    if (currentStep === 0 && !form.title.trim()) {
      nextErrors.title = '숙소 이름을 입력해주세요.';
    }

    if (currentStep === 1 && !isEdit) {
      if (!form.streetAddress.trim()) nextErrors.streetAddress = '주소 검색 버튼을 눌러 주소를 선택해주세요.';
      if (!form.detailAddress.trim()) nextErrors.detailAddress = '상세 주소를 입력해주세요.';
    }

    if (currentStep === 4 && (!form.price || form.price <= 0)) {
      nextErrors.price = '올바른 가격을 입력해주세요.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goNext() {
    if (!validateCurrentStep()) return;
    setCurrentStep(step => Math.min(STEPS.length - 1, step + 1));
  }

  function goPrev() {
    setCurrentStep(step => Math.max(0, step - 1));
  }

  function handleSubmit() {
    if (!validate()) return;

    if (isEdit) {
      // 숙소 수정 API 미구현 - 뒤로 이동만 수행
      onSave();
      return;
    }

    createMutation.mutate(
      {
        body: toCreateRequest({ ...form, imageUrls: form.imageUrls.filter(u => u.trim()) }),
        query: { host: HOST_STUB },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [{ _id: 'getHostListings' }] });
          onSave();
        },
      },
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-alt)' }}>
      <HostHeader
        title={isEdit ? '숙소 수정' : '새 숙소 등록'}
        onLogo={onBack}
      />

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px 120px' }}>
        <WizardProgress currentStep={currentStep} totalSteps={STEPS.length} steps={STEPS} />

        {currentStep === 0 && (
          <BasicInfoStep
            form={form}
            errors={errors}
            titleInputRef={titleInputRef}
            setField={setField}
          />
        )}
        {currentStep === 1 && (
          <AddressStep
            form={form}
            errors={errors}
            isEdit={isEdit}
            onSearchAddress={() => setIsPostcodeOpen(true)}
            onDetailAddressChange={value => setField('detailAddress', value)}
            onCoordinatesChange={(lat, lng) => {
              setField('latitude', lat);
              setField('longitude', lng);
            }}
          />
        )}
        {currentStep === 2 && (
          <CapacityStep form={form} setField={setField} />
        )}
        {currentStep === 3 && (
          <DescriptionStep
            form={form}
            errors={errors}
            descriptionInputRef={descriptionInputRef}
            setField={setField}
          />
        )}
        {currentStep === 4 && (
          <PricingStep
            form={form}
            errors={errors}
            priceInputRef={priceInputRef}
            setField={setField}
          />
        )}
        {currentStep === 5 && (
          <AmenitiesStep form={form} onToggleAmenity={toggleAmenity} />
        )}
        {currentStep === 6 && (
          <ImagesStep
            form={form}
            onSetImageUrl={setImageUrl}
            onAddImageUrl={addImageUrl}
            onRemoveImageUrl={removeImageUrl}
          />
        )}

        {isPostcodeOpen && (
          <DaumPostcodeModal
            onComplete={handlePostcodeComplete}
            onClose={() => setIsPostcodeOpen(false)}
          />
        )}

        <FormActions
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          isEdit={isEdit}
          isSubmitting={createMutation.isPending}
          onBack={onBack}
          onPrev={goPrev}
          onNext={goNext}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
