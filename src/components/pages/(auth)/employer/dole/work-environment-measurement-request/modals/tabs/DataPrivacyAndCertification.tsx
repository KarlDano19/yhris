"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { XCircleIcon } from "@heroicons/react/24/solid";
import DrawSignatureModal from "../DrawSignatureModal";

function DataPrivacyAndCertification({
  control,
  register,
  onSubmit,
  setSelectedTab,
  setValue,
  watch,
  errors,
  setError,
  clearErrors,
  isLoading,
}: {
  control: any;
  register: any;
  onSubmit: any;
  setSelectedTab: any;
  setValue: any;
  watch: any;
  errors: any;
  setError: any;
  clearErrors: any;
  isLoading: any;
}) {

  const [drawSignatureModal, setDrawSignatureModal] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string>("");
  const [previousSignatureFile, setPreviousSignatureFile] = useState<string>("");
  const [signatureSource, setSignatureSource] = useState<string>("");

  // Watch for existing signature URL from form
  const existingSignatureUrl = watch("signature");

  const toggleDrawSignatureModal = () => {
    setDrawSignatureModal(!drawSignatureModal);
  };

  // Track current signature source and file
  useEffect(() => {
    const currentSignature = watch("signature");
    const currentSource = watch("signature_source");
    
    if (currentSignature && typeof currentSignature === "string") {
      setPreviousSignatureFile(currentSignature);
      return;
    }

    // Only show previews for unsaved signatures
    if (currentSource === "draw") {
    } else if (currentSource === "upload") {
    }
  }, [watch]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("signature", file);
      setValue("previous_signature", previousSignatureFile);
      setValue("signature_source", "upload");
      setSignatureSource("upload");
      setSignatureUrl(URL.createObjectURL(file));
    }
  };

  // Handle drawn signature from modal
  const handleDrawnSignature = (drawnSignatureDataUrl: string) => {
    // Convert data URL to Blob
    fetch(drawnSignatureDataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        // Create a File object from the Blob
        const file = new File([blob], "signature.png", { type: "image/png" });
        
        // Update form state with the File object
        setValue("signature", file);
        setValue("previous_signature", previousSignatureFile);
        setValue("signature_source", "draw");
        setSignatureSource("draw");
        setSignatureUrl(drawnSignatureDataUrl);
      });
  };

  useEffect(() => {
    if (signatureUrl) {
      // If signatureUrl is a data URL from drawing
      if (signatureUrl.startsWith('data:')) {
        fetch(signatureUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "signature.png", { type: "image/png" });
            setValue("signature", file);
            setValue("previous_signature", previousSignatureFile);
            setValue("signature_source", "draw");
            setSignatureSource("draw");
          })
          .catch(err => {
            console.error("Error converting signature data URL to file:", err);
          });
      } else if (signatureUrl.startsWith('blob:')) {
        // Uploaded file preview
        setSignatureSource("upload");
      } else {
        setValue("signature", signatureUrl);
        setValue("previous_signature", signatureUrl);
        setValue("signature_source", "");
        setSignatureSource("");
      }
    }
  }, [signatureUrl, setValue, previousSignatureFile]);

  // Check if there are existing signature URLs (for edit mode)
  useEffect(() => {
    if (existingSignatureUrl && typeof existingSignatureUrl === 'string' && existingSignatureUrl.startsWith('http')) {
      setSignatureUrl(existingSignatureUrl);
      setSignatureSource("");
      // Ensure the existing signature is properly set in form state
      setValue("signature", existingSignatureUrl);
      setValue("previous_signature", existingSignatureUrl);
    }
  }, [existingSignatureUrl, setValue]);


  // Clear errors when signature is changed
  const signatureValue = watch("signature");

  useEffect(() => {
    if (signatureValue && signatureValue !== "") {
      clearErrors("signature");
    }
  }, [signatureValue, clearErrors]);

  useEffect(() => {
    const nameValue = watch("requesting_personnel_name");
    if (nameValue) {
      clearErrors("requesting_personnel_name");
    }
  }, [watch("requesting_personnel_name"), clearErrors]);

  useEffect(() => {
    const positionValue = watch("requesting_personnel_position");
    if (positionValue) {
      clearErrors("requesting_personnel_position");
    }
  }, [watch("requesting_personnel_position"), clearErrors]);

  // Handle form submission with validation (name, position, then signature)
  const onValid = (data: any) => {
    const nameValue = watch("requesting_personnel_name");
    const positionValue = watch("requesting_personnel_position");
    const signatureValue = watch("signature");

    let hasError = false;
    if (!nameValue || nameValue === "") {
      setError("requesting_personnel_name", { type: "manual", message: "Requesting Personnel Name is required." });
      hasError = true;
    }
    if (!positionValue || positionValue === "") {
      setError("requesting_personnel_position", { type: "manual", message: "Requesting Personnel Position is required." });
      hasError = true;
    }
    if (!signatureValue || signatureValue === "") {
      setError("signature", {
        type: "manual",
        message: "Signature is required (draw or upload)."
      });
      hasError = true;
    }
    if (hasError) return;
    onSubmit();
  };

  return (
    <form onSubmit={e => { e.preventDefault(); onValid({}); }}>
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
        <div className="mt-4 pl-4 md:pl-6 pr-4 md:pr-6">
          <h1 className="text-lg font-semibold">
            Data Privacy and Certification
          </h1>
        </div>
        <div className="gap-6 mt-4 space-y-4 pl-4 md:pl-6 pr-4 md:pr-6">
          <p>
            This is to certify that the company agrees to pay all the expenses
            incurred during coordination and other pre-WEM activities such as
            communication, consumables, transportation expense, etc. in the
            event that the company cancels the WEM on/or 5 working days before
            the scheduled WEM.
          </p>
          <p>
            By filling out this form and signing below, I am giving my consent
            to the OSHC to collect, process, retain, and store my personal data
            in accordance with the provision of Republic Act 10173 - Data
            Privacy Act of 2012.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 pl-4 md:pl-6 pr-4 md:pr-6">
          <div>
            <label
              htmlFor="requesting_personnel_name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name of Requesting Personnel
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("requesting_personnel_name", { required: true })}
                id="requesting_personnel_name"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
            {errors?.requesting_personnel_name && (
              <p className="text-xs text-red-600 mt-1">Requesting Personnel Name is required.</p>
            )}
          </div>
          <div>
            <label
              htmlFor="requesting_personnel_position"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Position/ Designation
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("requesting_personnel_position", { required: true })}
                id="requesting_personnel_position"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
            {errors?.requesting_personnel_position && (
              <p className="text-xs text-red-600 mt-1">Requesting Personnel Position is required.</p>
            )}
          </div>
        </div>
        <div className="mt-4 pl-4 md:pl-6 pr-4 md:pr-6">
          <h1 className="text-sm font-medium">Signature</h1>
          {errors.signature && (
              <p className="text-xs text-red-600 mt-1">
                {errors.signature.message || "Signature is required (draw or upload)."}
              </p>
            )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 pl-4 md:pl-6 pr-4 md:pr-6">
          <div>
            <label
              htmlFor="draw_signature"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Draw Signature
              {!existingSignatureUrl && <span className="text-red-600">*</span>}
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
              {!existingSignatureUrl && <span className="text-red-600">*</span>}
            </label>
            <div className="relative mt-2">
              <input
                id="signature"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Only show this if there's a signatureUrl (drawn, uploaded, or existing) and no previews */}
      {signatureUrl && (
        <div className="px-4 md:px-0 mt-4">
          <div
            className={`text-center font-semibold mb-2 ${
              signatureSource === "draw" || signatureSource === "upload"
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {signatureSource === "draw" || signatureSource === "upload" ? "Preview" : "Existing Signature"}
          </div>
          <Image
            className="border-0 ring-1 ring-inset ring-gray-300 m-auto mb-6"
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
          setSignatureUrl={(url: any) => {
            setSignatureUrl(url);
            handleDrawnSignature(url);
          }}
        />
      )}
      
      <hr />
      <div className="flex justify-between py-4 px-4">
        <button
          type="button"
          className="w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setSelectedTab(3)}
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default DataPrivacyAndCertification;
