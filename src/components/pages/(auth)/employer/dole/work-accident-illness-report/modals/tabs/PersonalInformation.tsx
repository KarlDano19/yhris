"use client";

import { useEffect, useState } from "react";

import { Controller } from "react-hook-form";

import CustomDatePicker from "@/components/CustomDatePicker";
import useGetEmployeeItems from "@/components/hooks/useGetEmployeeItems";

import { XCircleIcon } from "@heroicons/react/24/solid";
import SelectChevronDown from "@/svg/SelectChevronDown";

function PersonalInformation({
  control,
  register,
  handleSubmit,
  setSelectedTab,
}: {
  control: any;
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
}) {
  const onSubmit = handleSubmit(() => {
    setSelectedTab(2);
  });

  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const { data: employeeData } = useGetEmployeeItems();

  useEffect(() => {
    if (employeeData) {
      setEmployeeItems(employeeData);
    }
  }, [employeeData]);

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
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
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
              <select
                id="employee"
                {...register("employee", { required: true })}
                className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              >
                <option value="">Select...</option>
                {employeeItems.map((item: any) => {
                  return (
                    <option
                      key={item.id}
                      value={item.id}
                    >{`${item.firstname} ${item.lastname}`}</option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <SelectChevronDown />
              </div>
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
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
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
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Sex
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <select
                id="sex"
                {...register("sex", { required: true })}
                className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <SelectChevronDown />
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

export default PersonalInformation;
