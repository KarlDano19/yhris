'use client';

import { useState, useEffect } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import BackButton from '@/components/BackButton';
import DataConfirmationModal from './modals/DataConfirmationModal';
import SuggestionModal from './modals/SuggestionModal';
import useSubmitApplication from './hooks/useSubmitApplication';
import useGetJobDetails from './hooks/useGetJobDetails';
import useJobApplicationDraft from './hooks/useJobApplicationDraft';
import ProfileTab from './ProfileTab';
import ScreeningQuestionTab from './ScreeningQuestionTab';
import PreferencesTab from './PreferencesTab';
import LandingPage from '@/app/page';

const Content = () => {
  const params = useParams();
  const router = useRouter();
  const firstForm = useForm();
  const screeningForm = useForm();
  const secondForm = useForm();
  const [isSuggestModal, setSuggestModal] = useState(false);
  const [jobDetailData, setJobDetailData] = useState<any>({});
  const [currentTab, setCurrentTab] = useState<Number>(1);
  const [combinedFormData, setCombinedFormData] = useState<any>({});

  const [confirmModal, setConfirmModal] = useState(false);
  const [profilePhotoList, setProfilePhotoList] = useState<FileList | null>(null);
  const { data } = useGetJobDetails(Number(params.id));
  const { mutate: mutateSubmitApplication, isLoading: isLoadingSubmitApplication } = useSubmitApplication();
  const { clearDraft, hadSavedDraft } = useJobApplicationDraft(params.id as string, firstForm, screeningForm, secondForm, profilePhotoList, setProfilePhotoList);

  useEffect(() => {
    if (data) {
      setJobDetailData(data);
    }
  }, [data]);

  useEffect(() => {
    if (hadSavedDraft) {
      toast.custom(() => <CustomToast message="Draft restored. Resume where you left off." type="info" />, {
        duration: 4000,
      });
    }
  }, [hadSavedDraft]);

  const firstSubmit = (data: any) => {
    setCombinedFormData((prev: any) => ({ ...prev, ...data }));
    setCurrentTab(2);
  };
  
  const screeningSubmit = (data: any) => {
    setCombinedFormData((prev: any) => ({ ...prev, ...data }));
    setCurrentTab(3);
  };

  const handleConfirmation = (isConfirmed: boolean) => {
    setConfirmModal(false);
    if (isConfirmed) {
      const finalData = { ...combinedFormData, ...secondForm.getValues() };
      finalData['jobPosting'] = params.id;

      // Add screening question answers if they exist
      if (screeningForm.getValues().screeningAnswers) {
        finalData['screeningAnswers'] = screeningForm.getValues().screeningAnswers;
      }

      // Set an empty array for setupPreference since it's no longer collected
      finalData['setupPreference'] = [];

      const callBackReq = {
        onSuccess: () => {
          clearDraft();
          toast.custom(() => <CustomToast message="You have successfully submitted application." type="success" />, {
            duration: 5000,
          });
          // Navigate back to jobs page after a short delay
          setTimeout(() => {
            router.push('/jobs');
          });
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, {
            duration: 7000,
          });
          if (err.includes('Invalid file type')) {
            setSuggestModal(true);
          }
        },
      };
      mutateSubmitApplication(finalData, callBackReq);
    }
  };

  const submitToSave = (data: any) => {
    setCombinedFormData((prev: any) => ({ ...prev, ...data }));
    setConfirmModal(true);
  };

  return (
    <div className={`mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 `}>
      <div className='px-4 pt-24'>
        <BackButton label='Back' href="/jobs" />
        <h4 className='text-lg md:text-2xl font-bold md:font-semibold mt-2'>
          Jobs - {jobDetailData?.job_title} | Application Form
        </h4>
        <div className='md:mx-5 mt-7'>
          <div style={{ display: currentTab === 1 ? 'block' : 'none' }}>
            <ProfileTab
              register={firstForm.register}
              handleSubmit={firstForm.handleSubmit}
              firstSubmit={firstSubmit}
              setCurrentTab={setCurrentTab}
              setValue={firstForm.setValue}
              watch={firstForm.watch}
              jobDetailData={jobDetailData}
              profilePhotoList={profilePhotoList}
              setProfilePhotoList={setProfilePhotoList}
            />
          </div>
          <div style={{ display: currentTab === 2 ? 'block' : 'none' }}>
            <ScreeningQuestionTab
              register={screeningForm.register}
              watch={screeningForm.watch}
              setValue={screeningForm.setValue}
              handleSubmit={screeningForm.handleSubmit}
              setCurrentTab={setCurrentTab}
              jobPostingData={jobDetailData}
              nextTab={3}
            />
          </div>
          <div style={{ display: currentTab === 3 ? 'block' : 'none' }}>
            <PreferencesTab
              control={secondForm.control}
              register={secondForm.register}
              watch={secondForm.watch}
              setValue={secondForm.setValue}
              handleSubmit={secondForm.handleSubmit}
              isLoading={isLoadingSubmitApplication}
              setCurrentTab={setCurrentTab}
              submitToSave={submitToSave}
            />
          </div>
        </div>
      </div>
      <DataConfirmationModal open={confirmModal} onClose={handleConfirmation} />
      <SuggestionModal open={isSuggestModal} onClose={() => setSuggestModal(false)} />
    </div>
  );
};

export default Content;
