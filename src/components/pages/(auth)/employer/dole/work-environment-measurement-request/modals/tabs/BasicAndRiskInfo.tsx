"use client";

import { Dispatch, Fragment, useRef, useEffect, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";
import CustomDatePicker from "@/components/CustomDatePicker";
import useGetEmployeeItems from "@/components/hooks/useGetEmployeeItems";

import { XCircleIcon } from "@heroicons/react/24/solid";
import SelectChevronDown from "@/svg/SelectChevronDown";

function BasicAndRiskInfo({
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
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="border-r border-slate-300 pr-6 space-y-6 pl-6">
            <div className="mb-2">
                <h1 className="text-lg font-semibold">Basic Information</h1>
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
              <h1
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Number of Workers
                <span className="text-red-600">*</span>
              </h1>
              <div className="relative mt-2 flex gap-6">
                <label
                  htmlFor="number_of_workers"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Male
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("type_of_industry", { required: true })}
                  id="type_of_industry"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
              <div className="relative mt-2 flex gap-6">
                <label
                  htmlFor="number_of_workers"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Male
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("type_of_industry", { required: true })}
                  id="type_of_industry"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
              <div className="relative mt-2 flex gap-6">
                <label
                  htmlFor="number_of_workers"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Male
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("type_of_industry", { required: true })}
                  id="type_of_industry"
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
                      value="low"
                    />
                    <label htmlFor="risk_low" className="ml-2">Low</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      {...register("risk_classification", { required: true })}
                      id="risk_medium"
                      value="medium"
                    />
                    <label htmlFor="risk_medium" className="ml-2">Medium</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      {...register("risk_classification", { required: true })}
                      id="risk_high"
                      value="high"
                    />
                    <label htmlFor="risk_high" className="ml-2">High</label>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="type_of_industry"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name of Safety Officer(s)
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
                htmlFor="safety_officer_levels"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Safety Officer Levels
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_level_1")}
                  id="safety_officer_level_1"
                />
                <label htmlFor="safety_officer_level_1" className="ml-2">
                  Safety Officer Level 1
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_level_2")}
                  id="safety_officer_level_2"
                />
                <label htmlFor="safety_officer_level_2" className="ml-2">
                  Safety Officer Level 2
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_level_3")}
                  id="safety_officer_level_3"
                />
                <label htmlFor="safety_officer_level_3" className="ml-2">
                  Accredited Safety Officer Level 3
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_level_2")}
                  id="safety_officer_level_2"
                />
                <label htmlFor="safety_officer_level_2" className="ml-2">
                  Safety Officer Level 4
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_level_3")}
                  id="safety_officer_level_3"
                />
                <label htmlFor="safety_officer_level_3" className="ml-2">
                  Safety Officer Level 5
                </label>
              </div>
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

export default BasicAndRiskInfo;
