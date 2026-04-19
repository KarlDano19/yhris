"use client";

import { useEffect, useState } from "react";

import { Tooltip } from 'react-tooltip';

import InfoIcon from '@/svg/InfoIcon';

import { XCircleIcon } from "@heroicons/react/24/solid";
import SelectChevronDown from "@/svg/SelectChevronDown";

function PolicyAndComittee({
  register,
  handleSubmit,
  setSelectedTab,
  setValue,
  watch,
  isCreateModal,
  errors,
}: {
  control: any;
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
  setValue: any;
  watch: any;
  isCreateModal: boolean;
  errors: any;
}) {
  const [fileUrl, setFileUrl] = useState<string>("");
  const [attachmentExist, setAttachmentExist] = useState(false);
  const [committeeType, setCommitteeType] = useState<string>("A");
  const [fileSource, setFileSource] = useState<string>("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [showFileError, setShowFileError] = useState(false);
  
  // Watch for existing file URL from form
  const existingFileUrl = watch("policy_and_program_file");

  // Track current file source and file
  useEffect(() => {
    const currentFile = watch("policy_and_program_file");
    const currentSource = watch("file_source");
    
    if (currentFile && typeof currentFile === "string") {
      return;
    }

    // Only show previews for unsaved files
    if (currentSource === "upload") {
    }
  }, [watch]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("policy_and_program_file", file);
      setValue("file_source", "upload");
      setFileSource("upload");
      setFileUrl(URL.createObjectURL(file));
      setAttachmentExist(true);
      setShowFileError(false);
    }
  };

  useEffect(() => {
    if (fileUrl) {
      // If fileUrl is a blob URL from upload
      if (fileUrl.startsWith('blob:')) {
        setFileSource("upload");
      } else {
        setValue("policy_and_program_file", fileUrl);
        setFileSource("");
      }
    }
  }, [fileUrl, setValue]);

  // Check if there's an existing file URL (for edit mode)
  useEffect(() => {
    if (existingFileUrl && typeof existingFileUrl === 'string' && existingFileUrl.startsWith('http')) {
      setAttachmentExist(true);
      setFileSource("");
    }
  }, [existingFileUrl]);

  // Show tooltip for 2 seconds when component mounts (only in create modal)
  useEffect(() => {
    if (isCreateModal) {
      setShowTooltip(true);
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCreateModal]);

  const handleCommitteeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCommitteeType(e.target.value);
  };

  // Mapping of committee types to the number of members
  const committeeMembersCount = {
    A: 3,
    B: 3,
    C: 3,
    D: 2,
    E: 2,
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
      setShowFileError(false);
      if (isFileMissing) { setShowFileError(true); return; }
      setSelectedTab(3);
    })}>
      <div className="px-4 pt-4 pb-6">
        {showFileError && (
          <div className="rounded-md bg-red-50 p-4 mb-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Please upload a Policy and Program on Safety and Health file before proceeding.
                </h3>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 px-2 md:px-6">
          <div className="flex-1">
            <label
              htmlFor="policy_and_program_file"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
             Policy and Program on Safety and Health
              <span className="text-red-600">*</span>
              <div
                className='inline-block ml-1 cursor-pointer'
                data-tooltip-id='file-upload-tooltip'
                data-tooltip-place='right'
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <InfoIcon />
              </div>
              <Tooltip 
                id='file-upload-tooltip' 
                opacity={1} 
                style={{ fontSize: '10px' }}
                isOpen={showTooltip}
              >
                <div>
                  <h2 className='text-[12px] font-medium'>Note: File uploads may disappear if the screen loses focus. Please re-upload if needed.</h2>
                </div>
              </Tooltip>
            </label>
            <div className="relative mt-2">
              <input
                id="policy_and_program_file"
                type="file"
                accept="*/*"
                onChange={handleFileUpload}
                className="block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
              />
              {showFileError && <p className="text-red-500 text-xs mt-1">This field is required.</p>}
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
                    </div>
                  ) : null}
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
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
              <div className="pointer-event-none absolute inset-y-0 right-0 flex items-center pr-4">
                <SelectChevronDown />
              </div>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="mt-4 px-2 md:px-6">
          <h1 className="text-sm font-medium">Central Safety Committee</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4 pb-6">
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
                {...register(`chairman_name`, { required: true })}
                id={`chairman_name`}
                placeholder={`Chairman Name`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
              {errors?.chairman_name && <p className="text-red-500 text-xs mt-1">This field is required.</p>}
            </div>
          </div>
          <div className="grid-item">
            <div className="mt-2">
              <input
                type="text"
                {...register(`chairman_position`, { required: true })}
                id={`chairman_position`}
                placeholder={`Chairman Position`}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
              {errors?.chairman_position && <p className="text-red-500 text-xs mt-1">This field is required.</p>}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mt-4 pb-6">
          {/* Render member inputs based on committee type */}
          {Array.from({ length: committeeMembersCount[committeeType as keyof typeof committeeMembersCount] }).map((_, index) => (
            <div key={index} className="grid-item grid grid-cols-1 md:grid-cols-3 gap-4 col-span-4"> {/* Ensure it spans the full width */}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4 pb-6">
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
