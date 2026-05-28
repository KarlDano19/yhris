'use client';

import { useState, useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-hot-toast';

import useGetAcceptanceMemo from '@/components/pages/(auth)/employer/manage/document-generator/hooks/useGetAcceptanceMemo';
import useGetChecklist from '@/components/pages/(auth)/employer/setup-employer-profile/onboarding-checklist/hooks/useGetChecklist';
import { useSubmitAcceptanceMemo } from '@/components/pages/(auth)/employer/manage/document-generator/hooks/useSubmitAcceptanceMemo';
import AcceptanceMemoPreview from '@/components/pages/(auth)/employer/manage/document-generator/form-previews/AcceptanceMemoPreview';
import AcceptanceMemoDocGeneratorForm from '@/components/pages/(auth)/employer/manage/document-generator/forms/AcceptanceMemoDocGeneratorForm';
import SignatureModal from '@/components/pages/(auth)/employer/manage/document-generator/modals/SignatureModal';
import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import BackButton from '@/components/BackButton';

import { AcceptanceMemoFormData } from '@/types/document-generator/documents';
import { T_MemoFormData } from '@/components/pages/(auth)/employer/manage/document-generator/form-previews/AcceptanceMemoPreview';

const INITIAL_FORM_DATA: AcceptanceMemoFormData = {
  companyName: '',
  startDate: '',
  endDate: '',
  authorityName: '',
  authorityPosition: '',
  authorityDate: new Date().toISOString().split('T')[0],
  signature: null,
};

export default function Content() {
  const queryClient = useQueryClient();

  const { data: existingMemo, isLoading: isMemoLoading } = useGetAcceptanceMemo();
  const { mutate: submitMemo, isLoading: isSubmitting } = useSubmitAcceptanceMemo();
  const { data: checklistData } = useGetChecklist();
  const [formData, setFormData] = useState<AcceptanceMemoFormData>(INITIAL_FORM_DATA);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  // Auto-populate company name from cache and pre-check all boxes
  useEffect(() => {
    if (isMemoLoading) return;

    const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);
    const profileData = cachedProfile?.state?.data as { name?: string } | undefined;
    const companyName = profileData?.name || '';

    if (existingMemo) {
      setFormData({
        companyName: existingMemo.company_name,
        startDate: existingMemo.start_date,
        endDate: existingMemo.end_date,
        authorityName: existingMemo.authority_name,
        authorityPosition: existingMemo.authority_position,
        authorityDate: existingMemo.authority_date,
        signature: existingMemo.signature,
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData((prev) => ({
        ...prev,
        companyName: companyName || prev.companyName,
        startDate: checklistData?.completed_at || today,
        endDate: today,
      }));
    }
  }, [existingMemo, isMemoLoading, checklistData]);

  const handleFormChange = (data: AcceptanceMemoFormData) => {
    setFormData(data as AcceptanceMemoFormData);
  };

  const handleSignatureSave = (signatureData: string | File) => {
    const sig =
      typeof signatureData === 'string'
        ? signatureData
        : signatureData
        ? URL.createObjectURL(signatureData)
        : null;
    setFormData((prev) => ({ ...prev, signature: sig }));
    setIsSignatureModalOpen(false);
  };

  const handleSubmit = () => {
    submitMemo(
      {
        company_name: formData.companyName,
        start_date: formData.startDate,
        end_date: formData.endDate,
        authority_name: formData.authorityName,
        authority_position: formData.authorityPosition,
        authority_date: formData.authorityDate,
        signature: formData.signature,
        checklist_item_id: null,
      },
      {
        onSuccess: async () => {
          const refreshSession = () => fetch('/api/refresh-onboarding-session', { method: 'POST' });
          const res = await refreshSession();
          if (!res.ok) await refreshSession();
          toast.custom(
            <CustomToast type='success' message='Acceptance Memo submitted successfully.' />
          );
          window.location.href = '/dashboard';
        },
        onError: (error: any) => {
          toast.custom(
            <CustomToast
              type='error'
              message={error?.message || 'Failed to submit acceptance memo. Please try again.'}
            />
          );
        },
      }
    );
  };

  if (isMemoLoading) {
    return (
      <div className='flex justify-center py-12'>
        <LoadingSpinner size='lg' color='yellow' />
      </div>
    );
  }

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='px-2 md:px-8 lg:px-4 py-6'>
          <div className='flex p-2 mb-2'>
            <BackButton label="HRIS Implementation Checklist" href="/setup-employer-profile" />
          </div>

          <div className='mb-6'>
            <h2 className='text-xl font-bold text-indigo-dye'>Acceptance Memo</h2>
            <p className='text-sm text-gray-500 mt-1'>
              Review and submit your onboarding acceptance memo.
            </p>
          </div>

          <div className='flex flex-col lg:flex-row gap-6'>
            <div className='w-full lg:w-1/2'>
              <AcceptanceMemoDocGeneratorForm
                documentType='acceptance-memo'
                onDocumentTypeChange={() => {}}
                onFormChange={handleFormChange as any}
                initialData={formData}
                onPrint={() => {}}
                onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
                onOpenLetterheadModal={() => {}}
                onOpenLogoModal={() => {}}
                onProceed={handleSubmit}
                isDocumentTypeDisabled
                isFormDisabled={isSubmitting}
                isViewMode={false}
              />
            </div>

            <div className='w-full lg:w-1/2'>
              <div id='acceptance-memo-preview'>
                <AcceptanceMemoPreview
                  formData={{
                    ...(formData as T_MemoFormData),
                    phases: checklistData?.phases,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleSignatureSave}
      />
    </>
  );
}
