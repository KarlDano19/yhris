"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import DrawSignatureModal from "../DrawSignatureModals";

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

  // Watch for existing file URLs from form
  const existingTechnicalFileUrl = watch("technical_information_file");
  const existingSignatureUrl = watch("signature");

  const toggleDrawSignatureModal = () => {
    setDrawSignatureModal(!drawSignatureModal);
  };

  useEffect(() => {
    if (signatureUrl) {
      setValue("signature", signatureUrl);
    }
  }, [signatureUrl, setValue]);

  useEffect(() => {
    if (technicalFileUrl) {
      setValue("technical_information_file", technicalFileUrl);
    } else {
      setTechnicalFileUrl("");
    }
  }, [technicalFileUrl, setValue]);

  // Check if there are existing file URLs (for edit mode)
  useEffect(() => {
    if (existingTechnicalFileUrl && typeof existingTechnicalFileUrl === 'string' && existingTechnicalFileUrl.startsWith('http')) {
      setAttachmentTechnicalExist(true);
    }
  }, [existingTechnicalFileUrl]);

  useEffect(() => {
    if (existingSignatureUrl && typeof existingSignatureUrl === 'string' && existingSignatureUrl.startsWith('http')) {
      setAttachmentExist(true);
      setSignatureUrl(existingSignatureUrl);
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
        return;
      }
      if (!positionValue) {
        import('react-hot-toast').then(({ default: toast }) => {
          import('@/components/CustomToast').then(({ default: CustomToast }) => {
            toast.custom(() => <CustomToast message="Position is required." type="error" />, { duration: 5000 });
          });
        });
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
            </label>
            <div className="relative mt-2">
              <input
                id="technical_information_file"
                {...register("technical_information_file")}
                onChange={(e) => {
                  e.target.value ? setTechnicalFileUrl("") : null;
                  e.target.value ? setAttachmentTechnicalExist(true) : null;
                }}
                type="file"
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
                      <button
                        type="button"
                        className="underline text-red-600 text-sm"
                        onClick={() => {
                          setValue("technical_information_file", "");
                          setAttachmentTechnicalExist(false);
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
                        setValue("technical_information_file", "");
                        setAttachmentTechnicalExist(false);
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
                className="block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
              />
              {attachmentExist ? (
                <div className="mt-2">
                  {existingSignatureUrl && typeof existingSignatureUrl === 'string' && existingSignatureUrl.startsWith('http') ? (
                    <div className="flex items-center space-x-2">
                      <a 
                        href={existingSignatureUrl} 
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
