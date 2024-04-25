'use client';

import { useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useForm, useFieldArray } from 'react-hook-form';

import { useParams } from 'next/navigation';

import ProfileTab from './ProfileTab';
import SubmittedModal from '../jobs/modals/SubmittedModal';
import SuggestionModal from './modals/SuggestionModal';
import useSubmitApplication from './hooks/useSubmitApplication';
import useGetJobDetails from './hooks/useGetJobDetails';
import CustomToast from '@/components/CustomToast';

import { PlusIcon, CheckIcon } from '@heroicons/react/24/solid';
import DateCalendar from '@/svg/DateCalendar';

interface T_Experience {
  position: string;
  majorRole: string;
  companyOrg: string;
  dateFrom: string;
  dateTo: string;
}

const Content = () => {
  const params = useParams();
  const dateFromRef = useRef(null);
  const dateToRef = useRef(null);
  const { data, isLoading } = useGetJobDetails(Number(params.id));
  const { mutate: mutateAppForm, isLoading: mutateIsLoading } = useSubmitApplication();
  const { register, setValue, handleSubmit, control } = useForm();
  const { fields, append } = useFieldArray({
    control,
    name: 'exp',
  });
  const [isSuggestModal, setSuggestModal] = useState(false);
  const [jobDetailData, setJobDetailData] = useState<any>({});
  const [currentForm, setCurrentForm] = useState('profile');
  const [profilePhoto, setProfilePhoto] = useState<any>();
  const [isWFH, setCheckWFH] = useState(false);
  const [isWOS, setCheckWOS] = useState(false);
  const [submitModal, setOpenSubmitModal] = useState(false);

  useEffect(() => {
    if (data && !isLoading) {
      setJobDetailData(data);
      if (fields.length === 0) {
        append({
          position: '',
          majorRole: '',
          companyOrg: '',
          dateFrom: '',
          dateTo: '',
        });
      }
    }
  }, [data]);

  const profileSubmit = (data: any) => {
    setCurrentForm('experience');
  };

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
    let newList = [];
    const expDatas = data.exp;
    for (let exp of expDatas) {
      if (exp.position) {
        newList.push(exp);
      }
    }
    data['exp'] = newList;
    data['jobPosting'] = params.id;
    data['setupPreference'] = [];
    if (isWFH) {
      data['setupPreference'].push('Work From Home');
    }
    if (isWOS) {
      data['setupPreference'].push('Work on Site');
    }
    mutateAppForm(data, callBackReq);
  };

  const renderExpInputs = () => {
    return fields.map((item, index) => {
      return (
        <div key={index} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:gap-x-5 gap-y-4 mt-7'>
          <div className='grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:col-span-2 lg:col-span-4 gap-x-5 gap-y-4'>
            <div className='grid-item'>
              <label htmlFor='position' className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'>
                Position
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  {...register(`exp.${index}.position`)}
                  id='position'
                  className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div className='grid-item'>
              <label htmlFor='major-roles' className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'>
                Major Roles
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  {...register(`exp.${index}.majorRole`)}
                  id='major-roles'
                  className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div className='grid-item'>
              <label
                htmlFor='company-organization'
                className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'
              >
                Company Organization
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  {...register(`exp.${index}.companyOrg`)}
                  id='company-organization'
                  className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                />
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 col-span-2 gap-x-5 gap-y-4 mb-4 lg:mb-0'>
            <div className='grid-item'>
              <label htmlFor='date-from' className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'>
                Date From
              </label>
              <div className='relative mt-2'>
                <input
                  type='date'
                  id={`date-from${index}`}
                  className='appearance-none block w-full rounded-md py-[3.2px] px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-7'
                  ref={dateFromRef}
                  onChange={(e) => setValue(`exp.${index}.dateFrom`, e.target.value)}
                  // @ts-expect-error
                  onClick={() => dateFromRef.current.showPicker()}
                />
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                  <DateCalendar key={item.id} />
                </div>
              </div>
            </div>
            <div className='grid-item'>
              <label htmlFor='date-to' className='text-sm text-indigo-dye font-medium leading-6 text-gray-900'>
                Date To
              </label>
              <div className='relative mt-2'>
                <input
                  type='date'
                  id={`date-to${index}`}
                  className='appearance-none block w-full rounded-md py-[3.2px] px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-7'
                  ref={dateToRef}
                  onChange={(e) => setValue(`exp.${index}.dateTo`, e.target.value)}
                  // @ts-expect-error
                  onClick={() => dateToRef.current.showPicker()}
                />
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                  <DateCalendar key={item.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 `}>
      <div className='px-4 pt-8'>
        <h4 className='text-lg md:text-2xl text-indigo-dye font-bold md:font-semibold'>
          Jobs - {jobDetailData?.job_title} | Application Form
        </h4>
        <div className='md:mx-5 mt-7'>
          <form
            onSubmit={handleSubmit(profileSubmit)}
            className={`first-form ${currentForm === 'profile' ? '' : 'hidden'}`}
          >
            <ProfileTab register={register} renderUploadPhoto={renderUploadPhoto} profilePhoto={profilePhoto} />
          </form>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`second-form ${currentForm === 'experience' ? '' : 'hidden'}`}
          >
            <h5 className='text-xl text-indigo-dye font-semibold'>Experience</h5>
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
            <h6 className='text-sm text-indigo-dye font-semibold mt-16'>Work Set-up Preference</h6>
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

              <label htmlFor='wfh' className='ml-3 text-sm text-indigo-dye'>
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

              <label htmlFor='wos' className='ml-3 text-sm text-indigo-dye'>
                Open to Work on Site
              </label>
            </div>
            <div className='md:flex justify-between mt-10 md:mt-16 lg:mt-28 md:mb-5'>
              <button
                type='button'
                className='rounded-md w-full md:w-auto bg-white px-14 py-2.5 text-sm font-semibold text-savoy-blue border border-savoy-blue shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                onClick={() => setCurrentForm('profile')}
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
        </div>
      </div>
      <SubmittedModal open={submitModal} onClose={() => setOpenSubmitModal(false)} />
      <SuggestionModal open={isSuggestModal} onClose={() => setSuggestModal(false)} />
    </div>
  );
};

export default Content;
