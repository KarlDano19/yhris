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

  useEffect(() => {
    const signatureValue = watch("signature");
    if (signatureValue && signatureValue !== "") {
      clearErrors("signature");
    }
  }, [watch("signature"), clearErrors]);

  // Handle form submission with validation (name, position, then signature)
  const onValid = (data: any) => {
    const nameValue = watch("requesting_personnel_name");
    const positionValue = watch("requesting_personnel_position");
    const signatureValue = watch("signature");

    if (!nameValue || nameValue === "") {
      const el = document.getElementById("requesting_personnel_name");
      if (el) el.focus();
      return;
    }
    if (!positionValue || positionValue === "") {
      const el = document.getElementById("requesting_personnel_position");
      if (el) el.focus();
      return;
    }
    if (!signatureValue || signatureValue === "") {
      setError("signature", {
        type: "manual",
        message: "Signature is required (draw or upload)."
      });
      return;
    }
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
        <div className="mt-4 pl-6 pr-6">
          <h1 className="text-lg font-semibold">
            Data Privacy and Certification
          </h1>
        </div>
        <div className="gap-6 mt-4 space-y-4 pl-6 pr-6">
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
        <div className="grid grid-cols-2 gap-6 mt-4 pl-6 pr-6">
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
              {!existingSignatureUrl && <span className="text-red-600">*</span>}
            </label>
            {errors.signature && (
              <p className="text-xs text-red-600 mt-1">
                {errors.signature.message || "Signature is required (draw or upload)."}
              </p>
            )}
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
            {errors.signature && (
              <p className="text-xs text-red-600 mt-1">
                {errors.signature.message || "Signature is required (draw or upload)."}
              </p>
            )}
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
        <div className="mt-4">
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
          className="w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default DataPrivacyAndCertification;
