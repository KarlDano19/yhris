"use client";

import { Controller } from "react-hook-form";

import CustomDatePicker from "@/components/CustomDatePicker";
import EmployeeSelect from "@/components/common/EmployeeSelect";

import { XCircleIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import SelectChevronDown from "@/svg/SelectChevronDown";
import { Tooltip } from 'react-tooltip';


function PersonalInformation({
  control,
  register,
  handleSubmit,
  setSelectedTab,
  setValue,
  employeeSearch,
  setEmployeeSearch,
  employeeSelected,
  setEmployeeSelected,
}: {
  control: any;
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
  setValue: any;
  employeeSearch: string;
  setEmployeeSearch: (value: string) => void;
  employeeSelected: boolean;
  setEmployeeSelected: (value: boolean) => void;
}) {

  const onSubmit = handleSubmit(() => {
    setSelectedTab(2);
  });

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Date of Accident
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <Controller
                control={control}
                name="date_of_incident"
                render={({ field }) => (
                  <CustomDatePicker
                    id="employee-work-accident-illness-report-datepicker"
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
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Time of Accident
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="time"
                {...register("time_of_incident", { required: true })}
                id="time_of_incident"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 [&::-webkit-calendar-picker-indicator]:hidden"
                style={{ WebkitAppearance: 'none' }}
              />
              <div 
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => {
                  const timeInput = document.getElementById('time_of_incident') as HTMLInputElement;
                  timeInput?.showPicker();
                }}
              >
                <ClockIcon className="h-6 w-6 text-savoy-blue hover:text-indigo-300" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h1 className="text-lg font-semibold">Personal Information</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4">
          <div>
            <label
              htmlFor="employee"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name of Injured Worker<span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <EmployeeSelect
                control={control}
                name="employee"
                label=""
                required={true}
                placeholder="Select employee..."
                isMulti={false}
                isClearable={true}
                employeeSearch={employeeSearch}
                setEmployeeSearch={setEmployeeSearch}
                setEmployeeSelected={setEmployeeSelected}
                className=""
                onChange={(selectedOption: any) => {
                  if (selectedOption && !selectedOption.isShowMore) {
                    setValue('address', selectedOption.address);
                    setValue('sex', selectedOption.gender);
                    setEmployeeSearch(selectedOption.label);
                    setEmployeeSelected(true);
                  } else {
                    setValue('address', '');
                    setValue('sex', '');
                    setEmployeeSearch('');
                    setEmployeeSelected(false);
                  }
                }}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Age
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="number"
                {...register("age", { required: true })}
                id="age"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="civil_status"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Civil Status
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <select
                id="civil_status"
                {...register("civil_status", { required: true })}
                className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              >
                <option value="">Select...</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="widowed">Widowed</option>
                <option value="separated">Separated</option>
                <option value="divorced">Divorced</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <SelectChevronDown />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4">
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Address<span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("address", { required: true })}
                id="address"
                readOnly
                data-tooltip-id="address-tooltip"
                data-tooltip-content="Auto-populated from selected employee"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 bg-gray-100"
              />
              {employeeSelected && (
                <Tooltip 
                  id="address-tooltip" 
                  place="bottom"
                  style={{ backgroundColor: '#374151', color: 'white', fontSize: '12px' }}
                />
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="no_of_dependents"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Number of Dependents
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="number"
                {...register("no_of_dependents", { required: true })}
                id="no_of_dependents"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="sex"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Gender
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("sex", { required: true })}
                id="sex"
                readOnly
                data-tooltip-id="gender-tooltip"
                data-tooltip-content="Auto-populated from selected employee"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 bg-gray-100"
              />
              {employeeSelected && (
                <Tooltip 
                  id="gender-tooltip" 
                  place="bottom"
                  style={{ backgroundColor: '#374151', color: 'white', fontSize: '12px' }}
                />
              )}
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

export default PersonalInformation;
