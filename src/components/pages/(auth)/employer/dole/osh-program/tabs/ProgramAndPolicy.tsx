"use client";

import { useEffect, useState, useMemo } from "react";

import { Controller } from "react-hook-form";
import dynamic from "next/dynamic";

import { QUILL_FORMATS, QUILL_MODULES } from "@/helpers/constants";
import CustomDatePicker from "@/components/CustomDatePicker";
import DrawSignatureModal from "../modals/DrawSignatureModal";
import { useImageUrlHelpers } from "../hooks/useImageUrlHelpers";
import ImagePreviewModal from "../modals/ImagePreviewModal";

import { XCircleIcon } from "@heroicons/react/24/solid";


export default function ProgramAndPolicy({
  control,
  register,
  setValue,
  watch,
  validationMessage,
}: {
  control: any;
  register: any;
  setValue: any;
  watch: any;
  validationMessage?: string;
}) {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  const [drawSignatureModal, setDrawSignatureModal] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string>("");
  const [signatureAttachmentExist, setSignatureAttachmentExist] = useState(false);
  const [previousSignatureFile, setPreviousSignatureFile] = useState<string>("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  
  const { getSignatureImageUrl } = useImageUrlHelpers();

  const toggleDrawSignatureModal = () => {
    setDrawSignatureModal(!drawSignatureModal);
  };

  useEffect(() => {
    if (signatureUrl) {
      setValue("signature", signatureUrl);
      setValue("previous_signature", signatureUrl);
      setSignatureAttachmentExist(true);
    }
    if (!drawSignatureModal && signatureUrl) {
      setSignatureUrl("");
    }
  }, [signatureUrl, setValue, drawSignatureModal]);

  useEffect(() => {
    const currentSignature = watch("signature");
    if (typeof currentSignature === "string" && currentSignature !== previousSignatureFile) {
      setPreviousSignatureFile(currentSignature);
      setSignatureAttachmentExist(true);
    }
  }, [watch("signature")]);

  const openImagePreview = (fileName: string) => {
    const imageUrl = getSignatureImageUrl(fileName);
    setCurrentImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  return (
    <form>
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
                {validationMessage || "You cannot proceed due to incomplete fields. Please review."}
              </h3>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="sm:col-span-4 mt-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Basic Components of Company OSH Program and Policy
            </label>
            <h1 className="text-sm text-gray-500">
              (DO 198-18, Chapter IV, Section 12)
            </h1>
            <div className="mt-2 h-72 mb-12">
              <textarea
                rows={4}
                {...register("basic_components")}
                id="basic_components"
                hidden
              />
              <ReactQuill
                onChange={(value) => setValue("basic_components", value)}
                formats={QUILL_FORMATS}
                modules={QUILL_MODULES}
                style={{
                  height: "100%",
                  padding: "5px 8px !important",
                }}
                value={watch("basic_components") || ""}
              />
            </div>
          </div>
          <div className="sm:col-span-4 mt-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Company Commitment to Comply with OSH Policy
            </label>
            <div className="mt-2 h-72 mb-12">
              <textarea
                rows={4}
                {...register("company_commitment")}
                id="company_commitment"
                hidden
              />
              <ReactQuill
                onChange={(value) => setValue("company_commitment", value)}
                formats={QUILL_FORMATS}
                modules={QUILL_MODULES}
                style={{
                  height: "100%",
                  padding: "5px 8px !important",
                }}
                value={watch("company_commitment") || ""}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mt-4">
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
                name="date"
                render={({ field }) => (
                  <CustomDatePicker
                    id="date"
                    placeholder={"mm/dd/yyyy"}
                    className={
                      "block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none"
                    }
                    selected={field.value ? new Date(field.value) : null}
                    pickerOnChange={(date: any) => {
                      if (date) {
                        const formattedDate = date.toISOString().split('T')[0];
                        field.onChange(formattedDate);
                      } else {
                        field.onChange(null);
                      }
                    }}
                    inputOnChange={(value: any) => field.onChange(value)}
                    required={true}
                  />
                )}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="name_of_owner"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name of Owner
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("name_of_owner")}
                id="name_of_owner"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="signature"
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
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setValue("signature", file);
                    setValue("previous_signature", previousSignatureFile);
                    setSignatureUrl("");
                    setSignatureAttachmentExist(true);
                  }
                }}
                type="file"
                accept="image/*"
                className="block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
              />
              <div className="flex items-center gap-4 mt-2">
                {previousSignatureFile && (
                  <button
                    type="button"
                    className="bg-savoy-blue text-white px-4 py-2 rounded-md text-sm"
                    onClick={() => {
                      const fileName = previousSignatureFile.split('/').pop();
                      openImagePreview(fileName || "");
                    }}
                  >
                    View Signature
                  </button>
                )}
              </div>
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
      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={currentImageUrl}
        title="Signature"
      />
    </form>
  );
}
