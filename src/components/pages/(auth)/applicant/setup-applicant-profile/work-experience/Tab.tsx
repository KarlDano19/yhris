import { useState, useMemo } from 'react';

import dynamic from 'next/dynamic';
import { useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import CustomDatePicker from '@/components/CustomDatePicker';

import { PlusIcon } from '@heroicons/react/24/solid';

import { QUILL_FORMATS, QUILL_MODULES } from '@/helpers/constants';

import 'react-quill/dist/quill.snow.css';

function WorkExperienceTab({
  control,
  register,
  watch,
  setValue,
  getValues,
  handleSubmit,
  isLoading,
  setCurrentTab,
  submitToSave,
}: {
  control: any;
  register: any;
  watch: any;
  setValue: any;
  getValues: any;
  handleSubmit: any;
  isLoading: any;
  setCurrentTab: any;
  submitToSave: any;
}) {

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'experiences',
  });
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

  const onSubmit = handleSubmit((data: any) => {
    console.log('WorkExperienceTab - Full form data:', data);
    console.log('WorkExperienceTab - Experiences field:', data.experiences);
    console.log('WorkExperienceTab - Fields from useFieldArray:', fields);
    console.log('WorkExperienceTab - Current watch data:', watch());
    
    let hasError = false;
    
    // Check if there are any experiences and validate them
    if (fields.length !== 0) {
      data.experiences.map((experience: any, index: number) => {
        if (
          !(
            experience.position &&
            experience.majorRole &&
            experience.companyOrg &&
            experience.dateFrom &&
            experience.dateTo &&
            experience.responsibilities
          )
        ) {
          toast.custom(() => <CustomToast message='Please fill in all experience fields' type='error' />, {
            duration: 7000,
          });
          hasError = true;
        } else {
          // Convert dates to ISO strings for API
          if (experience.dateFrom instanceof Date) {
            data.experiences[index].dateFrom = experience.dateFrom.toISOString().split('T')[0];
          }
          if (experience.dateTo instanceof Date) {
            data.experiences[index].dateTo = experience.dateTo.toISOString().split('T')[0];
          }
        }
      });
    }
    
    if (hasError) return;
    
    // Always set the exp field, even if empty
    data['exp'] = data.experiences;
    
    console.log('Submitting work experience data:', data.exp);
    submitToSave(data);
  });

  const handleAddExperience = () => {
    const newExperience = {
      position: '',
      majorRole: '',
      companyOrg: '',
      dateFrom: '',
      dateTo: '',
      responsibilities: '',
    };
    append(newExperience);
    console.log('Added new experience, current fields:', fields);
    console.log('Current form data after adding:', watch());
  };

  const handleRemoveExperience = (index: number) => {
    remove(index);
  };

  const renderExpInputs = () => {
    return fields.map((item, index) => {
      return (
        <div
          key={index}
          className='relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:gap-x-5 gap-y-4 mt-7 pt-6'
        >
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
                  id={`to-datepicker-${index}`}
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
          <div className='grid-item col-span-6'>
            <label htmlFor='responsibilities' className='text-sm font-medium leading-6 text-gray-900'>
              Responsibilities
            </label>
            <div className='mt-2 h-72 mb-12'>
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
            className='lg:mt-5 w-full md:w-1/2 rounded-md flex justify-center items-center bg-red-600 lg:px-[110px] px-10 py-2.5 text-sm font-semibold text-white shadow-sm mb-4'
            onClick={() => handleRemoveExperience(index)}
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
        onClick={handleAddExperience}
      >
        <PlusIcon className='h-5 w-5 mr-3' />
        ADD EXPERIENCE
      </button>
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
          className='w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          tabIndex={18}
        >
          Next
        </button>
      </div>
    </form>
  );
}
export default WorkExperienceTab;
