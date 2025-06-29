"use client";

import { useEffect, useState } from "react";

import useGetEmployeeItems from "@/components/hooks/useGetEmployeeItems";

import { XCircleIcon } from "@heroicons/react/24/solid";

function EmploymentDetails({
  register,
  handleSubmit,
  setSelectedTab,
}: {
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
}) {
  const onSubmit = handleSubmit(() => {
    setSelectedTab(3);
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
        <div className="mt-4">
          <h1 className="text-lg font-semibold">Employment Details</h1>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-4">
          <div>
            <label
              htmlFor="occupation"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Occupation<span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("occupation", { required: true })}
                id="occupation"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="employment_status"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Employment Status<span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("employment_status", { required: true })}
                id="employment_status"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="average_weekly_earnings"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Average Weekly Wage<span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="number"
                {...register("average_weekly_earnings", { required: true })}
                id="average_weekly_earnings"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-4">
          <div>
            <label
              htmlFor="length_of_service"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Length of Service prior to Accident or Illness<span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="number"
                {...register("length_of_service", { required: true })}
                id="length_of_service"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="years_of_experience"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Year of Experience at <br /> Occupation<span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="number"
                {...register("years_of_experience", { required: true })}
                id="years_of_experience"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="hours_worked_per_day"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              <br/>Hours of Work per Day<span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="number"
                {...register("hours_worked_per_day", { required: true })}
                id="hours_worked_per_day"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-4">
          <div>
            <label
              htmlFor="hours_worked_per_week"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Hours of Work per Week<span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="number"
                {...register("hours_worked_per_week", { required: true })}
                id="hours_worked_per_week"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex justify-between py-4 px-4">
        <button
          type="button"
          className="w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setSelectedTab(1)}
        >
          Back
        </button>
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

export default EmploymentDetails;
