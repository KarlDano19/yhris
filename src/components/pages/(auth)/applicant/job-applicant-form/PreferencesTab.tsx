import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import CustomDatePicker from '@/components/CustomDatePicker';
import useGetApplicantProfile from '@/components/hooks/useGetApplicantProfile';

import { PlusIcon } from '@heroicons/react/24/solid';

import { QUILL_FORMATS, QUILL_MODULES } from '@/helpers/constants';

import 'react-quill/dist/quill.snow.css';

// Helper to detect empty rich text (only tags/nbsp)
const isQuillEmpty = (html?: string) =>
  !html ||
  html
    .replace(/<(.|\n)*?>/g, '') // strip tags
    .replace(/&nbsp;|&#160;/g, ' ') // non-breaking space
    .trim().length === 0;

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
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experiences',
  });

  // SSR-safe ReactQuill
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

  // Track currently-employed per experience for UX (disables Date To)
  const [currentlyEmployed, setCurrentlyEmployed] = useState<boolean[]>([]);

  // Autofill work experience from applicant profile (if empty)
  const { data: applicantProfileData } = useGetApplicantProfile();
  useEffect(() => {
    const currentExperiences = watch('experiences');
    if (
      applicantProfileData &&
      applicantProfileData.work_experience &&
      Array.isArray(applicantProfileData.work_experience) &&
      (!currentExperiences || currentExperiences.length === 0)
    ) {
      const experiences = applicantProfileData.work_experience.map((exp: any) => ({
        ...exp,
        dateFrom: exp.dateFrom ? new Date(exp.dateFrom) : '',
        dateTo: exp.dateTo ? new Date(exp.dateTo) : '',
        responsibilities: exp.responsibilities || '',
        currentlyEmployed: !exp.dateTo,
      }));
      setValue('experiences', experiences);
      setCurrentlyEmployed(experiences.map((e: any) => !!e.currentlyEmployed));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicantProfileData, setValue]);

  // Initialize/refresh currentlyEmployed flags based on current field values
  useEffect(() => {
    if (fields.length > 0) {
      const flags = fields.map((_f: any, index: number) => {
        const exp = watch(`experiences.${index}`);
        return !!(exp?.currentlyEmployed || !exp?.dateTo);
      });
      setCurrentlyEmployed(flags);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.length]);

  const handleAddExperience = () => {
    append({
      position: '',
      responsibilities: '',
      companyOrg: '',
      dateFrom: '',
      dateTo: '',
      currentlyEmployed: false,
    });
    setCurrentlyEmployed((prev) => [...prev, false]);
  };

  const handleRemoveExperience = (index: number) => {
    remove(index);
    setCurrentlyEmployed((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCurrentlyEmployedChange = (index: number, checked: boolean) => {
    setCurrentlyEmployed((prev) => {
      const copy = [...prev];
      copy[index] = checked;
      return copy;
    });
    setValue(`experiences.${index}.currentlyEmployed`, checked);
    if (checked) setValue(`experiences.${index}.dateTo`, '');
  };

  const onSubmit = handleSubmit((data: any) => {
    let hasError = false;

    if (fields.length !== 0) {
      data.experiences.forEach((exp: any, idx: number) => {
        // Mirror UI checkbox state
        const isCurr = !!currentlyEmployed[idx];
        data.experiences[idx].currentlyEmployed = isCurr;

        // Required fields
        const missingCore = !(
          exp.position &&
          exp.companyOrg &&
          exp.dateFrom &&
          !isQuillEmpty(exp.responsibilities)
        );
        if (missingCore) {
          toast.custom(
            () => <CustomToast message="Please fill in all experience fields" type="error" />,
            { duration: 7000 }
          );
          hasError = true;
          return; // continue to finish forEach
        }

        // Date To required only when NOT currently employed
        if (!isCurr && !exp.dateTo) {
          toast.custom(
            () => (
              <CustomToast message="Please enter an end date or select “Currently Employed.”" type="error" />
            ),
            { duration: 7000 }
          );
          hasError = true;
          return;
        }

        // Validate date order if both provided
        if (exp.dateFrom && exp.dateTo) {
          const from = exp.dateFrom instanceof Date ? exp.dateFrom : new Date(exp.dateFrom);
          const to = exp.dateTo instanceof Date ? exp.dateTo : new Date(exp.dateTo);
          if (!isNaN(from.getTime()) && !isNaN(to.getTime()) && to < from) {
            toast.custom(
              () => <CustomToast message="Date To must be on or after Date From" type="error" />,
              { duration: 7000 }
            );
            hasError = true;
            return;
          }
        }

        // Normalize date values for API (YYYY-MM-DD)
        if (exp.dateFrom instanceof Date) {
          data.experiences[idx].dateFrom = exp.dateFrom.toISOString().split('T')[0];
        }
        if (exp.dateTo instanceof Date) {
          data.experiences[idx].dateTo = exp.dateTo.toISOString().split('T')[0];
        }
        if (isCurr) {
          data.experiences[idx].dateTo = '';
        }
      });
    }

    if (hasError) return;

    // Also set exp field as required downstream
    data.exp = data.experiences;
    submitToSave(data);
  });

  const renderExpInputs = () => {
    return fields.map((item, index) => (
      <div key={index} className="relative w-full rounded-md border border-gray-200 bg-white shadow-sm p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <label htmlFor={`position-${index}`} className="text-sm font-medium text-gray-900">
              Position
            </label>
            <input
              type="text"
              {...register(`experiences.${index}.position`)}
              id={`position-${index}`}
              className="mt-2 rounded-md w-full border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-savoy-blue sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor={`company-organization-${index}`} className="text-sm font-medium text-gray-900">
              Company / Organization
            </label>
            <input
              type="text"
              {...register(`experiences.${index}.companyOrg`)}
              id={`company-organization-${index}`}
              className="mt-2 rounded-md w-full border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-savoy-blue sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor={`date-from-${index}`} className="text-sm font-medium text-gray-900">
              Date From
            </label>
            <div className="relative mt-2">
              <CustomDatePicker
                id={`from-datepicker-${index}`}
                placeholder={'mm/dd/yyyy'}
                className="appearance-none block w-full rounded-md py-[4.5px] px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-7"
                selected={watch(`experiences.${index}.dateFrom`)}
                pickerOnChange={(date: any) => setValue(`experiences.${index}.dateFrom`, date)}
                inputOnChange={(value: any) => setValue(`experiences.${index}.dateFrom`, new Date(value))}
              />
            </div>
          </div>

          <div>
            <label htmlFor={`date-to-${index}`} className="text-sm font-medium text-gray-900">
              Date To
            </label>
           <div className="relative mt-2">
              <CustomDatePicker
                id={`to-datepicker-${index}`}
                placeholder={'mm/dd/yyyy'}
                className={`appearance-none block w-full rounded-md py-[4.5px] px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-7 ${
                  currentlyEmployed[index] ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                selected={watch(`experiences.${index}.dateTo`)}
                pickerOnChange={(date: any) => {
                  if (!currentlyEmployed[index]) setValue(`experiences.${index}.dateTo`, date);
                }}
                inputOnChange={(value: any) => {
                  if (!currentlyEmployed[index]) setValue(`experiences.${index}.dateTo`, new Date(value));
                }}
                disabled={currentlyEmployed[index]}
              />
            </div>
            <div className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                id={`currently-employed-${index}`}
                checked={currentlyEmployed[index] || false}
                onChange={(e) => handleCurrentlyEmployedChange(index, e.target.checked)}
                className="h-4 w-4 text-savoy-blue border-gray-300 rounded focus:ring-savoy-blue"
              />
              <label htmlFor={`currently-employed-${index}`} className="text-sm text-gray-700">
                Currently Employed
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor={`responsibilities-${index}`} className="text-sm font-medium text-gray-900">
            Description / Responsibilities
          </label>
          <div className="mt-2">
            <div className="h-44 border rounded-md ring-1 ring-inset ring-gray-300 overflow-hidden">
              <ReactQuill
                onChange={(value) =>
                  setValue(`experiences.${index}.responsibilities`, value, { shouldDirty: true })
                }
                formats={QUILL_FORMATS}
                modules={QUILL_MODULES}
                value={watch(`experiences.${index}.responsibilities`) || ''}
                className="h-[calc(11rem-2.5rem)]"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => handleRemoveExperience(index)}
            className="w-full md:w-auto rounded-md border border-red-600 text-red-600 px-6 py-2 text-sm font-semibold shadow-sm hover:bg-red-50"
          >
            REMOVE
          </button>
        </div>
      </div>
    ));
  };

  return (
    <form onSubmit={onSubmit}>
      <h5 className="text-xl font-semibold">Experience</h5>
      <br />
      <div>{renderExpInputs()}</div>

      <button
        type="button"
        className="lg:mt-2 w-full md:w-auto rounded-md flex justify-center items-center bg-[#65C979] px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#90d69e]"
        onClick={handleAddExperience}
      >
        <PlusIcon className="h-5 w-5 mr-3" />
        ADD EXPERIENCE
      </button>

      <div className="md:flex justify-between mt-10 mb-20 md:mt-16 lg:mt-28 md:mb-20">
        <button
          type="button"
          className="rounded-md w-full md:w-auto bg-white px-14 py-2.5 text-sm font-semibold text-savoy-blue border border-savoy-blue shadow-sm hover:bg-indigo-300"
          onClick={() => setCurrentTab(2)}
        >
          BACK
        </button>
        <button
          type="submit"
          className="rounded-md w-full my-4 md:my-0 md:w-auto bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <div
              className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            'SUBMIT'
          )}
        </button>
      </div>
    </form>
  );
}

export default PreferencesTab;