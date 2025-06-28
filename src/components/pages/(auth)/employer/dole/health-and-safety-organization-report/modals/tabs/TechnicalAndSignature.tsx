"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { Tooltip } from 'react-tooltip';

import DrawSignatureModal from "../DrawSignatureModals";
import InfoIcon from '@/svg/InfoIcon';

import { XCircleIcon } from "@heroicons/react/24/solid";

function TechnicalAndSignature({
  control,
  register,
  onSubmit,
  setSelectedTab,
  setValue,
  watch,
}: {
  control: any;
  register: any;
  onSubmit: any;
  setSelectedTab: any;
  setValue: any;
  watch: any;
}) {

  const [drawSignatureModal, setDrawSignatureModal] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string>("");
  const [attachmentExist, setAttachmentExist] = useState(false);
  const [technicalFileUrl, setTechnicalFileUrl] = useState<string>("");
  const [attachmentTechnicalExist, setAttachmentTechnicalExist] = useState(false);
  const [signatureSource, setSignatureSource] = useState<string>("");
  const [technicalFileSource, setTechnicalFileSource] = useState<string>("");
  const [previousSignatureFile, setPreviousSignatureFile] = useState<string>("");

  // Watch for existing file URLs from form
  const existingTechnicalFileUrl = watch("technical_information_file");
  const existingSignatureUrl = watch("signature");

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

  // Track current technical file source and file
  useEffect(() => {
    const currentFile = watch("technical_information_file");
    const currentSource = watch("technical_file_source");
    
    if (currentFile && typeof currentFile === "string") {
      return;
    }

    // Only show previews for unsaved files
    if (currentSource === "upload") {
    }
  }, [watch]);

  const handleTechnicalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("technical_information_file", file);
      setValue("technical_file_source", "upload");
      setTechnicalFileSource("upload");
      setTechnicalFileUrl(URL.createObjectURL(file));
      setAttachmentTechnicalExist(true);
    }
  };

  const handleSignatureFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("signature", file);
      setValue("previous_signature", previousSignatureFile);
      setValue("signature_source", "upload");
      setSignatureSource("upload");
      setSignatureUrl(URL.createObjectURL(file));
      setAttachmentExist(true);
    }
  };

  const toggleDrawSignatureModal = () => {
    setDrawSignatureModal(!drawSignatureModal);
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
        setValue("signature_source", "draw");
        setSignatureSource("");
      }
    }
  }, [signatureUrl, setValue]);

  useEffect(() => {
    if (technicalFileUrl) {
      // If technicalFileUrl is a blob URL from upload
      if (technicalFileUrl.startsWith('blob:')) {
        setTechnicalFileSource("upload");
      } else {
        setValue("technical_information_file", technicalFileUrl);
        setTechnicalFileSource("");
      }
    }
  }, [technicalFileUrl, setValue]);

  // Check if there are existing file URLs (for edit mode)
  useEffect(() => {
    if (existingTechnicalFileUrl && typeof existingTechnicalFileUrl === 'string' && existingTechnicalFileUrl.startsWith('http')) {
      setAttachmentTechnicalExist(true);
      setTechnicalFileSource("");
    }
  }, [existingTechnicalFileUrl]);

  useEffect(() => {
    if (existingSignatureUrl && typeof existingSignatureUrl === 'string' && existingSignatureUrl.startsWith('http')) {
      setAttachmentExist(true);
      setSignatureUrl(existingSignatureUrl);
      setSignatureSource("");
    }
  }, [existingSignatureUrl]);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      // Technical Information File
      const techFileInput = form.elements.namedItem('technical_information_file') as HTMLInputElement;
      const techFiles = techFileInput && techFileInput.files;
      const techFileField = techFiles && techFiles.length > 0 ? techFiles[0] : null;
      const isTechFileMissing =
        (!techFileField || (techFileField && !techFileField.name)) &&
        !(existingTechnicalFileUrl && typeof existingTechnicalFileUrl === 'string' && existingTechnicalFileUrl.startsWith('http'));
      // Submitted By
      const submittedByInput = form.elements.namedItem('submitted_by') as HTMLInputElement;
      const submittedByValue = submittedByInput && submittedByInput.value.trim();
      // Position
      const positionInput = form.elements.namedItem('position') as HTMLInputElement;
      const positionValue = positionInput && positionInput.value.trim();
      // Signature
      const sigFileInput = form.elements.namedItem('signature') as HTMLInputElement;
      const sigFiles = sigFileInput && sigFileInput.files;
      const sigFileField = sigFiles && sigFiles.length > 0 ? sigFiles[0] : null;
      // Accept: file upload, data URL (drawn), or existing URL
      const signatureValue = (sigFileField && sigFileField.name)
        ? sigFileField
        : (typeof signatureUrl === 'string' && signatureUrl.startsWith('data:image/'))
          ? signatureUrl
          : (existingSignatureUrl && typeof existingSignatureUrl === 'string' && existingSignatureUrl.startsWith('http'))
            ? existingSignatureUrl
            : null;

      // Show toast for each missing required field
      if (isTechFileMissing) {
        import('react-hot-toast').then(({ default: toast }) => {
          import('@/components/CustomToast').then(({ default: CustomToast }) => {
            toast.custom(() => <CustomToast message="Technical Information file is required." type="error" />, { duration: 5000 });
          });
        });
        return;
      }
      if (!submittedByValue) {
        import('react-hot-toast').then(({ default: toast }) => {
          import('@/components/CustomToast').then(({ default: CustomToast }) => {
            toast.custom(() => <CustomToast message="Submitted By is required." type="error" />, { duration: 5000 });
          });
        });
        const el = document.getElementById("submitted_by");
        if (el) el.focus();
        return;
      }
      if (!positionValue) {
        import('react-hot-toast').then(({ default: toast }) => {
          import('@/components/CustomToast').then(({ default: CustomToast }) => {
            toast.custom(() => <CustomToast message="Position is required." type="error" />, { duration: 5000 });
          });
        });
        const el = document.getElementById("position");
        if (el) el.focus();
        return;
      }
      if (!signatureValue) {
        import('react-hot-toast').then(({ default: toast }) => {
          import('@/components/CustomToast').then(({ default: CustomToast }) => {
            toast.custom(() => <CustomToast message="Signature is required (draw or upload)." type="error" />, { duration: 5000 });
          });
        });
        return;
      }
      // Call the original onSubmit
      if (typeof onSubmit === 'function') onSubmit(e);
    }}>
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
              htmlFor="technical_information_file"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Technical Information File
              <span className="text-red-600">*</span>
              <div
                className='inline-block ml-1 cursor-pointer'
                data-tooltip-id='tech-file-upload-tooltip'
                data-tooltip-place='right'
              >
                <InfoIcon />
              </div>
              <Tooltip id='tech-file-upload-tooltip' opacity={1} style={{ fontSize: '10px' }}>
                <div>
                  <h2 className='text-[12px] font-medium'>Note: File uploads may disappear if the screen loses focus. Please re-upload if needed.</h2>
                </div>
              </Tooltip>
            </label>
            <div className="relative mt-2">
              <input
                id="technical_information_file"
                type="file"
                accept="*/*"
                onChange={handleTechnicalFileUpload}
                className="block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
              />
              {attachmentTechnicalExist ? (
                <div className="mt-2">
                  {existingTechnicalFileUrl && typeof existingTechnicalFileUrl === 'string' && existingTechnicalFileUrl.startsWith('http') ? (
                    <div className="flex items-center space-x-2">
                      <a 
                        href={existingTechnicalFileUrl} 
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
        </div>
        <div className="grid grid-cols-2 gap-6 mt-4 pl-6 pr-6">
          <div>
            <label
              htmlFor="submitted_by"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Submitted By
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("submitted_by", { required: true })}
                id="submitted_by"
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
              <div
                className='inline-block ml-1 cursor-pointer'
                data-tooltip-id='signature-upload-tooltip'
                data-tooltip-place='right'
              >
                <InfoIcon />
              </div>
              <Tooltip id='signature-upload-tooltip' opacity={1} style={{ fontSize: '10px' }}>
                <div>
                  <h2 className='text-[12px] font-medium'>Note: File uploads may disappear if the screen loses focus. Please re-upload if needed.</h2>
                </div>
              </Tooltip>
            </label>
            <div className="relative mt-2">
              <input
                id="signature"
                type="file"
                accept="image/*"
                onChange={handleSignatureFileUpload}
                className="block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Only show this if there's a signatureUrl (drawn, uploaded, or existing) */}
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
