"use client";

import { useEffect, useState, useMemo } from "react";
import { Controller } from "react-hook-form";

import dynamic from "next/dynamic";

import CustomDatePicker from "@/components/CustomDatePicker";
import DrawSignatureModal from "../modals/DrawSignatureModal";
import FilePreviewModal from "../modals/FilePreviewModal";

import { XCircleIcon } from "@heroicons/react/24/solid";

import { QUILL_FORMATS, QUILL_MODULES } from "@/helpers/constants";

export default function ProgramAndPolicy({
  control,
  register,
  setValue,
  watch,
  validationMessage,
  missingFields = []
}: {
  control: any;
  register: any;
  setValue: any;
  watch: any;
  validationMessage?: string;
  missingFields?: string[];
}) {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  const [drawSignatureModal, setDrawSignatureModal] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string>("");
  const [drawnSignaturePreview, setDrawnSignaturePreview] = useState<string>("");
  const [uploadedSignaturePreview, setUploadedSignaturePreview] = useState<string>("");
  const [signatureAttachmentExist, setSignatureAttachmentExist] = useState(false);
  const [previousSignatureFile, setPreviousSignatureFile] = useState<string>("");
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState("");

  // Track current signature source and file
  useEffect(() => {
    const currentSignature = watch("signature");
    const currentSource = watch("signature_source");
    
    if (currentSignature && typeof currentSignature === "string") {
      setPreviousSignatureFile(currentSignature);
      setSignatureAttachmentExist(true);
      // Clear previews when we have a saved signature URL
      setDrawnSignaturePreview("");
      setUploadedSignaturePreview("");
      
      // Update currentFileUrl with the new signature URL
      const timestamp = new Date().getTime();
      setCurrentFileUrl(`${currentSignature}?t=${timestamp}`);
      return;
    }

    // Only show previews for unsaved signatures
    if (currentSource === "draw") {
      setUploadedSignaturePreview("");
      if (currentSignature instanceof File) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setDrawnSignaturePreview(event.target.result as string);
          }
        };
        reader.readAsDataURL(currentSignature);
      }
    } else if (currentSource === "upload") {
      setDrawnSignaturePreview("");
      if (currentSignature instanceof File) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedSignaturePreview(event.target.result as string);
          }
        };
        reader.readAsDataURL(currentSignature);
      }
    }
  }, [watch("signature"), watch("signature_source")]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("signature", file);
      setValue("previous_signature", previousSignatureFile);
      setValue("signature_source", "upload");
      setSignatureUrl("");
      setSignatureAttachmentExist(true);
      setDrawnSignaturePreview(""); // Clear drawn signature preview

      // Create preview URL for the uploaded file
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedSignaturePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearDrawnSignature = () => {
    setValue("signature", previousSignatureFile);
    setValue("signature_source", null);
    setDrawnSignaturePreview("");
    setSignatureUrl("");
  };

  const clearUploadedSignature = () => {
    setValue("signature", previousSignatureFile);
    setValue("signature_source", null);
    setUploadedSignaturePreview("");
    setSignatureUrl("");
  };

  const toggleDrawSignatureModal = () => {
    setDrawSignatureModal(!drawSignatureModal);
    if (!drawSignatureModal) {
      setUploadedSignaturePreview(""); // Clear uploaded preview when opening draw modal
    }
  };

  useEffect(() => {
    if (signatureUrl) {
      setValue("signature", signatureUrl);
      setValue("previous_signature", signatureUrl);
      setValue("signature_source", "draw");
      setSignatureAttachmentExist(true);
      
      // Handle both File objects and string URLs
      if (typeof signatureUrl === 'string') {
        setDrawnSignaturePreview(signatureUrl);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setDrawnSignaturePreview(event.target.result as string);
          }
        };
        reader.readAsDataURL(signatureUrl);
      }
      
      setUploadedSignaturePreview(""); // Clear uploaded preview when drawing
    }
  }, [signatureUrl, setValue]);

  const openImagePreview = (imageUrl: string) => {
    // Add a timestamp query parameter to prevent caching
    const timestamp = new Date().getTime();
    const urlWithTimestamp = `${imageUrl}?t=${timestamp}`;
    setCurrentFileUrl(urlWithTimestamp);
    setIsFileModalOpen(true);
  };

  // Function to render view signature button
  const renderViewSignatureButton = () => {
    const currentSignature = watch("signature");
    const signatureSource = watch("signature_source");
    
    if (typeof currentSignature === "string" && signatureSource) {
      return (
        <div className="flex items-center gap-4 mt-2">
          <button
            type="button"
            className="bg-savoy-blue text-white px-4 py-2 rounded-md text-sm"
            onClick={() => {
              // Use the complete URL directly
              openImagePreview(currentSignature);
            }}
          >
            View Signature
          </button>
        </div>
      );
    }
    return null;
  };

  // Helper function to check if a field is missing
  const isMissingField = (fieldName: string) => {
    return missingFields.includes(fieldName);
  };

  return (
    <form>
      <div className="px-4 pt-4 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-4">
          <div className="sm:col-span-4 mt-4 mb-6 md:mb-0">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Basic Components of Company OSH Program and Policy
            </label>
            <h1 className="text-sm text-gray-500">
              (DO 198-18, Chapter IV, Section 12)
            </h1>
            <div className="mt-2 h-48 sm:h-72 mb-8 sm:mb-16">
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
          <div className="sm:col-span-4 mt-6 md:mt-4 mb-6 md:mb-0">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Company Commitment to Comply with OSH Policy
            </label>
            <div className="mt-2 h-48 sm:h-72 mb-8 sm:mb-12">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
          <div className="mt-6 md:mt-0">
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
                render={({ field }: { field: any }) => {
                  // Parse as local date (not UTC)
                  const selectedDate = field.value ? new Date(field.value + 'T00:00:00') : null;
                  return (
                    <CustomDatePicker
                      id="date"
                      placeholder={"mm/dd/yyyy"}
                      className={
                        `block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset 
                        ${isMissingField('date') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none`
                      }
                      selected={selectedDate}
                      pickerOnChange={(date: any) => {
                        if (date) {
                          // Format date in local time
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
                className={`rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
                ${isMissingField('name_of_owner') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6`}
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
                className={`w-full rounded-md bg-white border px-4 sm:px-14 py-2 sm:py-1.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                ${isMissingField('signature') ? 'border-red-500' : 'border-savoy-blue'}`}
                onClick={toggleDrawSignatureModal}
              >
                Draw
              </button>
              {drawnSignaturePreview && (
                <div className="mt-3 border rounded-lg overflow-hidden bg-gray-50">
                  <div className="p-3 border-b bg-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <p className="text-sm font-medium text-gray-700">Signature Preview</p>
                    <button
                      type="button"
                      className="text-savoy-blue text-sm underline self-start sm:self-auto"
                      onClick={clearDrawnSignature}
                    >
                      Remove Attachment
                    </button>
                  </div>
                  <div className="p-4 flex justify-center items-center bg-white">
                    <div className="relative w-full h-[80px] sm:h-[100px]">
                      <img
                        src={drawnSignaturePreview}
                        alt="Drawn Signature Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}
              {!drawnSignaturePreview && watch("signature_source") === "draw" && renderViewSignatureButton()}
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
                onChange={handleFileUpload}
                type="file"
                accept="image/*"
                className={`block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset 
                ${isMissingField('name_of_owner') ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 sm:text-sm sm:leading-6 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100`}
              />
              <p className="mt-1 text-sm text-gray-500">Maximum file size: 10 MB</p>
              {uploadedSignaturePreview && (
                <div className="mt-3 border rounded-lg overflow-hidden bg-gray-50">
                  <div className="p-3 border-b bg-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <p className="text-sm font-medium text-gray-700">Signature Preview</p>
                    <button
                      type="button"
                      className="text-savoy-blue text-sm underline self-start sm:self-auto"
                      onClick={clearUploadedSignature}
                    >
                      Remove Attachment
                    </button>
                  </div>
                  <div className="p-4 flex justify-center items-center bg-white">
                    <div className="relative w-full h-[80px] sm:h-[100px]">
                      <img
                        src={uploadedSignaturePreview}
                        alt="Uploaded Signature Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}
              {!uploadedSignaturePreview && watch("signature_source") === "upload" && renderViewSignatureButton()}
            </div>
          </div>
        </div>
      </div>
      {drawSignatureModal && (
        <DrawSignatureModal
          isOpen={drawSignatureModal}
          setIsOpen={setDrawSignatureModal}
          setSignatureUrl={setSignatureUrl}
          setPreviewUrl={setDrawnSignaturePreview}
        />
      )}
      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        fileUrl={currentFileUrl}
        title="Signature"
      />
    </form>
  );
}
