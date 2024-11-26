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
import DrawSignatureModal from "../DrawSignatureModal";

function TechnicalAndSignature({
  control,
  register,
  onSubmit,
  setSelectedTab,
  setValue,
}: {
  control: any;
  register: any;
  onSubmit: any;
  setSelectedTab: any;
  setValue: any;
}) {

  const [drawSignatureModal, setDrawSignatureModal] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [attachmentPolicyExist, setAttachmentPolicyExist] = useState(false);
  const [attachmentExist, setAttachmentExist] = useState(false);

  const toggleDrawSignatureModal = () => {
    setDrawSignatureModal(!drawSignatureModal);
  };

  useEffect(() => {
    if (signatureUrl) {
      setValue("signature", signatureUrl);
    } else {
      setSignatureUrl("");
    }
    if (!drawSignatureModal && signatureUrl) {
      setSignatureUrl("");
    }
  }, [signatureUrl, setValue, drawSignatureModal]);

  useEffect(() => {
    if (fileUrl) {
      setValue("policy_and_program_on_safety_and_health", fileUrl);
    } else {
      setFileUrl("");
    }
  }, [fileUrl, setValue]);

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
        <div className="grid grid-cols-2 gap-6 mt-4 pl-6 pr-6">
          <div>
            <label
              htmlFor="prepared_by"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Submitted By
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("prepared_by", { required: true })}
                id="prepared_by"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Position
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("position", { required: true })}
                id="position"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 pl-6 pr-6">
          <h1 className="text-sm font-medium">Signature</h1>
        </div>
        <div className="grid grid-cols-2 gap-6 mt-4 pl-6 pr-6">
          <div>
            <label
              htmlFor="draw_signature"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Draw Signature
              <span className="text-red-600">*</span>
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
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                id="signature"
                {...register("signature")}
                onChange={(e) => {
                  e.target.value ? setSignatureUrl("") : null;
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
                    setValue("signature", "");
                    setAttachmentExist(false);
                  }}
                >
                  Remove Attachment
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
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
          onClick={() => setSelectedTab(2)}
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

export default TechnicalAndSignature;
