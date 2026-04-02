'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import FloatingHelpButton from '@/components/FloatingHelpButton';
import SendEmailModal from '@/components/SendEmailModal';
import AccountBalanceLogo from '@/svg/AccountBalanceLogo';
import AdvisoryEmailLogo from '@/svg/AdvisoryEmailLogo';
import PersonSearchLogo from '@/svg/PersonSearchLogo';
import OrientLogo from '@/svg/OrientLogo';

import useSendAdvisoryEmail from './hooks/useSendAdvisoryEmail';

const menus = [
  {
    icon: <PersonSearchLogo />,
    text: 'Client Monitoring',
    link: '/admin/client-monitoring',
  },
  {
    icon: <PersonSearchLogo />,
    text: 'Applicant Monitoring',
    link: '/admin/applicant-monitoring',
  },
  {
    icon: <AccountBalanceLogo />,
    text: 'Management',
    link: '/admin/management',
  },
  {
    icon: <AccountBalanceLogo />,
    text: 'Kickoff Management',
    link: '/admin/kickoff-management',
  },
  {
    icon: <OrientLogo />,
    text: 'Client Onboarding',
    link: '/admin/employer-onboarding',
  },
];

const Content = () => {
  const [isAdvisoryModalOpen, setIsAdvisoryModalOpen] = useState(false);
  const { mutate: sendAdvisory, isLoading: isSendingAdvisory } = useSendAdvisoryEmail();

  const handleAdvisorySubmit = (data: any) => {
    if (!isAdvisoryModalOpen) return;

    const callbackReq = {
      onSuccess: (data: any) => {
        setIsAdvisoryModalOpen(false);
        toast.custom(<CustomToast message={data?.message} type="success" />);
      },
      onError: (err: any) => {
        const errorMessage = err?.message || err?.response?.data?.message || 'Failed to send advisory. Please try again.';
        toast.custom(<CustomToast message={errorMessage} type="error" />);
      },
    };

    sendAdvisory(data, callbackReq);
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative'>
        <div className='p-2 md:p-8 lg:p-4 relative'>
          <h2 className='text-xl font-bold text-indigo-dye'>Dashboard</h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6 relative'>
            {menus.map((menu, index) => {
              return (
                <Link
                  href={menu.link}
                  key={index}
                  className='bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center hover:shadow-md focus:shadow-none focus:opacity-80'
                >
                  {menu.icon}
                  <h3 className='text-indigo-dye font-semibold text-center'>{menu.text}</h3>
                </Link>
              );
            })}
            <button
              onClick={() => setIsAdvisoryModalOpen(true)}
              className='bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center hover:shadow-md focus:shadow-none focus:opacity-80'
            >
              <AdvisoryEmailLogo />
              <h3 className='text-indigo-dye font-semibold text-center'>Advisory</h3>
            </button>
          </div>
        </div>
      </div>
      <FloatingHelpButton />
      {isAdvisoryModalOpen && (
        <SendEmailModal
          title="Send Advisory"
          isOpen={isAdvisoryModalOpen}
          onClose={() => setIsAdvisoryModalOpen(false)}
          onSubmit={handleAdvisorySubmit}
          defaultRecipients={[]}
          showEmailTemplate={false}
          showAttachment={false}
          submitButtonText="Send Advisory"
          isLoading={isSendingAdvisory}
        />
      )}
    </>
  );
};

export default Content;
