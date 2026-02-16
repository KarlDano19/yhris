'use client';

import { useRef, useState, useEffect } from 'react';

import Link from 'next/link';

import { useForm } from 'react-hook-form';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import CreateJobModal from './create-job/modals/CreateJobModal';
import ConfirmSocialShareModal from '../modals/ConfirmSocialShareModal';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import JobPostingHistory from '@/svg/JobPostingHistory';
import CreateJob from '@/svg/CreateJob';

import { CREATEJOB_TEMPLATE, QUALIFICATION_TEMPLATE } from '@/helpers/constants';

const menus = [
  {
    icon: <JobPostingHistory />,
    text: 'Job Posting History',
    link: '/post-job/job-posting-history',
  },
];

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  // Persisted state for CreateJobModal
  const [pageNumber, setPageNumber] = useState(1);
  const [isSalaryRangeModalOpen, setIsSalaryRangeModalOpen] = useState(false);
  const [isRangeBenefitsAdded, setIsRangeBenefitsAdded] = useState(false);
  const [combinedFormData, setCombinedFormData] = useState<any>({});
  const [fileProps, setFileProps] = useState<{ fileName?: string; fileSize?: number; file?: File }>({});
  
  // Screening questions and auto reject state
  const [screeningQuestions, setScreeningQuestions] = useState<any[]>([]);
  const [autoRejectEnabled, setAutoRejectEnabled] = useState(false);
  const [isVideoIntroEnabled, setIsVideoIntroEnabled] = useState(false);
  
  const firstForm = useForm<any>({
    defaultValues: {
      country: 'Philippines',
      language: 'English',
    },
  });
  const secondForm = useForm();
  const thirdForm = useForm<any>({
    defaultValues: {
      salary: {
        salaryType: 'Range',
      },
    },
  });
  const fourthForm = useForm<any>({
    defaultValues: {
      jobDescription: CREATEJOB_TEMPLATE[0],
      qualifications: QUALIFICATION_TEMPLATE[0],
      notesRemarks: '', // Initialize with empty string to prevent "undefined" string
    },
  });
  const fifthForm = useForm();
  const sixthForm = useForm();
  const seventhForm = useForm();
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [socialType, setSocialType] = useState<string | null>(null);
  const [socialOgUrl, setOgUrl] = useState<string>('');
  const [isSocialShareModalOpen, setIsSocialShareModalOpen] = useState(false);
  const [isSocialShareModalClosed, setIsSocialShareModalClosed] = useState(false);
  const isSocialShareModalClosedRef = useRef(isSocialShareModalClosed);
  
  useEffect(() => {
    isSocialShareModalClosedRef.current = isSocialShareModalClosed;
  }, [isSocialShareModalClosed]);

  const openConfirmSocialShareModal = (social: string, og_url: string) => {
    setOgUrl(og_url);

    const openModalAndWait = async (social: string) => {
      return new Promise<void>((resolve) => {
        setSocialType(social);
        setIsSocialShareModalOpen(true);
        const interval = setInterval(() => {
          if (isSocialShareModalClosedRef.current) {
            clearInterval(interval);
            setIsSocialShareModalClosed(false);
            setIsSocialShareModalOpen(false);
            resolve();
          }
        }, 100);
      });
    };

    const splitSocial = social.split(',');
    const processSocialShares = async () => {
      for (const social of splitSocial) {
        await openModalAndWait(social);
      }
    };

    processSocialShares();
  };

  const socialMediaShare = () => {
    const encoded_url = encodeURIComponent(socialOgUrl);
    if (socialType === 'Facebook') {
      const og_url = `${encoded_url}%3Fsource%3Dfacebook`;
      shareFb(og_url);
      return;
    }
    if (socialType === 'LinkedIn') {
      const og_url = `${encoded_url}%3Fsource%3Dlinkedin`;
      shareLinkedIn(og_url);
      return;
    }
  };

  const shareFb = (og_url: string) => {
    const FBSharer = `https://www.facebook.com/sharer/sharer.php?u=${og_url}`;
    window.open(FBSharer);
  };

  const shareLinkedIn = (og_url: string) => {
    const LinkedInSharer = `https://www.linkedin.com/sharing/share-offsite/?url=${og_url}`;
    window.open(LinkedInSharer);
  };

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Dashboard</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Post a Job</h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6'>
            <SmartButton
              id="create-job-btn"
              onClick={() => {
                // Reset screening questions and auto reject state for new job creation
                setScreeningQuestions([]);
                setAutoRejectEnabled(false);
                setIsVideoIntroEnabled(false);
                setIsCreateJobModalOpen(true);
              }}
              className='bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center enabled:hover:shadow-md focus:shadow-none disabled:opacity-50'
            >
              <CreateJob />
              <h3 className='text-indigo-dye font-semibold text-center'>Create a Job</h3>
            </SmartButton>
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
          </div>
        </div>
        {isCreateJobModalOpen && (
          <CreateJobModal
            isOpen={isCreateJobModalOpen}
            setIsOpen={setIsCreateJobModalOpen}
            openConfirmSocialShareModal={openConfirmSocialShareModal}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            isSalaryRangeModalOpen={isSalaryRangeModalOpen}
            setIsSalaryRangeModalOpen={setIsSalaryRangeModalOpen}
            isRangeBenefitsAdded={isRangeBenefitsAdded}
            setIsRangeBenefitsAdded={setIsRangeBenefitsAdded}
            combinedFormData={combinedFormData}
            setCombinedFormData={setCombinedFormData}
            fileProps={fileProps}
            setFileProps={setFileProps}
            screeningQuestions={screeningQuestions}
            setScreeningQuestions={setScreeningQuestions}
            autoRejectEnabled={autoRejectEnabled}
            setAutoRejectEnabled={setAutoRejectEnabled}
            isVideoIntroEnabled={isVideoIntroEnabled}
            setIsVideoIntroEnabled={setIsVideoIntroEnabled}
            firstForm={firstForm}
            secondForm={secondForm}
            thirdForm={thirdForm}
            fourthForm={fourthForm}
            fifthForm={fifthForm}
            sixthForm={sixthForm}
            seventhForm={seventhForm}
          />
        )}
        {isSocialShareModalOpen && (
          <ConfirmSocialShareModal
            onSubmit={socialMediaShare}
            socialType={socialType}
            isOpen={isSocialShareModalOpen}
            setIsOpen={setIsSocialShareModalOpen}
            setIsSocialShareModalClosed={setIsSocialShareModalClosed}
          />
        )}
      </div>
    </div>
  );
};

export default Content;
