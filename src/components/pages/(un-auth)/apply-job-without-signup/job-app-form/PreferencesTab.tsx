import { useState, useMemo } from 'react';

import dynamic from 'next/dynamic';
import { useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import CustomDatePicker from '@/components/CustomDatePicker';

import { PlusIcon, CheckIcon } from '@heroicons/react/24/solid';
import ConfirmationModal from './modals/ConfirmationModal';

import { QUILL_FORMATS, QUILL_MODULES } from '@/helpers/constants';

import 'react-quill/dist/quill.snow.css';


function PreferencesTab({
  control,
  register,
  watch,
  setValue,
  handleSubmit,
  isLoading,
  setCurrentTab,
  submitToSave,
}: {
  control: any;
  register: any;
  watch: any;
  setValue: any;
  handleSubmit: any;
  isLoading: any;
  setCurrentTab: any;
  submitToSave: any;
}) {
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'add' | 'remove' | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'experiences',
  });
  const [currentlyEmployed, setCurrentlyEmployed] = useState<boolean[]>([]);
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);
  const onSubmit = handleSubmit((data: any) => {
    let hasError = false;
    if (fields.length !== 0) {
      data.experiences.map((experience: any, index: number) => {
        const isCurrentlyEmployed = currentlyEmployed[index];
        const requiredFields = [
          experience.position,
          experience.companyOrg,
          experience.dateFrom,
          experience.responsibilities
        ];
        
        if (requiredFields.some(field => !field)) {
          toast.custom(() => <CustomToast message='Please fill in all experience fields' type='error' />, {
            duration: 7000,
          });
          hasError = true;
        }

        if (!isCurrentlyEmployed) {
          requiredFields.push(experience.dateTo);
        }

        if (requiredFields.some(field => !field)) {
          toast.custom(() => <CustomToast message='Please fill in all experience fields' type='error' />, {
            duration: 7000,
          });
          hasError = true;
        } else {
          if (experience.dateFrom instanceof Date) {
            data.experiences[index].dateFrom = experience.dateFrom.toISOString().split('T')[0];
          }
          if (experience.dateTo instanceof Date) {
            data.experiences[index].dateTo = experience.dateTo.toISOString().split('T')[0];
          }
          if (isCurrentlyEmployed) {
            data.experiences[index].dateTo = '';
          }
        }
      });
    }
    if (hasError) return;
    data['exp'] = data.experiences;
    // Set empty array for setupPreference since it's no longer collected
    data['setupPreference'] = [];
    submitToSave(data);
  });

  const handleAddExperience = () => {
    append({
      position: '',
      companyOrg: '',
      dateFrom: '',
      dateTo: '',
    });
    setShowModal(false);
  };

  const handleRemoveExperience = () => {
    if (currentIndex !== null) {
      remove(currentIndex);
    }
    setShowModal(false);
  };

  const handleCurrentlyEmployedChange = (index: number, checked: boolean) => {
    setCurrentlyEmployed(prev => {
      const newState = [...prev];
      newState[index] = checked;
      return newState;
    });
    
    // If checked, clear the dateTo field
    if (checked) {
      setValue(`experiences.${index}.dateTo`, '');
    }
  };

  const confirmAction = (type: 'add' | 'remove', index?: number) => {
    setActionType(type);
    setCurrentIndex(index ?? null);
    setShowModal(true);
  };

  const renderExpInputs = () => {
    return fields.map((item, index) => {
      return (
        <div
          key={index}
          className='relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:gap-x-5 gap-y-4 mt-7 pt-6'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 md:col-span-2 lg:col-span-4 gap-x-5 gap-y-4'>
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
                  disabled={currentlyEmployed[index]}
                />
              </div>
              <div className='flex items-center mt-2'>
                <input
                  type='checkbox'
                  id={`currently-employed-${index}`}
                  checked={currentlyEmployed[index] || false}
                  onChange={(e) => handleCurrentlyEmployedChange(index, e.target.checked)}
                  className='h-4 w-4 text-savoy-blue focus:ring-savoy-blue border-gray-300 rounded'
                />
                <label htmlFor={`currently-employed-${index}`} className='ml-2 text-sm text-gray-600'>
                  Currently Employed
                </label>
              </div>
            </div>
          </div>
          <div className='grid-item col-span-6'>
            <label htmlFor='responsibilities' className='text-sm font-medium leading-6 text-gray-900'>
              Description/Responsibilities
            </label>
            <div className='mt-2 h-40 mb-12'>
              <ReactQuill
                onChange={(value) => setValue(`experiences.${index}.responsibilities`, value)}
                formats={QUILL_FORMATS}
                modules={QUILL_MODULES}
                style={{ height: '100%', padding: '5px 8px !important' }}
                value={watch(`experiences.${index}.responsibilities`) || ''}
              />
            </div>
          </div>
          <button
            type='button'
              className='lg:mt-5 w-full md:w-1/2 rounded-md border border-red-600 flex justify-center items-center lg:px-[110px] px-10 py-2.5 text-sm font-semibold text-red-600 shadow-sm mb-4'
              onClick={() => confirmAction('remove', index)}
          >
            REMOVE
          </button>
        </div>
      );
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <h5 className='text-xl font-semibold'>Experience</h5>
      <div>{renderExpInputs()}</div>
      <button
        type='button'
        className='lg:mt-5 w-full md:w-auto rounded-md flex justify-center items-center bg-[#65C979] px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#90d69e]'
        onClick={() => confirmAction('add')}
      >
        <PlusIcon className='h-5 w-5 mr-3' />
        ADD EXPERIENCE
      </button>
      {/* <h6 className='text-sm font-semibold mt-16'>Work Set-up Preference</h6>
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
      </div> */}
      <div className='md:flex justify-between mt-10 md:mt-16 lg:mt-28 md:mb-5'>
        <button
          type='button'
          className='rounded-md w-full md:w-auto bg-white px-14 py-2.5 text-sm font-semibold text-savoy-blue border border-savoy-blue shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          onClick={() => setCurrentTab(2)}
        >
          BACK
        </button>
        <button
          type='submit'
          className='rounded-md w-full my-4 md:my-0 md:w-auto bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50'
          disabled={isLoading}
        >
          {isLoading ? (
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
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={actionType === 'add' ? handleAddExperience : handleRemoveExperience}
        title={actionType === 'add' ? 'Add Experience' : 'Remove Experience'}
        message={
          actionType === 'add'
            ? 'Are you sure you want to add a new experience?'
            : 'Are you sure you want to remove this experience?'
        }
      />
    </form>
  );
}
export default PreferencesTab;
