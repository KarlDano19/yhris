'use client';

import { useState, useEffect } from 'react';

import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import SuccessPopAlert from '@/components/SuccessPopAlert';
import useGetApplicantProfile from '@/components/hooks/useGetApplicantProfile';
import classNames from '@/helpers/classNames';
import updateSession from '@/helpers/updateSession';
import ProfileTab from './profile/Tab';
import ContactsTab from './contacts/Tab';
import ProfDetailTab from './prof-details/Tab';
import DocumentsTab from './documents/Tab';
import WelcomeModal from './modals/WelcomeModal';
import AskDocumentModal from './modals/AskDocumentModal';
import useSaveApplicantProfile from './hooks/useSaveApplicantProfile';
import WorkExperienceTab from './work-experience/Tab';

import { T_ApplicantProfile } from '@/types/globals';

const Content = () => {
  const [isWelcomeModal, setWelcomeModal] = useState(false);
  const [openSuccessAlert, setSuccessAlert] = useState(false);
  const [openDocumentsModal, setDocumentsModal] = useState(false);
  const [setupProfDetails, setProfDetails] = useState(false);
  const [openProfDetailsModal, setProfDetailsModal] = useState(false);
  const [setupDocuments, setDocuments] = useState(false);
  const [profileData, setProfileData] = useState<T_ApplicantProfile | null>(null);
  const [currentTab, setCurrentTab] = useState(1);
  const { register, setValue, watch, handleSubmit, control, getValues } = useForm<T_ApplicantProfile>({
    defaultValues: {
      experiences: []
    }
  });
  const {
    data: applicantProfileData, 
    isLoading: isApplicantProfileLoading
  } = useGetApplicantProfile();
  const { mutate, isLoading } = useSaveApplicantProfile();

  useEffect(() => {
    if (applicantProfileData) {
      setValue('firstname', applicantProfileData.firstname);
      setValue('middlename', applicantProfileData.middlename);
      setValue('lastname', applicantProfileData.lastname);
      setValue('email', applicantProfileData.email);
      setValue('education', applicantProfileData.education);
      setValue('expected_salary', applicantProfileData.expected_salary);
      setValue('skills', applicantProfileData.skills);
      if (applicantProfileData.work_experience) {
        setValue('experiences', applicantProfileData.work_experience);
      }
    }
  }, [applicantProfileData]);

  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: async (data: any) => {
        await updateSession({ hasProfile: true });
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
        // Restore redirect after successful save
        setTimeout(() => {
          location.href = '/apply-for-a-job';
        }, 2000);
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
      },
    };
    mutate(data, callbackReq);
  });

  return (
    <div className={`container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-8`}>
      <>
        <h3 className='text-2xl text-indigo-dye font-semibold'>Tell us more about you!</h3>
        <div className='md:mx-5'>
          {/* Tab header section */}
          <div className='mt-5'>
            <div className='sm:hidden'>
              <h5 className='text-savoy-blue text-center text-lg font-semibold'>
                {currentTab === 1 ? 'Profile' : currentTab === 2 ? 'Contacts' : 'Experience'}
              </h5>
            </div>
            <div className='hidden sm:block'>
              <div className='md:w-[82%] lg:w-[84%] mx-auto translate-y-[10px]'>
                <div className='w-full bg-gray-200 rounded-full h-1'>
                  <div
                    className={classNames(
                      currentTab === 2 ? 'w-[50%]' : 
                      currentTab === 3 ? 'w-[100%]' : 'w-0', 
                      'bg-blue-600 h-1 rounded-full'
                    )}
                  ></div>
                </div>
              </div>
              <div className='border-t-4 border-gray-300 mx-24 w-auto mb-3 translate-y-[23px] hidden'></div>
              <nav className='-mb-px flex relative justify-between w-[90%] mx-auto' aria-label='Tabs'>
                <li
                  className={`text-center text-sm font-semibold list-none flex flex-col items-center text-savoy-blue`}
                >
                  <div className='bg-white px-2'>
                    <div
                      className={`h-4 w-4 bg-white border-2 mb-2 rounded-full flex justify-center items-center border-savoy-blue`}
                    >
                      <div className={`h-2 w-2 rounded-full bg-savoy-blue`}></div>
                    </div>
                  </div>
                  Profile
                </li>
                <li
                  className={`
                    ${
                      currentTab >= 2 ? 'text-savoy-blue' : 'text-gray-500'
                    } text-center text-sm font-semibold list-none flex flex-col items-center`}
                >
                  <div className='bg-white px-2'>
                    <div
                      className={`${
                        currentTab >= 2 ? 'border-savoy-blue' : 'border-gray-300'
                      } h-4 w-4 bg-white border-2 mb-2 rounded-full flex justify-center items-center`}
                    >
                      <div
                        className={`${currentTab >= 2 ? 'bg-savoy-blue' : 'bg-gray-300'} h-2 w-2 rounded-full`}
                      ></div>
                    </div>
                  </div>
                  Contacts
                </li>
                <li
                  className={`
                    ${
                      currentTab === 3 ? 'text-savoy-blue' : 'text-gray-500'
                    } text-center text-sm font-semibold list-none flex flex-col items-center`}
                >
                  <div className='bg-white px-2'>
                    <div
                      className={`${
                        currentTab === 3 ? 'border-savoy-blue' : 'border-gray-300'
                      } h-4 w-4 bg-white border-2 mb-2 rounded-full flex justify-center items-center`}
                    >
                      <div
                        className={`${currentTab === 3 ? 'bg-savoy-blue' : 'bg-gray-300'} h-2 w-2 rounded-full`}
                      ></div>
                    </div>
                  </div>
                  Experience
                </li>
              </nav>
            </div>
          </div>
          <div>
            {currentTab === 1 && (
              <ProfileTab
                {...{
                  register,
                  watch,
                  setValue,
                  handleSubmit,
                  setCurrentTab,
                  control,
                  Controller,
                }}
              />
            )}
            {currentTab === 2 && (
              <ContactsTab
                {...{
                  register,
                  watch,
                  setValue,
                  handleSubmit,
                  setCurrentTab,
                }}
              />
            )}
            {currentTab === 3 && (  
              <WorkExperienceTab
                {...{
                  register,
                  watch,
                  setValue,
                  getValues,
                  handleSubmit,
                  setCurrentTab,
                  control,
                  isLoading,
                  submitToSave: onSubmit,
                }}
              />
            )}
            {/* {currentTab === 3 && (
              <ProfDetailTab
                {...{
                  register,
                  watch,
                  setValue,
                  handleSubmit,
                  setCurrentTab,
                }}
              />
            )}
            {currentTab === 4 && (
              <DocumentsTab
                {...{
                  register,
                  watch,
                  setValue,
                  handleSubmit,
                  setCurrentTab,
                }}
              />
            )} */}
          </div>
        </div>
      </>
      <SuccessPopAlert
        message='Successfully uploaded document.'
        open={openSuccessAlert}
        onClose={() => setSuccessAlert(false)}
      />
      <WelcomeModal
        open={isWelcomeModal}
        onSuccess={() => setSuccessAlert(true)}
        onClose={() => setWelcomeModal(false)}
      />
      <AskDocumentModal
        open={openDocumentsModal}
        onAgree={() => {
          setDocuments(true);
          setCurrentTab(currentTab + 1);
        }}
        onClose={() => setDocumentsModal(false)}
      />
    </div>
  );
};

export default Content;
