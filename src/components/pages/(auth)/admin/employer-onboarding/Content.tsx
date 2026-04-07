'use client';

import Link from 'next/link';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';

import useGetOnboardingSettings from './hooks/useGetOnboardingSettings';
import useUpdateOnboardingSettings from './hooks/useUpdateOnboardingSettings';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import AddChecklistLogo from '@/svg/AddChecklistLogo';
import OnboardingTrackerLogo from '@/svg/OnboardingTrackerLogo';

const menus = [
  {
    icon: <AddChecklistLogo />,
    text: 'Add Checklist',
    link: '/admin/employer-onboarding/add-checklist',
  },
  {
    icon: <OnboardingTrackerLogo />,
    text: 'Onboarding Tracker',
    link: '/admin/employer-onboarding/onboarding-tracker',
  },
];

const Content = () => {
  const { data: settingsData } = useGetOnboardingSettings();
  const { mutate: updateSettings, isLoading: isUpdating } = useUpdateOnboardingSettings();

  const isEnabled = settingsData?.is_onboarding_enabled ?? true;

  const handleToggle = () => {
    updateSettings(!isEnabled, {
      onSuccess: (data) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 3000 });
      },
      onError: (error: any) => {
        toast.custom(() => <CustomToast message={error.message || 'Failed to update onboarding settings.'} type='error' />, { duration: 3000 });
      },
    });
  };

  return (
    <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8'>
      <div className='flex p-4'>
        <Link
          href='/admin/dashboard'
          className='flex-none flex gap-3 items-center hover:bg-gray-200 px-2 py-1 rounded'
        >
          <ArrowLeftIcon className='h-5 w-5' />
          <h4>Dashboard</h4>
        </Link>
      </div>
      <div className='px-2 md:px-8 lg:px-4'>
        <div className='flex items-center gap-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Client Onboarding</h2>
          <div className='flex items-center gap-3'>
            <span className='text-sm text-gray-600'>
              Onboarding {isEnabled ? 'Active' : 'Inactive'}
            </span>
            <button
              type='button'
              role='switch'
              aria-checked={isEnabled}
              disabled={isUpdating}
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 ${
                isEnabled ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8'>
          {menus.map((menu, index) => (
            <Link
              href={menu.link}
              key={index}
              className='bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center hover:shadow-md focus:shadow-none focus:opacity-80'
            >
              {menu.icon}
              <h3 className='text-indigo-dye font-semibold text-center'>{menu.text}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Content;
