"use client";

import { useEffect } from "react";

import { Controller, useFieldArray } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import CustomDatePicker from "@/components/CustomDatePicker";

import {
  PlusIcon,
  XCircleIcon,
  MinusIcon,
} from "@heroicons/react/24/solid";

interface CachedProfileData {
  name: string;
  type_of_industry: string;
  city: string;
}

function ReportInformation({
  control,
  register,
  handleSubmit,
  setSelectedTab,
  setValue,
  watch,
}: {
  control: any;
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
  setValue: any;
  watch: any;
}) {
  const queryClient = useQueryClient();

  const onSubmit = handleSubmit((data: any) => {
    // Calculate number_of_employees as the sum of total_employees_male and total_employees_female
    const totalMale = Number(data.total_employees_male) || 0;
    const totalFemale = Number(data.total_employees_female) || 0;
    setValue('number_of_employees', totalMale + totalFemale);
    // Also update the data object for immediate submit
    data.number_of_employees = totalMale + totalFemale;
    setSelectedTab(2);
  });

  const cachedProfile = queryClient
    .getQueryCache()
    .find(["employerProfileCache"]) as {
    state: { data: CachedProfileData } | undefined;
  };
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "employees",
  });

  // Watch the employees array to make calculations reactive
  const watchedEmployees = watch("employees") || [];

  useEffect(() => {
    if (cachedProfile?.state?.data) {
      setValue("company_name", cachedProfile.state.data.name || "");
      setValue(
        "type_of_industry",
        cachedProfile.state.data.type_of_industry || ""
      );
      setValue("address", cachedProfile.state.data.city || "");
    }
  }, [cachedProfile, setValue]);

  // Calculate total employees from watched values
  const calculateTotalEmployees = () => {
    return watchedEmployees.reduce(
      (acc: { male: number; female: number }, item: { male: number; female: number }) => {
        acc.male += Number(item?.male) || 0;
        acc.female += Number(item?.female) || 0;
        return acc;
      },
      { male: 0, female: 0 }
    );
  };

  const totals = calculateTotalEmployees();

  // Update form values when totals change
  useEffect(() => {
    setValue("total_employees_male", totals.male);
    setValue("total_employees_female", totals.female);
  }, [totals, setValue]);

  const renderEmployeeInputs = () => {
    return fields.map((item, index) => {
      return (
        <div key={index} className="grid grid-cols-4 gap-6 mt-4 pb-6">
          <div className="flex justify-center items-center mt-6">
            <div className="grid-item">
              <h1 className="block text-sm font-medium text-center items-center leading-6 text-gray-900">
                Shift {index + 1}
              </h1>
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2">
              <input
                type="number"
                {...register(`employees.${index}.male`)}
                id={`employees.${index}.male`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2">
              <input
                type="number"
                {...register(`employees.${index}.female`)}
                id={`employees.${index}.female`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button
              type="button"
              className="flex justify-center items-center rounded-md bg-red-600 p-2 text-white"
              onClick={() => remove(index)}
            >
              <MinusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      );
    });
  };

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
        <div className="grid grid-cols-2 gap-6 mt-4 pb-6">
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
                {...register("address", { required: true })}
                id="address"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="mt-4">
            <h1 className="text-lg font-semibold">Persons Employed</h1>
          </div>
        </div>
        <div className="flex mt-4">
          <button
            type="button"
            className="flex justify-center items-center rounded-md bg-savoy-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm mb-4"
            onClick={() => append({ male: 0, female: 0 })}
          >
            <PlusIcon className="h-5 w-5 mr-3" />
            Add Shift
          </button>
        </div>
        {fields.length > 0 && (
          <div className="grid grid-cols-4 gap-6 mt-4">
            <label className="text-sm font-medium leading-6 text-gray-900">
              {""}
            </label>
            <label className="text-sm font-medium leading-6 text-gray-900">
              Male
            </label>
            <label className="text-sm font-medium leading-6 text-gray-900">
              Female
            </label>
          </div>
        )}
        <div>{renderEmployeeInputs()}</div>
        {fields.length > 0 && (
          <div className="grid grid-cols-4 gap-6 mt-4 pb-6">
            <div className="flex justify-center items-center mt-6">
              <div className="grid-item">
                <h1 className="block text-sm font-medium text-center items-center leading-6 text-gray-900">
                  Total Employees
                </h1>
              </div>
            </div>
            <div className="grid-item">
              <div className="mt-2">
                <input
                  type="text"
                  value={totals.male}
                  {...register("total_employees_male", { required: true })}
                  disabled
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="grid-item">
              <div className="mt-2">
                <input
                  type="text"
                  value={totals.female}
                  {...register("total_employees_female", { required: true })}
                  disabled
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        )}
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

export default ReportInformation;
