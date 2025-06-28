"use client";

import { Dispatch, Fragment, useRef, useEffect, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from '@tanstack/react-query';
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";
import CustomDatePicker from "@/components/CustomDatePicker";
import useGetEmployeeItems from "@/components/hooks/useGetEmployeeItems";
import useTagOfficer from "../../hooks/useTagOfficer";

import { XCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import SelectChevronDown from "@/svg/SelectChevronDown";

interface CachedProfileData {
  name: string;
  type_of_industry: string;
}

function BasicAndRiskInfo({
  name_of_safety_officer,
  control,
  register,
  handleSubmit,
  setSelectedTab,
  setValue,
}: {
  name_of_safety_officer?: string[];
  control: any;
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
  setValue: any;
}) {
  const queryClient = useQueryClient();
  const [inputOfficer, setInputOfficer] = useState("");
  const {
    tagsOfficer,
    setTagsOfficer,
    handleKeyDownOfficer,
    handleRemoveTagOfficer,
  } = useTagOfficer(inputOfficer, setInputOfficer);
  const onSubmit = handleSubmit(() => {
    setValue("name_of_safety_officer", tagsOfficer);
    setSelectedTab(2);
  });

  useEffect(() => {
    setTagsOfficer(name_of_safety_officer || []);
  }, [name_of_safety_officer])

  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const { data: employeeData } = useGetEmployeeItems();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']) as { state: { data: CachedProfileData } | undefined };

  useEffect(() => {
    if (employeeData) {
      setEmployeeItems(employeeData);
    }

    if (cachedProfile?.state?.data) {
      setValue("company_name", cachedProfile.state.data.name || "");
      setValue("type_of_industry", cachedProfile.state.data.type_of_industry || "");
    }
  }, [employeeData, cachedProfile, setValue]);

  return (
    <form onSubmit={onSubmit}>
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
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="border-r border-slate-300 pr-6 space-y-6 pl-6">
            <div className="mb-2">
              <h1 className="text-lg font-semibold">Basic Information</h1>
            </div>
            <div>
              <label
                htmlFor="date_of_application"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Date of Application
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
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("company_name", { required: true })}
                  id="company_name"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="type_of_industry"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Type of Industry
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("type_of_industry", { required: true })}
                  id="type_of_industry"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="mt-4 space-y-6">
              <h1 className="block text-sm font-medium leading-6 text-gray-900">
                Number of Workers
                <span className="text-red-600">*</span>
              </h1>
              <div className="relative mt-2 flex gap-6">
                <label
                  htmlFor="number_of_workers_male"
                  className="block text-sm font-medium leading-6 text-gray-900 mr-4"
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
              <div className="relative mt-2 flex gap-6">
                <label
                  htmlFor="number_of_workers"
                  className="block text-sm font-medium leading-6 text-gray-900"
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
              <div className="relative mt-2 flex gap-6">
                <label
                  htmlFor="number_of_workers_total"
                  className="block text-sm font-medium leading-6 text-gray-900 mr-4"
                >
                  Total
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  {...register("number_of_workers_total", { required: true })}
                  id="number_of_workers_total"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          <div className="pr-6 space-y-6">
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
              <div className="relative mt-2">
                <div className="space-y-2">
                  <div>
                    <input
                      type="radio"
                      {...register("risk_classification", { required: true })}
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
                      {...register("risk_classification", { required: true })}
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
                      {...register("risk_classification", { required: true })}
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
                    onChange={(e) => setInputOfficer(e.target.value)} // Add this line to update input state
                    className='focus:none outline-none px-2 py-1 grow'
                  />
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
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_levels", { required: true })}
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
                  {...register("safety_officer_levels", { required: true })}
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
                  {...register("safety_officer_levels", { required: true })}
                  id="safety_officer_level_3"
                  value="Safety Officer Level 3"
                />
                <label htmlFor="safety_officer_level_3" className="ml-2">
                  Accredited Safety Officer Level 3
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_levels", { required: true })}
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
                  {...register("safety_officer_levels", { required: true })}
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
