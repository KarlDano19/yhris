'use client';

import { useRef, useState, useEffect } from 'react';

import { useParams } from 'next/navigation';

import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import CustomDatePicker from '@/components/CustomDatePicker';
import SuggestionModal from './modals/SuggestionModal';
import SubmittedModal from '../jobs/modals/SubmittedModal';
import useSubmitApplication from './hooks/useSubmitApplication';
import useGetJobDetails from './hooks/useGetJobDetails';
import ProfileTab from './ProfileTab';

import { PlusIcon, CheckIcon } from '@heroicons/react/24/solid';
import DateCalendar from '@/svg/DateCalendar';

const Content = () => {
  const params = useParams();
  const [isSuggestModal, setSuggestModal] = useState(false);
  const [jobDetailData, setJobDetailData] = useState<any>({});
  const [currentTab, setCurrentTab] = useState<Number>(1);
  const [profilePhoto, setProfilePhoto] = useState<any>();
  const [isWFH, setCheckWFH] = useState(false);
  const [isWOS, setCheckWOS] = useState(false);
  const [submitModal, setOpenSubmitModal] = useState(false);
  const { data, isLoading } = useGetJobDetails(Number(params.id));
  const { mutate: mutateAppForm, isLoading: mutateIsLoading } = useSubmitApplication();
  const { register, watch, setValue, handleSubmit, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experiences',
  });

  useEffect(() => {
    if (data && !isLoading) {
      setJobDetailData(data);
    }
  }, [data]);

  const profileSubmit = handleSubmit(() => {
    setCurrentTab(2);
  });

  const renderUploadPhoto = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (input) => {
        setProfilePhoto(input.target?.result);
      };
    }
  };

  const onSubmit = (data: any) => {
    let hasError = false;
    if (fields.length !== 0) {
      data.experiences.map((experience: any) => {
        if (
          !(
            experience.position &&
            experience.majorRole &&
            experience.companyOrg &&
            experience.dateFrom &&
            experience.dateTo
          )
        ) {
          toast.custom(() => <CustomToast message='Please fill in all experience fields' type='error' />, {
            duration: 7000,
          });
          hasError = true;
        }
      });
    }
    if (hasError) return;
    data['exp'] = data.experiences;
    data['jobPosting'] = params.id;
    data['setupPreference'] = [];
    if (isWFH) {
      data['setupPreference'].push('Work From Home');
    }
    if (isWOS) {
      data['setupPreference'].push('Work on Site');
    }
    if (!data['setupPreference'].length) {
      toast.custom(() => <CustomToast message='Please select at least one work set-up preference' type='error' />, {
        duration: 7000,
      });
      return;
    }
    const callBackReq = {
      onSuccess: (data: any) => {
        if (!data.error) {
          setOpenSubmitModal(true);
        }
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
    mutateAppForm(data, callBackReq);
  };

  const renderExpInputs = () => {
    return fields.map((item, index) => {
      return (
        <div key={index} className='relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:gap-x-5 gap-y-4 mt-7 pt-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 md:col-span-2 lg:col-span-4 gap-x-5 gap-y-4'>
            <div className='grid-item'>
              <label htmlFor='position' className='text-sm font-medium leading-6 text-gray-900'>
                Position
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  {...register(`experiences.${index}.position`)}
                  id='position'
                  className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div className='grid-item'>
              <label htmlFor='major-roles' className='text-sm font-medium leading-6 text-gray-900'>
                Major Roles
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  {...register(`experiences.${index}.majorRole`)}
                  id='major-roles'
                  className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div className='grid-item'>
              <label htmlFor='company-organization' className='text-sm font-medium leading-6 text-gray-900'>
                Company Organization
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  {...register(`experiences.${index}.companyOrg`)}
                  id='company-organization'
                  className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                />
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 col-span-2 gap-x-5 gap-y-4 mb-4 lg:mb-0'>
            <div className='grid-item'>
              <label htmlFor='date-from' className='text-sm font-medium leading-6 text-gray-900'>
                Date From
              </label>
              <div className='relative mt-2'>
                <CustomDatePicker
                  id={`from-datepicker-${index}`}
                  placeholder={'mm/dd/yyyy'}
                  className='appearance-none block w-full rounded-md py-[3.2px] px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-7'
                  selected={watch(`experiences.${index}.dateFrom`)}
                  pickerOnChange={(date: any) => {
                    setValue(`experiences.${index}.dateFrom`, date);
                  }}
                  inputOnChange={(value: any) => {
                    setValue(`experiences.${index}.dateFrom`, new Date(value));
                  }}
                />
              </div>
            </div>
            <div className='grid-item'>
              <label htmlFor='date-to' className='text-sm font-medium leading-6 text-gray-900'>
                Date To
              </label>
              <div className='relative mt-2'>
                <CustomDatePicker
                  id={`from-datepicker-${index}`}
                  placeholder={'mm/dd/yyyy'}
                  className='appearance-none block w-full rounded-md py-[3.2px] px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-7'
                  selected={watch(`experiences.${index}.dateTo`)}
                  pickerOnChange={(date: any) => {
                    setValue(`experiences.${index}.dateTo`, date);
                  }}
                  inputOnChange={(value: any) => {
                    setValue(`experiences.${index}.dateTo`, new Date(value));
                  }}
                />
              </div>
            </div>
          </div>
          <button type='button' className='absolute z-10 right-0 bottom-0 -mb-12 border shadow bg-red-600 text-white rounded-md px-2 py-1.5 text-sm' onClick={() => remove(index)}>Remove</button>
        </div>
      );
    });
  };

  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 `}>
      <div className='px-4 pt-8'>
        <h4 className='text-lg md:text-2xl font-bold md:font-semibold'>
          Jobs - {jobDetailData?.job_title} | Application Form
        </h4>
        <div className='md:mx-5 mt-7'>
          {currentTab === 1 && (
            <ProfileTab
              register={register}
              renderUploadPhoto={renderUploadPhoto}
              profilePhoto={profilePhoto}
              profileSubmit={profileSubmit}
            />
          )}
          {currentTab === 2 && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <h5 className='text-xl font-semibold'>Experience</h5>
              <div>{renderExpInputs()}</div>
              <button
                type='button'
                className='lg:mt-5 w-full md:w-auto rounded-md flex justify-center items-center bg-[#65C979] px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#90d69e]'
                onClick={() =>
                  append({
                    position: '',
                    majorRole: '',
                    companyOrg: '',
                    dateFrom: '',
                    dateTo: '',
                  })
                }
              >
                <PlusIcon className='h-5 w-5 mr-3' />
                Add Experience
              </button>
              <h6 className='text-sm font-semibold mt-16'>Work Set-up Preference</h6>
              <div className='flex items-center mt-3'>
                <label
                  className={`h-3.5 w-3.5 flex justify-center items-center cursor-pointer ${
                    isWFH ? 'border-2 border-savoy-blue' : 'border border-gray-400'
                  }`}
                >
                  {isWFH ? (
                    <div className='h-3.5 w-3.5 bg-savoy-blue'>
                      <CheckIcon className='h-3.5 w-3.5 text-white' />
                    </div>
                  ) : (
                    ''
                  )}
                  <input
                    type='checkbox'
                    id='wfh'
                    className='hidden'
                    checked={isWFH}
                    onChange={() => setCheckWFH((isWFH) => !isWFH)}
                  />
                </label>

                <label htmlFor='wfh' className='ml-3 text-sm'>
                  Open to Work From Home
                </label>
              </div>
              <div className='flex items-center mt-2.5'>
                <label
                  className={`h-3.5 w-3.5 flex justify-center items-center cursor-pointer ${
                    isWOS ? 'border-2 border-savoy-blue' : 'border border-gray-400'
                  }`}
                >
                  {isWOS ? (
                    <div className='h-3.5 w-3.5 bg-savoy-blue'>
                      <CheckIcon className='h-3.5 w-3.5 text-white' />
                    </div>
                  ) : (
                    ''
                  )}
                  <input
                    type='checkbox'
                    id='wos'
                    className='hidden'
                    checked={isWOS}
                    onChange={() => setCheckWOS((isWOS) => !isWOS)}
                  />
                </label>

                <label htmlFor='wos' className='ml-3 text-sm'>
                  Open to Work on Site
                </label>
              </div>
              <div className='md:flex justify-between mt-10 md:mt-16 lg:mt-28 md:mb-5'>
                <button
                  type='button'
                  className='rounded-md w-full md:w-auto bg-white px-14 py-2.5 text-sm font-semibold text-savoy-blue border border-savoy-blue shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  onClick={() => setCurrentTab(1)}
                >
                  BACK
                </button>
                <button
                  type='submit'
                  className='rounded-md w-full my-4 md:my-0 md:w-auto bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                >
                  {mutateIsLoading ? (
                    <div
                      className='animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2'
                      role='status'
                      aria-label='loading'
                    >
                      <span className='sr-only'>Loading...</span>
                    </div>
                  ) : (
                    'SUBMIT'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <SubmittedModal open={submitModal} onClose={() => setOpenSubmitModal(false)} />
      <SuggestionModal open={isSuggestModal} onClose={() => setSuggestModal(false)} />
    </div>
  );
};

export default Content;
