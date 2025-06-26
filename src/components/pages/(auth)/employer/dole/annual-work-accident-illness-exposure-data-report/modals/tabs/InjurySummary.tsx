"use client";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

import { XCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import DrawSignatureModal from "../DrawSignatureModal";
import useGetDisablingInjuryData from "../../hooks/useGetDisablingInjuryData";

interface CachedProfileData {
  name: string;
  type_of_industry: string;
  city: string;
}

function InjurySummary({
  control,
  register,
  onSubmit,
  setSelectedTab,
  setValue,
  isLoading,
  watch,
  initialEmployeeHours = 0,
  initialDaysLost = 0,
}: {
  control: any;
  register: any;
  onSubmit: any;
  setSelectedTab: any;
  setValue: any;
  isLoading: boolean;
  watch: any;
  initialEmployeeHours?: number;
  initialDaysLost?: number;
}) {
  const queryClient = useQueryClient();
  const cachedProfile = queryClient
    .getQueryCache()
    .find(["employerProfileCache"]) as {
    state: { data: CachedProfileData } | undefined;
  };
  const [drawSignatureModal, setDrawSignatureModal] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string>("");
  const [attachmentExist, setAttachmentExist] = useState(false);
  const [totalDisablingInjuries, setTotalDisablingInjuries] =
    useState<number>(0);
  const [employeeHours, setEmployeeHours] = useState<number>(0);
  const [daysLost, setDaysLost] = useState<number>(0);

  // Watch for existing signature URL from form
  const existingSignatureUrl = watch("signature");

  const { data: reportsData, refetch: refetchReportsData } = useGetDisablingInjuryData();

  const toggleDrawSignatureModal = () => {
    setDrawSignatureModal(!drawSignatureModal);
  };

  useEffect(() => {
    if (signatureUrl) {
      setValue("signature", signatureUrl);
    }
  }, [signatureUrl, setValue]);

  // Check if there are existing signature URLs (for edit mode)
  useEffect(() => {
    if (existingSignatureUrl && typeof existingSignatureUrl === 'string' && existingSignatureUrl.startsWith('http')) {
      setAttachmentExist(true);
      setSignatureUrl(existingSignatureUrl);
    }
  }, [existingSignatureUrl]);

  useEffect(() => {
    if (employeeHours > 0) {
      const calculatedFrequencyRate =
        (totalDisablingInjuries * 1000000) / employeeHours;
      setValue("frequency_rate", calculatedFrequencyRate);
    } else {
      setValue("frequency_rate", 0);
    }
  }, [totalDisablingInjuries, employeeHours, setValue]);

  useEffect(() => {
    if (employeeHours > 0) {
      const calculatedSeverityRate = (daysLost * 1000000) / employeeHours;
      setValue("severity_rate", calculatedSeverityRate);
    } else {
      setValue("severity_rate", 0);
    }
  }, [daysLost, employeeHours, setValue]);

  useEffect(() => {
    refetchReportsData();
  }, [refetchReportsData]);

  useEffect(() => {
    if (reportsData && reportsData.records) {
      const totalDisabling = reportsData.records.filter((report: any) => report.disabling_injury === true).length;
      const totalNonDisabling = reportsData.records.filter((report: any) => report.disabling_injury === false).length;
      setValue("total_disabling_injuries", totalDisabling);
      setValue("total_non_disabling_injuries", totalNonDisabling);
    } else {
      setValue("total_disabling_injuries", 0);
      setValue("total_non_disabling_injuries", 0);
    }
  }, [reportsData, setValue]);

  useEffect(() => {
    setEmployeeHours(initialEmployeeHours);
    setDaysLost(initialDaysLost);
  }, [initialEmployeeHours, initialDaysLost]);

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
        <div className="grid grid-cols-2 gap-6 mt-4 pb-6">
          <div>
            <label
              htmlFor="total_disabling_injuries"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Total-All Disabling Injuries/ Illnesses
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("total_disabling_injuries")}
                disabled
                id="total_disabling_injuries"
                className="cursor-not-allowed opacity-50 rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="total_non_disabling_injuries"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Total-Non-Disabling Injuries
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("total_non_disabling_injuries")}
                disabled
                id="total_non_disabling_injuries"
                className="cursor-not-allowed opacity-50 rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="frequency_rate"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Frequency Rate
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("frequency_rate", { required: true })}
                id="frequency_rate"
                className="cursor-not-allowed opacity-50 rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                disabled
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="severity_rate"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Severity Rate
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("severity_rate", { required: true })}
                id="severity_rate"
                className="cursor-not-allowed opacity-50 rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                disabled
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h1 className="text-lg font-semibold">Signature</h1>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-4">
          <div>
            <label
              htmlFor="name_signature"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("name_signature", {
                  required: true,
                })}
                id="naname_signatureme"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="draw_signature"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Draw Signature
            </label>
            <div className="relative mt-2">
              <button
                type="button"
                className="w-full rounded-md bg-white border border-savoy-blue px-14 py-1.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={toggleDrawSignatureModal}
              >
                Draw
              </button>
            </div>
          </div>
          <div className="flex-1">
            <label
              htmlFor="signature"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Upload Signature
            </label>
            <div className="relative mt-2">
              <input
                id="signature"
                {...register("signature")}
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setSignatureUrl(reader.result as string);
                      setAttachmentExist(true);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setSignatureUrl("");
                    setAttachmentExist(false);
                  }
                }}
                type="file"
                disabled={!!(existingSignatureUrl && typeof existingSignatureUrl === 'string' && existingSignatureUrl.startsWith('http'))}
                className="block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
              />
              {attachmentExist ? (
                <div className="mt-2">
                  {existingSignatureUrl && typeof existingSignatureUrl === 'string' && existingSignatureUrl.startsWith('http') ? (
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="underline text-red-600 text-sm"
                        onClick={() => {
                          setValue("signature", "");
                          setAttachmentExist(false);
                          setSignatureUrl("");
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
                        setValue("signature", "");
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
        </div>
      </div>
      {signatureUrl !== "" && (
        <div className="mt-4">
          <Image
            className="border-0 ring-1 ring-inset ring-gray-300 m-auto"
            src={signatureUrl}
            width={500}
            height={200}
            alt="signatureImage"
          />
        </div>
      )}
      {drawSignatureModal && (
        <DrawSignatureModal
          isOpen={drawSignatureModal}
          setIsOpen={setDrawSignatureModal}
          setSignatureUrl={setSignatureUrl}
        />
      )}
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
          {isLoading && (
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-6 h-6 mr-2 text-gray-200 animate-spin fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
          {!isLoading && "Submit"}
        </button>
      </div>
    </form>
  );
}

export default InjurySummary;