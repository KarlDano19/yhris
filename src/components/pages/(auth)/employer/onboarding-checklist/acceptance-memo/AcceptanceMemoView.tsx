'use client';

import { useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import toast from 'react-hot-toast';
import { getCookie } from 'cookies-next';

import CustomToast from '@/components/CustomToast';

import updateSession from '@/helpers/updateSession';

import AcceptanceMemoForm from './AcceptanceMemoForm';
import AcceptanceMemoPreview, { T_MemoFormData } from './AcceptanceMemoPreview';
import { useSubmitAcceptanceMemo } from './hooks/useSubmitAcceptanceMemo';

const today = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const defaultFormData: T_MemoFormData = {
  companyName: '',
  startDate: '',
  endDate: '',
  authorityName: '',
  authorityPosition: '',
  authorityDate: today(),
  signature: null,
  checks: {
    systemSetup: false,
    employeeData: false,
    systemConfig: false,
    userTraining: false,
    systemNavigation: false,
  },
};

const AcceptanceMemoView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get('itemId');

  const [formData, setFormData] = useState<T_MemoFormData>(defaultFormData);
  const { mutate, isLoading } = useSubmitAcceptanceMemo();

  const handleSubmit = () => {
    mutate(
      {
        company_name: formData.companyName,
        start_date: formData.startDate,
        end_date: formData.endDate,
        authority_name: formData.authorityName,
        authority_position: formData.authorityPosition,
        authority_date: formData.authorityDate,
        signature: formData.signature,
        checklist_item_id: itemId ? Number(itemId) : null,
      },
      {
        onSuccess: async () => {
          toast.custom(
            <CustomToast type='success' message='Acceptance Memo submitted successfully!' />
          );

          const token = getCookie('token');
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-accounts/details/`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({ view_type: 'onboarding' }),
          });

          await updateSession({ hasCompletedOnboarding: true, hasOnboarded: true });
          router.push('/dashboard');
        },
        onError: (err: any) => {
          toast.custom(
            <CustomToast type='error' message={err?.message || 'Failed to submit memo.'} />
          );
        },
      }
    );
  };

  const handleReset = () => {
    setFormData(defaultFormData);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Back button */}
        <div className='flex p-4'>
          <button
            onClick={() => router.push('/onboarding-checklist')}
            className='flex-none flex gap-3 items-center hover:bg-gray-200 px-2 py-1 rounded'
          >
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Back to Checklist</h4>
          </button>
        </div>

        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Acceptance Memo</h2>

          {/* Two-column layout */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6'>
            {/* Left: form */}
            <div className='transition-all duration-300'>
              <AcceptanceMemoForm
                formData={formData}
                onChange={setFormData}
                onSubmit={handleSubmit}
                onReset={handleReset}
                isSubmitting={isLoading}
              />
            </div>

            {/* Right: live preview */}
            <div className='transition-all duration-300' id='acceptance-memo-preview'>
              <AcceptanceMemoPreview formData={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptanceMemoView;
