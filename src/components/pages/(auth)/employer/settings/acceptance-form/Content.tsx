'use client';

import Link from 'next/link';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import LoadingSpinner from '@/components/LoadingSpinner';

import useGetAcceptanceMemo from '@/components/pages/(auth)/employer/manage/document-generator/hooks/useGetAcceptanceMemo';
import useGetChecklist from '@/components/pages/(auth)/employer/setup-employer-profile/onboarding-checklist/hooks/useGetChecklist';
import AcceptanceMemoPreview from '@/components/pages/(auth)/employer/manage/document-generator/form-previews/AcceptanceMemoPreview';
import { T_MemoFormData } from '@/components/pages/(auth)/employer/manage/document-generator/form-previews/AcceptanceMemoPreview';

const Content = () => {
  const { data, isLoading } = useGetAcceptanceMemo();
  const { data: checklistData } = useGetChecklist();

  const previewData: T_MemoFormData | null = data
    ? {
        companyName: data.company_name,
        startDate: data.start_date,
        endDate: data.end_date,
        authorityName: data.authority_name,
        authorityPosition: data.authority_position,
        authorityDate: data.authority_date,
        signature: data.signature ?? null,
        phases: checklistData?.phases,
      }
    : null;

  return (
    <div>
      {/* Header — constrained */}
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/settings' className='flex-none flex gap-3 items-center hover:bg-gray-200 px-2 py-1 rounded'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Settings</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye mb-1'>Acceptance Form</h2>
        </div>
      </div>

      {/* Content */}
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-8'>
        {isLoading ? (
          <div className='flex justify-center py-12'>
            <LoadingSpinner size='lg' color='yellow' />
          </div>
        ) : data?.pdf_file ? (
          <iframe
            src={data.pdf_file}
            className='w-full h-[800px] border border-gray-200 rounded-xl'
            title='Acceptance Memo PDF'
          />
        ) : previewData ? (
          <AcceptanceMemoPreview formData={previewData} />
        ) : (
          <div className='bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm'>
            Acceptance Form not yet submitted.
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
