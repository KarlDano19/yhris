import { Dispatch } from "react";

import SelectChevronDown from "@/svg/SelectChevronDownDummy";

export default function CreateJobPageThree({
  watch,
  onSubmit,
  register,
  setPageNumber,
}: {
  watch: any;
  onSubmit: () => void;
  register: any;
  setPageNumber: Dispatch<number>;
}) {
  const SalarTypeValue = watch("salary.salaryType");

  return (
    <>
      <div className="px-4 pt-4 pb-6">
        {/* start */}
        <div className="sm:col-span-4 mt-4">
          <label
            htmlFor="salary"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            How do you want to indicate the salary?
            <span className="text-red-600">*</span>
          </label>
          <div className="relative mt-2">
            <select
              id="salary"
              {...register("salary.salaryType", { required: true })}
              className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            >
              <option>Range</option>
              <option>Start Amount</option>
              <option>Exact Amount</option>
              <option>Maximum Amount</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <SelectChevronDown />
            </div>
          </div>
        </div>
        {/* start */}

        <div
          className={`grid grid-cols-1 ${
            SalarTypeValue == "Range" ? "sm:grid-cols-3" : "sm:grid-cols-2"
          } sm:gap-12 mt-4`}
        >
          {SalarTypeValue == "Range" ? (
            <>
              <div className="relative">
                <label
                  htmlFor="hireCount"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Minimum
                  <span className="text-red-600">*</span>
                </label>
                <div className="relative mt-2">
                  <input
                    id="hireCount"
                    {...register("hireCount", {
                      required: true,
                    })}
                    type="number"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="mt-2 sm:mt-0 text-center sm:absolute bottom-3 -right-8">
                  to
                </p>
              </div>
              <div className="mt-2 sm:mt-0">
                <label
                  htmlFor="hireCount"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Maximum
                  <span className="text-red-600">*</span>
                </label>
                <div className="relative mt-2">
                  <input
                    id="hireCount"
                    {...register("hireCount", {
                      required: true,
                    })}
                    type="number"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label
                  htmlFor="salaryValue"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {SalarTypeValue}
                  <span className="text-red-600">*</span>
                </label>
                <div className="relative mt-2">
                  <input
                    id="salaryValue"
                    {...register("salary.salaryValue", {
                      required: true,
                    })}
                    type="string"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </>
          )}

          {/* Rate */}
          <div className="mt-4 sm:mt-0">
            <label
              htmlFor="salary"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Rate
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <select
                id="salary"
                {...register("rate", { required: true })}
                className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              >
                <option>Monthly</option>
                <option>Bi-monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
                <option>Hourly</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <SelectChevronDown />
              </div>
            </div>
          </div>
        </div>
        {/* end */}
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
          type="submit"
          className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
          onClick={() => onSubmit()}
        >
          Next
        </button>
      </div>
    </>
  );
}
