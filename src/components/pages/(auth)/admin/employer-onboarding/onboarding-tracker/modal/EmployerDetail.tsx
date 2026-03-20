'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import LoadingSpinner from '@/components/LoadingSpinner';

import ChecklistGroup from './ChecklistGroup';
import useGetOnboardingDetail from '../hooks/useGetOnboardingDetail';

type EmployerDetailProps = {
  recordId: string;
  onBack: () => void;
};

const statusLabel: Record<string, string> = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

const statusStyle: Record<string, string> = {
  NOT_STARTED: 'bg-gray-100 text-gray-500',
  IN_PROGRESS: 'bg-orange-100 text-orange-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

const EmployerDetail = ({ recordId, onBack }: EmployerDetailProps) => {
  const { data, isLoading } = useGetOnboardingDetail(recordId);

  const record = data?.data || data;

  if (isLoading) {
    return (
      <div className='flex justify-center py-12'>
        <LoadingSpinner size='lg' color='yellow' />
      </div>
    );
  }

  if (!record) {
    return (
      <div className='p-6 text-center text-gray-500 text-sm'>Onboarding record not found.</div>
    );
  }

  const label = statusLabel[record.status] || 'Not Started';
  const style = statusStyle[record.status] || statusStyle['NOT_STARTED'];
  const totalPhases = record.phases ? record.phases.length : 0;

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='flex p-4'>
        <button
          onClick={onBack}
          className='flex-none flex gap-3 items-center hover:bg-gray-200 px-2 py-1 rounded'
        >
          <ArrowLeftIcon className='h-5 w-5' />
          <h4>Back to Board</h4>
        </button>
      </div>

      <div className='px-2 md:px-8 lg:px-4 py-6'>
        <div className='mb-6'>
          <div className='flex items-center gap-3 flex-wrap'>
            <h1 className='text-xl font-bold text-indigo-dye'>{record.employer_name}</h1>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${style}`}>
              {label}
            </span>
          </div>
          <p className='text-sm text-gray-500 mt-1'>
            Client Onboarding Detail &nbsp;·&nbsp; {totalPhases} phase{totalPhases !== 1 ? 's' : ''}
          </p>
        </div>

        <div>
          {record.phases && record.phases.length > 0 ? (
            record.phases.map((phase: any) => (
              <ChecklistGroup key={phase.id} phase={phase} />
            ))
          ) : (
            <div className='text-center py-8 text-gray-500 text-sm'>No checklist items available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDetail;
