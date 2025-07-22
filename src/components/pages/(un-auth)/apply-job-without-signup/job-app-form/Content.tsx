'use client';

import { useState, useEffect } from 'react';

import { useParams } from 'next/navigation';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import SubmittedModal from './modals/SubmittedModal';
import DataConfirmationModal from './modals/DataConfirmationModal';
import SuggestionModal from './modals/SuggestionModal';
import useSubmitApplication from './hooks/useSubmitApplication';
import useGetJobDetails from './hooks/useGetJobDetails';
import ProfileTab from './ProfileTab';
import PreferencesTab from './PreferencesTab';

const Content = () => {
  const params = useParams();
  const firstForm = useForm();
  const secondForm = useForm();
  const [isSuggestModal, setSuggestModal] = useState(false);
  const [jobDetailData, setJobDetailData] = useState<any>({});
  const [currentTab, setCurrentTab] = useState<Number>(1);
  const [combinedFormData, setCombinedFormData] = useState<any>({});

  const [submitModal, setOpenSubmitModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const { data } = useGetJobDetails(Number(params.id));
  const { mutate: mutateSubmitApplication, isLoading: isLoadingSubmitApplication } = useSubmitApplication();

  useEffect(() => {
    if (data) {
      setJobDetailData(data);
    }
  }, [data]);

  const firstSubmit = (data: any) => {
    setCombinedFormData((prev: any) => ({ ...prev, ...data }));
    setCurrentTab(2);
  };

  const handleConfirmation = (isConfirmed: boolean) => {
    setConfirmModal(false);
    if (isConfirmed) {
      const finalData = { ...combinedFormData, ...secondForm.getValues() };
      finalData['jobPosting'] = params.id;
      const callBackReq = {
        onSuccess: () => {
          setOpenSubmitModal(true);
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, {
            duration: 7000,
          });
          if (err === 'Curriculum Vitae/Resume: Invalid file type') {
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
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 `}>
      <div className='px-4 pt-8'>
        <h4 className='text-lg md:text-2xl font-bold md:font-semibold'>
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
            />
          </div>
          <div style={{ display: currentTab === 2 ? 'block' : 'none' }}>
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
      <SubmittedModal open={submitModal} onClose={() => setOpenSubmitModal(false)} />
      <DataConfirmationModal open={confirmModal} onClose={handleConfirmation} />
      <SuggestionModal open={isSuggestModal} onClose={() => setSuggestModal(false)} />
    </div>
  );
};

export default Content;
