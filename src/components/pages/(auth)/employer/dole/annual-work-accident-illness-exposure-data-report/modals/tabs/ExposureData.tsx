"use client";

import {  useEffect, useState } from "react";

import {  Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";


import CustomDatePicker from "@/components/CustomDatePicker";
import useGetEmployeeItems from "@/components/hooks/useGetEmployeeItems";

import { XCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";


interface CachedProfileData {
  name: string;
  type_of_industry: string;
  city: string;
}

function ExposureData({
  control,
  register,
  handleSubmit,
  setSelectedTab,
  setValue,
}: {
  control: any;
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
  setValue: any;
}) {
  const queryClient = useQueryClient();

  const onSubmit = handleSubmit(() => {
    setSelectedTab(2);
  });

  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const { data: employeeData } = useGetEmployeeItems();
  const cachedProfile = queryClient
    .getQueryCache()
    .find(["employerProfileCache"]) as {
    state: { data: CachedProfileData } | undefined;
  };

  useEffect(() => {
    if (employeeData) {
      setValue("number_of_employees", employeeData.length);
    }

    if (cachedProfile?.state?.data) {
      setValue("company_name", cachedProfile.state.data.name || "");
      setValue(
        "type_of_industry",
        cachedProfile.state.data.type_of_industry || ""
      );
      setValue("address", cachedProfile.state.data.city || "");
      setValue("year", new Date().getFullYear() || "");
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 pb-6">
          <div>
            <label
              htmlFor="date_of_report"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Date of Report
            </label>
            <div className="relative mt-2">
              <Controller
                control={control}
                name="date_of_report"
                render={({ field }) => (
                  <CustomDatePicker
                    id="date_of_report"
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
                readOnly
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
              <span className="text-red-600">*</span>
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
              <span className="text-red-600">*</span>
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
        </div>
        <hr />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
          <div className="mt-4">
            <h1 className="text-lg font-semibold">Personal Information</h1>
          </div>
          <div className="flex flex-row gap-2 justify-end">
            <label
              htmlFor="year"
              className="block text-sm font-medium leading-6 text-gray-900 mt-4"
            >
              January to December<span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("year", { required: true })}
                id="year"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <hr className="border-b border-gray-200 mt-6 border-dashed" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 pb-6">
          <div>
            <label
              htmlFor="number_of_employees"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Number of Employees
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                readOnly
                type="text"
                {...register("number_of_employees", { required: true })}
                id="number_of_employees"
                className="cursor-not-allowed rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="total_hours_worked"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Total Hours Work by All Employees
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="number"
                {...register("total_hours_worked", { required: true })}
                id="total_hours"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
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

export default ExposureData;
