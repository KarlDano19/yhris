"use client";

import { useEffect, useState } from "react";

import { Controller } from "react-hook-form";
import { Tooltip } from 'react-tooltip';

import CustomDatePicker from "@/components/CustomDatePicker";
import useGetEmployeeItems from "@/components/hooks/useGetEmployeeItems";
import useTagOfficer from "../../hooks/useTagOfficer";

import { XCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";



function BasicAndRiskInfo({
  name_of_safety_officer,
  control,
  register,
  handleSubmit,
  setSelectedTab,
  setValue,
  getValues,
  watch,
  errors,
  setError,
  clearErrors,
}: {
  name_of_safety_officer?: string[];
  control: any;
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
  setValue: any;
  getValues: any;
  watch: any;
  errors: any;
  setError: any;
  clearErrors: any;
}) {
  const [inputOfficer, setInputOfficer] = useState("");
  const {
    tagsOfficer,
    setTagsOfficer,
    handleKeyDownOfficer,
    handleRemoveTagOfficer,
  } = useTagOfficer(inputOfficer, setInputOfficer, [], setValue);

  // Always sync tagsOfficer with the form value using watch
  const watchedNames = watch ? watch("name_of_safety_officer") : name_of_safety_officer;
  useEffect(() => {
    setTagsOfficer(watchedNames || []);
  }, [watchedNames]);

  // Clear error when tagsOfficer is non-empty
  useEffect(() => {
    if (tagsOfficer && tagsOfficer.length > 0) {
      clearErrors("name_of_safety_officer");
    }
  }, [tagsOfficer, clearErrors]);

  // Submission handler using react-hook-form validation
  const onValid = (data: any) => {
    if (!tagsOfficer || tagsOfficer.length === 0) {
      setError("name_of_safety_officer", {
        type: "manual",
        message: "Please enter at least one Name of Safety Officer."
      });
      return;
    }
    setValue("name_of_safety_officer", tagsOfficer);
    setSelectedTab(2);
  };

  // Optionally scroll to first error field
  const onInvalid = (errors: any) => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const el = document.getElementById(firstErrorField);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const { data: employeeData } = useGetEmployeeItems();

  useEffect(() => {
    if (employeeData) {
      setEmployeeItems(employeeData);
    }
  }, [employeeData]);

  // Auto-calculate total workers
  const number_of_workers_male = watch('number_of_workers_male');
  const number_of_workers_female = watch('number_of_workers_female');

  useEffect(() => {
    const male = Number(number_of_workers_male) || 0;
    const female = Number(number_of_workers_female) || 0;
    setValue('number_of_workers_total', male + female);
  }, [number_of_workers_female, number_of_workers_male, setValue]);

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <div className="px-4 pt-4 pb-6">
        <div className={`hidden rounded-md bg-red-50 p-4 mb-3`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                You cannot proceed due to incomplete fields. Please review.
              </h3>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
          <div className="border-r-0 md:border-r md:border-slate-300 pr-0 md:pr-6 space-y-6 pl-0 md:pl-6">
            <div className="mb-2">
              <h1 className="text-lg font-semibold">Basic Information</h1>
            </div>
            <div>
              <label
                htmlFor="date_of_application"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Date of Application
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <Controller
                  control={control}
                  name="date_of_application"
                  render={({ field }) => (
                    <CustomDatePicker 
                      id="date_of_application"
                      placeholder={"mm/dd/yyyy"}
                      className={
                        "block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none"
                      }
                      selected={field.value ? new Date(field.value) : null}
                      pickerOnChange={(date: any) => field.onChange(date)}
                      inputOnChange={(value: any) => field.onChange(value)}
                      required={true}
                    />
                  )}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Company Name
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  readonly
                  {...register("company_name", { required: true })}
                  id="company_name"
                  className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="type_of_industry"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Type of Industry
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  readOnly
                  {...register("type_of_industry", { required: true })}
                  id="type_of_industry"
                  className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Address
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  readOnly
                  {...register("address", { required: true })}
                  id="address"
                  className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="region"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Region
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  readOnly
                  {...register("region", { required: true })}
                  id="region"
                  className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email_address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email Address
              </label>
              <div className="relative mt-2">
                <input
                  type="email"
                  readOnly
                  {...register("email_address", { required: true })}
                  id="email_address"
                  className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="tel_fax_no"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Tel/Fax No.
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("tel_fax_no")}
                  id="tel_fax_no"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  placeholder="Enter telephone or fax number"
                />
              </div>
            </div>
          </div>
          <div className="pr-0 md:pr-6 space-y-6">
          <div className="mt-4 space-y-6">
              <h1 className="block text-sm font-medium leading-6 text-gray-900">
                Number of Workers
                <span className="text-red-600">*</span>
              </h1>
              <div className="relative mt-2 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-1">
                  <label
                    htmlFor="number_of_workers_male"
                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                  >
                    Male
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("number_of_workers_male", { required: true })}
                    id="number_of_workers_male"
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="number_of_workers_female"
                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                  >
                    Female
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("number_of_workers_female", { required: true })}
                    id="number_of_workers_female"
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="relative mt-2">
                <label
                  htmlFor="number_of_workers_total"
                  className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                >
                  Total
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  {...register("number_of_workers_total")}
                  id="number_of_workers_total"
                  className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  readOnly
                />
              </div>
            </div>
            <div className="mb-2">
              <h1 className="text-lg font-semibold">Risk and Safety</h1>
            </div>
            <div>
              <label
                htmlFor="risk_classification"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Risk Classification
                <span className="text-red-600">*</span>
              </label>
              {errors.risk_classification && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.risk_classification.message || "Please select a Risk Classification."}
                </p>
              )}
              <div className="relative mt-2">
                <div className="space-y-2">
                  <div>
                    <input
                      type="radio"
                      {...register("risk_classification", { required: "Please select a Risk Classification." })}
                      id="risk_low"
                      value="Low"
                    />
                    <label htmlFor="risk_low" className="ml-2">
                      Low
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      {...register("risk_classification", { required: "Please select a Risk Classification." })}
                      id="risk_medium"
                      value="Medium"
                    />
                    <label htmlFor="risk_medium" className="ml-2">
                      Medium
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      {...register("risk_classification", { required: "Please select a Risk Classification." })}
                      id="risk_high"
                      value="High"
                    />
                    <label htmlFor="risk_high" className="ml-2">
                      High
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className='sm:col-span-4 mt-4'>
            <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
              Name of Safety Officer(s)<span className='text-red-600'>*</span>
            </label>
            {errors.name_of_safety_officer && (
              <p className="text-xs text-red-600 mt-1">
                {errors.name_of_safety_officer.message}
              </p>
            )}
            <div className='mt-2 flex rounded-md shadow-sm'>
              <div className='relative flex flex-grow items-stretch focus-within:z-10'>
                <div className='relative border border-gray-300 pl-2 rounded-none rounded-l-md flex items-center gap-3 flex-wrap w-full'>
                  {tagsOfficer.map((tagOfficer: string) => (
                    <div
                      key={tagOfficer}
                      className='bg-[#ACB9CB] rounded-sm flex items-center gap-2 py-0 px-4 text-left justify-start text-sm mt-2 mb-2'
                    >
                      <button type='button' onClick={() => handleRemoveTagOfficer(tagOfficer)}>
                        <XMarkIcon className='w-4 h-4' />
                      </button>
                      <p>{tagOfficer}</p>
                    </div>
                  ))}
                  <input
                    type='text'
                    value={inputOfficer}
                    onKeyDown={handleKeyDownOfficer}
                    onChange={(e) => setInputOfficer(e.target.value)}
                    className='focus:none outline-none px-2 py-1 grow'
                    data-tooltip-id='officer-tooltip'
                    data-tooltip-content='Press enter key or tab to add names'
                    data-tooltip-place='bottom'
                  />
                  <Tooltip id='officer-tooltip' opacity={1} style={{ fontSize: '10px' }} />
                </div>
              </div>
            </div>
          </div>
            <div>
              <label
                htmlFor="safety_officer_levels"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Safety Officer Levels
                <span className="text-red-600">*</span>
              </label>
              {errors.safety_officer_levels && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.safety_officer_levels.message || "Please select at least one Safety Officer Level."}
                </p>
              )}
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_levels", { required: "Please select at least one Safety Officer Level." })}
                  id="safety_officer_level_1"
                  value="Safety Officer Level 1"
                />
                <label htmlFor="safety_officer_level_1" className="ml-2">
                  Safety Officer Level 1
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_levels", { required: "Please select at least one Safety Officer Level." })}
                  id="safety_officer_level_2"
                  value="Safety Officer Level 2"
                />
                <label htmlFor="safety_officer_level_2" className="ml-2">
                  Safety Officer Level 2
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_levels", { required: "Please select at least one Safety Officer Level." })}
                  id="safety_officer_level_3"
                  value="Accredited Safety Officer Level 3"
                />
                <label htmlFor="safety_officer_level_3" className="ml-2">
                  Accredited Safety Officer Level 3
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_levels", { required: "Please select at least one Safety Officer Level." })}
                  id="safety_officer_level_4"
                  value="Safety Officer Level 4"
                />
                <label htmlFor="safety_officer_level_4" className="ml-2">
                  Safety Officer Level 4
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_levels", { required: "Please select at least one Safety Officer Level." })}
                  id="safety_officer_level_5"
                  value="Safety Officer Level 5"
                />
                <label htmlFor="safety_officer_level_5" className="ml-2">
                  Safety Officer Level 5
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="py-4 px-4 text-right">
        <button
          type="submit"
          className="w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Next
        </button>
      </div>
    </form>
  );
}

export default BasicAndRiskInfo;
