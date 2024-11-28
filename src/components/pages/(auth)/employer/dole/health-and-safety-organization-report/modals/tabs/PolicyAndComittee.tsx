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

function PolicyAndComittee({
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
  const [drawSignatureModal, setDrawSignatureModal] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [attachmentExist, setAttachmentExist] = useState(false);
  const [committeeType, setCommitteeType] = useState<string>("a");

  useEffect(() => {
    if (fileUrl) {
      setValue("policy_and_program_on_safety_and_health", fileUrl);
    } else {
      setFileUrl("");
    }
  }, [fileUrl, setValue]);

  const handleCommitteeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCommitteeType(e.target.value);
  };

  // Mapping of committee types to the number of members
  const committeeMembersCount = {
    a: 2,
    b: 3,
    c: 3,
    d: 2,
    e: 2,
  };

  return (
    <form onSubmit={handleSubmit(() => setSelectedTab(3))}>
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
        <div className="grid grid-cols-2 gap-6 mt-4 pl-6 pr-6">
          <div className="flex-1">
            <label
              htmlFor="policy_and_program_on_safety_and_health"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
             Policy and Program on Safety and Health
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                id="policy_and_program_on_safety_and_health"
                {...register("policy_and_program_on_safety_and_health")}
                onChange={(e) => {
                  e.target.value ? setFileUrl("") : null;
                  e.target.value ? setAttachmentExist(true) : null;
                }}
                type="file"
                className="block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
              />
              {attachmentExist ? (
                <button
                  type="button"
                  className="underline text-savoy-blue text-sm"
                  onClick={() => {
                    setValue("policy_and_program_on_safety_and_health", "");
                    setAttachmentExist(false);
                  }}
                >
                  Remove Attachment
                </button>
              ) : null}
            </div>
          </div>
          <div>
            <label
              htmlFor="comittee_type"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Safety and Health Committee Type
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <select
                id="comittee_type"
                {...register("comittee_type", { required: true })}
                onChange={handleCommitteeTypeChange}
                className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              >
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
                <option value="e">E</option>
              </select>
              <div className="pointer-event-none absolute inset-y-0 right-0 flex items-center pr-4">
                <SelectChevronDown />
              </div>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="mt-4 pl-6 pr-6">
          <h1 className="text-sm font-medium">Central Safety Committee</h1>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-4 pb-6">
          <div className="flex justify-center items-center">
            <div className="grid-item">
              <h1 className="block text-sm font-medium text-center items-center leading-6 text-gray-900">
                Chairman
              </h1>
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2">
              <input
                type="text"
                {...register(`chairman_name`)}
                id={`chairman_name`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2">
              <input
                type="text"
                {...register(`chairman_position`)}
                id={`chairman_position`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6 mt-4 pb-6">
          {/* Render member inputs based on committee type */}
          {Array.from({ length: committeeMembersCount[committeeType as keyof typeof committeeMembersCount] }).map((_, index) => (
            <div key={index} className="grid-item grid grid-cols-3 gap-4 col-span-4"> {/* Ensure it spans the full width */}
              <div className="mt-2">
              <div className="grid-item">
              <h1 className="block text-sm font-medium text-center items-center leading-6 text-gray-900">
                Member {index + 1}
              </h1>
            </div>
              </div>
              <div className="mt-2">
                <input
                  type="text"
                  {...register(`members_name_${index + 1}`)}
                  id={`member_name_${index + 1}`}
                  placeholder={`Member ${index + 1} Name`}
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
              <div className="mt-2">
                <input
                  type="text"
                  {...register(`members_position_${index + 1}`)}
                  id={`member_position_${index + 1}`}
                  placeholder={`Member ${index + 1} Position`}
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6 mt-4 pb-6">
          <div className="flex justify-center items-center">
            <div className="grid-item">
              <h1 className="block text-sm font-medium text-center items-center leading-6 text-gray-900">
                Secretary
              </h1>
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2">
              <input
                type="text"
                {...register(`secretary_name`)}
                id={`secretary_name`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2">
              <input
                type="text"
                {...register(`secretary_position`)}
                id={`secretary_position`}
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
          Submit
        </button>
      </div>
    </form>
  );
}

export default PolicyAndComittee;
