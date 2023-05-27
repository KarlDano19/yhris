import { Dispatch, useState } from "react";

import SelectChevronDown from "@/svg/SelectChevronDownDummy";

export default function CreateJobPageSix({
  getValues,
  watch,
  setValue,
  register,
  setPageNumber,
}: {
  getValues: any;
  watch: any;
  setValue: any;
  register: any;
  setPageNumber: Dispatch<number>;
}) {
  console.log(getValues("jobTitle"));
  console.log(getValues("placeAdvertise"));
  console.log(getValues("jobDescription"));

  const markup = { __html: getValues("jobDescription") };

  return (
    <>
      <div className="px-4 pb-6">
        {/* start */}
        <div className="sm:col-span-4 mt-4">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Preview
          </label>
          <div className="relative flex flex-col space-y-2 ml-2 mt-2 text-sm font-medium leading-6 text-gray-900 rounded-md border-2 border-text-gray-400 px-2 py-3">
            <p className="font-bold">{getValues("jobTitle")}</p>
            <p>
              The ABBA Initiative - <span>{getValues("placeAdvertise")}</span>
            </p>
            <span className="absolute top-20 left-0 w-full border" />
            <div>
              <p className="mt-8" dangerouslySetInnerHTML={markup}></p>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-between px-4">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
          onClick={() => setPageNumber(7)}
          // onClick={() => onSubmit()}
        >
          Next
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={() => setPageNumber(5)}
        >
          Back
        </button>
      </div>
    </>
  );
}
