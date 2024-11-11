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

function WEMDetailsRequest({
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
    setSelectedTab(4);
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
        <div className="mt-4">
          <h1 className="text-lg font-semibold">Illness</h1>
        </div>
        <div className="gap-6 mt-4">
          <div>
            <label
              htmlFor="safety_officer_levels"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Safety Officer Levels
              <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_level_1")}
                  id="safety_officer_level_1"
                />
                <label htmlFor="safety_officer_level_1" className="ml-2">
                  Workplace Improvement
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_level_1")}
                  id="safety_officer_level_1"
                />
                <label htmlFor="safety_officer_level_1" className="ml-2">
                  OSHS Compliance
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_level_1")}
                  id="safety_officer_level_1"
                />
                <label htmlFor="safety_officer_level_1" className="ml-2">
                  Client/Customer Requirement
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_level_1")}
                  id="safety_officer_level_1"
                />
                <label htmlFor="safety_officer_level_1" className="ml-2">
                  ISO Compliance
                </label>
              </div>
              <div className="relative mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("required_by_labor_inspector")} // Updated name for uniqueness
                  id="required_by_labor_inspector"
                />
                <label htmlFor="required_by_labor_inspector" className="ml-2">
                  Required by Labor Inspector
                  <span className="text-gray-500">
                    (attached notice of inspection report)
                  </span>
                </label>
              </div>
              <div className="relative flex gap-2 mt-6">
                <input
                  type="checkbox"
                  {...register("safety_officer_level_1")}
                  id="safety_officer_level_1"
                />
                <label htmlFor="safety_officer_level_1" className="ml-2">
                  Others
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="gap-6 mt-4">
          <div>
            <label
              htmlFor="safety_officer_levels"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Safety Officer Levels
              <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_level_1")}
                  id="safety_officer_level_1"
                />
                <label htmlFor="safety_officer_level_1" className="ml-2">
                  OSHC
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_level_1")}
                  id="safety_officer_level_1"
                />
                <label htmlFor="safety_officer_level_1" className="ml-2">
                  None (New Client)
                </label>
              </div>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="checkbox"
                  {...register("safety_officer_level_1")}
                  id="safety_officer_level_1"
                />
                <label htmlFor="safety_officer_level_1" className="ml-2">
                  Accredited Wem Officer
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-4">
          <div>
          <label
              htmlFor="safety_officer_levels"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Last WEM Date
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <Controller
                control={control}
                name="date_of_illness"
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
                  />
                )}
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
          onClick={() => setSelectedTab(2)}
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

export default WEMDetailsRequest;
