"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { Tooltip } from 'react-tooltip';

import DrawSignatureModal from "../DrawSignatureModals";
import InfoIcon from '@/svg/InfoIcon';


function TechnicalAndSignature({
  control,
  register,
  onSubmit,
  setSelectedTab,
  setValue,
  watch,
  isCreateModal,
  isLoading,
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
  isCreateModal: boolean;
  isLoading: any;
  errors: any;
  setError: any;
  clearErrors: any;
}) {

  const [drawSignatureModal, setDrawSignatureModal] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string>("");
  const [attachmentExist, setAttachmentExist] = useState(false);
  const [technicalFileUrl, setTechnicalFileUrl] = useState<string>("");
  const [attachmentTechnicalExist, setAttachmentTechnicalExist] = useState(false);
  const [signatureSource, setSignatureSource] = useState<string>("");
  const [technicalFileSource, setTechnicalFileSource] = useState<string>("");
  const [previousSignatureFile, setPreviousSignatureFile] = useState<string>("");
  const [showTechTooltip, setShowTechTooltip] = useState(false);
  const [showSignatureTooltip, setShowSignatureTooltip] = useState(false);

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
      clearErrors('technical_information_file');
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
      clearErrors('signature');
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
        clearErrors('signature');
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

  // Show tooltips for 2 seconds when component mounts (only in create modal)
  useEffect(() => {
    if (isCreateModal) {
      setShowTechTooltip(true);
      setShowSignatureTooltip(true);
      const timer = setTimeout(() => {
        setShowTechTooltip(false);
        setShowSignatureTooltip(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCreateModal]);

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

      // Validate required fields
      clearErrors(['technical_information_file', 'submitted_by', 'position', 'signature']);
      let hasError = false;
      if (isTechFileMissing) { setError('technical_information_file', { message: 'This field is required.' }); hasError = true; }
      if (!submittedByValue) { setError('submitted_by', { message: 'This field is required.' }); hasError = true; }
      if (!positionValue) { setError('position', { message: 'This field is required.' }); hasError = true; }
      if (!signatureValue) { setError('signature', { message: 'This field is required.' }); hasError = true; }
      if (hasError) return;
      // Call the original onSubmit
      if (typeof onSubmit === 'function') onSubmit(e);
    }}>
      <div className="px-4 pt-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 px-2 md:px-6">
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
                onMouseEnter={() => setShowTechTooltip(true)}
                onMouseLeave={() => setShowTechTooltip(false)}
              >
                <InfoIcon />
              </div>
              <Tooltip 
                id='tech-file-upload-tooltip' 
                opacity={1} 
                style={{ fontSize: '10px' }}
                isOpen={showTechTooltip}
              >
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
              {errors?.technical_information_file && <p className="text-red-500 text-xs mt-1">This field is required.</p>}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 px-2 md:px-6">
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
                {...register("submitted_by")}
                id="submitted_by"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
              {errors?.submitted_by && <p className="text-red-500 text-xs mt-1">This field is required.</p>}
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
                {...register("position")}
                id="position"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
              {errors?.position && <p className="text-red-500 text-xs mt-1">This field is required.</p>}
            </div>
          </div>
        </div>
        <div className="mt-4 px-2 md:px-6">
          <h1 className="text-sm font-medium">
            Signature
                          <div
                className='inline-block ml-1 cursor-pointer'
                data-tooltip-id='signature-upload-tooltip'
                data-tooltip-place='right'
                onMouseEnter={() => setShowSignatureTooltip(true)}
                onMouseLeave={() => setShowSignatureTooltip(false)}
              >
                <InfoIcon />
              </div>
              <Tooltip 
                id='signature-upload-tooltip' 
                opacity={1} 
                style={{ fontSize: '10px' }}
                isOpen={showSignatureTooltip}
              >
                <div>
                  <h2 className='text-[12px] font-medium'>Note: Draw or Upload signature may disappear if the screen loses focus. Please re-draw or re-upload if needed.</h2>
                </div>
              </Tooltip>
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 px-2 md:px-6">
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
                type="file"
                accept="image/*"
                onChange={handleSignatureFileUpload}
                className="block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
              />
            </div>
          </div>
        </div>
      </div>
      {errors?.signature && <p className="text-red-500 text-xs mt-1 px-8">This field is required.</p>}
      
      {/* Only show this if there's a signatureUrl (drawn, uploaded, or existing) */}
      {signatureUrl && (
        <div className="mt-4 px-4 md:px-0">
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

export default TechnicalAndSignature;
