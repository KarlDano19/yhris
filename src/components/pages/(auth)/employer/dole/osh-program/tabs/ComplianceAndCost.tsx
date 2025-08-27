"use client";

import { useMemo } from "react";
import { Controller } from "react-hook-form";

import dynamic from "next/dynamic";

import CustomDatePicker from "@/components/CustomDatePicker";
import { QUILL_FORMATS, QUILL_MODULES } from "@/helpers/constants";

import { XCircleIcon } from "@heroicons/react/24/solid";


export default function ComplianceAndCost({
  control,
  register,
  setValue,
  watch,
  onSubmit,
  validationMessage,
  missingFields = []
}: {
  control: any;
  register: any;
  setValue: any;
  watch: any;
  onSubmit: any;
  validationMessage?: string;
  missingFields?: string[];
}) {

  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  // Helper function to check if a field is missing
  const isMissingField = (fieldName: string) => {
    return missingFields.includes(fieldName);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="px-4 pt-4 pb-6">
        <div className={`${validationMessage ? '' : 'hidden'} rounded-md bg-red-50 p-4 mb-3`}>
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
        <div className="mt-2">
          <label
            htmlFor="message"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Cost of implementing company OSH program
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-2">
            <div>
                <label
                htmlFor="cost_osh_program"
                className="block text-sm font-medium leading-6 text-gray-900"
                >
                PHP
                </label>
                <div className="relative mt-2">
                <input
                    type="number"
                    min="0"
                    defaultValue={0}
                    {...register("cost_osh_program")}
                    id="cost_osh_program"
                    className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
                </div>
            </div>
        </div>
      <div className=" gap-6 mt-4">
            <h1 className="text-sm text-gray-500 mt-2">
              Annual estimated amount for OSH program implementation to include
              but not limited to the following: orientation/training of workers,
              safety officer, OH personnel, purchase and maintenance of PPE,
              first aid medicine and other medical supplies, safety signages and
              devices, fire safety equipment/tools, safety of equipment ( i.e
              machine guards,) etc.
            </h1>
      </div>
      <div className="mt-4 w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300 text-center">
          <thead className="bg-[#D8E6FB] rounded-lg border-2 border-gray-200">
            <tr>
              <th
                scope="col"
                className="px-3 py-3.5 text-sm font-semibold text-gray-900"
              >
                OSH Item
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-sm font-semibold text-gray-900"
              >
                Estimated Cost per Year
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="cursor-pointer border-b border-gray-200">
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                PPEs
              </td>
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                <input
                  type="number"
                  min="0"
                  defaultValue={0}
                  {...register("ppe_cost")}
                  id="ppe_cost"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </td>
            </tr>
            <tr className="cursor-pointer border-b border-gray-200">
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
              OSH trainings
              </td>
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                <input
                  type="number"
                  min="0"
                  defaultValue={0}
                  {...register("osh_training_cost")}
                  id="osh_training_cost"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </td>
            </tr>
            <tr className="cursor-pointer border-b border-gray-200">
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
              Safety Signages
              </td>
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                <input
                  type="number"
                  min="0"
                  defaultValue={0}
                  {...register("safety_signages_cost")}
                  id="safety_signages_cost"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </td>
            </tr>
            <tr className="cursor-pointer border-b border-gray-200">
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
              Machine Guards and related equipment
              </td>
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                <input
                  type="number"
                  min="0"
                  defaultValue={0}
                  {...register("machine_guards_cost")}
                  id="machine_guards_cost"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </td>
            </tr>
            <tr className="cursor-pointer border-b border-gray-200">
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
              Medical examinations
              </td>
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                <input
                  type="number"
                  min="0"
                  defaultValue={0}
                  {...register("medical_examinations_cost")}
                  id="medical_examinations_cost"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </td>
            </tr>
            <tr className="cursor-pointer border-b border-gray-200">
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
              Medical supplies/medicines
              </td>
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                <input
                  type="number"
                  min="0"
                  defaultValue={0}
                  {...register("medical_supplies_cost")}
                  id="medical_supplies_cost"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </td>
            </tr>
            <tr className="cursor-pointer border-b border-gray-200">
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
              <label
              htmlFor="others_name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Other&apos;s: specify
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("others_name")}
                id="others_name"
                className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('others_name') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
              />
            </div>
              </td>
              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 border-2 border-gray-200">
                <input
                  type="number"
                  min="0"
                  defaultValue={0}
                  {...register("others_cost")}
                  id="others_cost"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sm:col-span-4 mt-4">
        <label
          htmlFor="message"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
         ANNEX A
        </label>
        <div className="mt-2 h-72 mb-12">
          <textarea
            rows={4}
            {...register("annex_a_message")}
            id="annex_a_message"
            hidden
          />
          <ReactQuill
            onChange={(value) => setValue("annex_a_message", value)}
            formats={QUILL_FORMATS}
            modules={QUILL_MODULES}
            style={{
              height: "100%",
              padding: "5px 8px !important",
            }}
            value={watch("annex_a_message") || ""}
          />
        </div>
      </div>
      <div className=" gap-6 mt-24 md:mt-4">
        <h1 className="text-sm text-gray-500 mt-2">
          This policy is formulated for everybody&apos;s information. The company is committed to ensuring workers&apos; health and providing a healthy and safe workplace
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div>
            <label
              htmlFor="company_name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name of Owner/ Manager
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("name_of_owner_manager")}
                id="name_of_owner_manager"
                className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('name_of_owner_manager') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="type_of_industry"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
             Employees&apos; Representative
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("employees_representative")}
                id="employees_representative"
                className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('employees_representative') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Date
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <Controller
                control={control}
                name="date_filled"
                render={({ field }: { field: any }) => {
                  // Parse as local date (not UTC)
                  const selectedDate = field.value ? new Date(field.value + 'T00:00:00') : null;
                  return (
                    <CustomDatePicker
                      id="date_filled"
                      placeholder={"mm/dd/yyyy"}
                      className={
                        `block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${isMissingField('date_filled') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none`
                      }
                      selected={selectedDate}
                      pickerOnChange={(date: any) => {
                        // Format date in local time
                        if (date) {
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const day = String(date.getDate()).padStart(2, '0');
                          field.onChange(`${year}-${month}-${day}`);
                        } else {
                          field.onChange(null);
                        }
                      }}
                      inputOnChange={(date: any) => {
                        // Handle Date object from manual input
                        if (date && date instanceof Date && !isNaN(date.getTime())) {
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const day = String(date.getDate()).padStart(2, '0');
                          field.onChange(`${year}-${month}-${day}`);
                        } else {
                          field.onChange(null);
                        }
                      }}
                      required={true}
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
