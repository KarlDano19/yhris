"use client";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";

import { XCircleIcon } from "@heroicons/react/24/solid";
import SelectChevronDown from "@/svg/SelectChevronDown";

function PolicyAndComittee({
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
  const [fileUrl, setFileUrl] = useState<string>("");
  const [attachmentExist, setAttachmentExist] = useState(false);
  const [committeeType, setCommitteeType] = useState<string>("a");
  
  // Watch for existing file URL from form
  const existingFileUrl = watch("policy_and_program_file");

  useEffect(() => {
    if (fileUrl) {
      setValue("policy_and_program_file", fileUrl);
    } else {
      setFileUrl("");
    }
  }, [fileUrl, setValue]);

  // Check if there's an existing file URL (for edit mode)
  useEffect(() => {
    if (existingFileUrl && typeof existingFileUrl === 'string' && existingFileUrl.startsWith('http')) {
      setAttachmentExist(true);
    }
  }, [existingFileUrl]);

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
    <form onSubmit={handleSubmit((data: any) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'policy_and_program_file') {
          // Only append if it's a File (not a string/URL)
          if (value instanceof File) {
            formData.append(key, value);
          }
          // If it's a string (URL), skip appending
        } else {
          formData.append(key, value as string);
        }
      });
      const hasExistingFile = !!(existingFileUrl && typeof existingFileUrl === 'string' && existingFileUrl.startsWith('http'));
      const isFileMissing =
        !hasExistingFile &&
        (!data.policy_and_program_file ||
          (typeof data.policy_and_program_file === 'object' && data.policy_and_program_file instanceof FileList && data.policy_and_program_file.length === 0) ||
          (typeof data.policy_and_program_file === 'object' && data.policy_and_program_file instanceof File && !data.policy_and_program_file.name) ||
          (typeof data.policy_and_program_file === 'string' && data.policy_and_program_file.trim() === ''));
      if (isFileMissing) {
        toast.custom(() => <CustomToast message="Policy and Program file is required." type="error" />, { duration: 5000 });
        return;
      } else if (!data.chairman_name || data.chairman_name.trim() === "") {
        toast.custom(() => <CustomToast message="Chairman name is required." type="error" />, { duration: 5000 });
        return;
      } else if (!data.chairman_position || data.chairman_position.trim() === "") {
        toast.custom(() => <CustomToast message="Chairman position is required." type="error" />, { duration: 5000 });
        return;
      }
      setSelectedTab(3);
    })}>
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
              htmlFor="policy_and_program_file"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
             Policy and Program on Safety and Health
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                id="policy_and_program_file"
                {...register("policy_and_program_file")}
                onChange={(e) => {
                  e.target.value ? setFileUrl("") : null;
                  e.target.value ? setAttachmentExist(true) : null;
                }}
                type="file"
                disabled={!!(existingFileUrl && typeof existingFileUrl === 'string' && existingFileUrl.startsWith('http'))}
                className="block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
              />
              {attachmentExist ? (
                <div className="mt-2">
                  {existingFileUrl && typeof existingFileUrl === 'string' && existingFileUrl.startsWith('http') ? (
                    <div className="flex items-center space-x-2">
                      <a 
                        href={existingFileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-savoy-blue text-sm underline"
                      >
                        View Existing File
                      </a>
                      <button
                        type="button"
                        className="underline text-red-600 text-sm"
                        onClick={() => {
                          setValue("policy_and_program_file", "");
                          setAttachmentExist(false);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="underline text-savoy-blue text-sm"
                      onClick={() => {
                        setValue("policy_and_program_file", "");
                        setAttachmentExist(false);
                      }}
                    >
                      Remove Attachment
                    </button>
                  )}
                </div>
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
                Chairman<span className="text-red-600">*</span>
              </h1>
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2">
              <input
                type="text"
                {...register(`chairman_name`)}
                id={`chairman_name`}
                placeholder={`Chairman Name`}
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
                placeholder={`Chairman Position`}
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
                  {...register(`member_name_${index + 1}`)}
                  id={`member_name_${index + 1}`}
                  placeholder={`Member ${index + 1} Name`}
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
              <div className="mt-2">
                <input
                  type="text"
                  {...register(`member_position_${index + 1}`)}
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
                placeholder={`Secretary Name`}
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
                placeholder={`Secretary Position`}
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

export default PolicyAndComittee;
