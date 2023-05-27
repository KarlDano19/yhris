import { Dispatch } from "react";

import SelectChevronDown from "@/svg/SelectChevronDownDummy";

export default function CreateJobPageOne({
  register,
  setPageNumber,
}: {
  register: any;
  setPageNumber: Dispatch<number>;
}) {
  return (
    <>
      <div className="px-4 pb-6">
        {/* start */}
        <div className="sm:col-span-4 mt-4">
          <label
            htmlFor="country"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Country
            <span className="text-red-600">*</span>
          </label>
          <div className="relative mt-2">
            <select
              id="country"
              {...register("country", { required: true })}
              className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            >
              <option>Philippines</option>
              <option>Indonesia</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <SelectChevronDown />
            </div>
          </div>
        </div>
        <div className="sm:col-span-4 mt-4">
          <label
            htmlFor="language"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Language
            <span className="text-red-600">*</span>
          </label>
          <div className="relative mt-2">
            <select
              id="language"
              {...register("language", { required: true })}
              className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            >
              <option>English</option>
              <option>Chinese</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <SelectChevronDown />
            </div>
          </div>
        </div>
        <div className="sm:col-span-4 mt-4">
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Job Title<span className="text-red-600">*</span>
            </label>
            <div className="mt-2">
              <input
                id="jobTitle"
                {...register("jobTitle", { required: true })}
                type="text"
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="sm:col-span-4 mt-4">
          <div>
            <label
              htmlFor="placeAdvertise"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Where would you like to advertise this job?
              <span className="text-red-600">*</span>
            </label>
            <div className="mt-2">
              <input
                id="placeAdvertise"
                {...register("placeAdvertise", {
                  required: true,
                })}
                type="text"
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
          onClick={() => setPageNumber(2)}
        >
          Next
        </button>
      </div>
    </>
  );
}
