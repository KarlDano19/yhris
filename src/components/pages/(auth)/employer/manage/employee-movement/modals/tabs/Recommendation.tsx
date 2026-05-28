"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import DrawSignatureModal from "../DrawSignatureModal";

import { XCircleIcon } from "@heroicons/react/24/solid";

function Recommendation({
  register,
  onSubmit,
  setSelectedTab,
  setValue,
  isLoading,
  hasHrRecommendation = false,
  approvals = [],
  currentUserApproval = null,
  watch,
  errors,
  setError,
  clearErrors,
}: {
  register: any;
  onSubmit: any;
  setSelectedTab: any;
  setValue: any;
  isLoading: boolean;
  hasHrRecommendation?: boolean;
  approvals?: any[];
  currentUserApproval?: any;
  watch?: any;
  errors?: any;
  setError?: any;
  clearErrors?: any;
}) {
  const [drawSignatureModal, setDrawSignatureModal] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string>("");
  const [attachmentExist, setAttachmentExist] = useState(false);
  const [previousSignatureFile, setPreviousSignatureFile] = useState<string>("");
  const [signatureSource, setSignatureSource] = useState<string>("");

  // Watch for existing signature if watch function is provided
  const existingSignatureUrl = watch ? watch("signature") : null;
  const recommendationValue = watch ? watch("recommendation") : null;

  const toggleDrawSignatureModal = () => {
    setDrawSignatureModal(!drawSignatureModal);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("signature", file);
      setValue("previous_signature", previousSignatureFile);
      setValue("signature_source", "upload");
      setSignatureSource("upload");
      setSignatureUrl(URL.createObjectURL(file));
      setAttachmentExist(true);
      
      // Clear any signature errors when a file is uploaded
      if (clearErrors) {
        clearErrors("signature");
      }
    }
  };

  // Handle drawn signature from modal
  const handleDrawnSignature = (drawnSignatureDataUrl: string) => {
    try {
      fetch(drawnSignatureDataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "signature.png", { type: "image/png" });
          setValue("signature", file);
          setValue("previous_signature", previousSignatureFile);
          setValue("signature_source", "draw");
          setSignatureSource("draw");
          setSignatureUrl(drawnSignatureDataUrl);
          
          // Clear any signature errors when a signature is drawn
          if (clearErrors) {
            clearErrors("signature");
          }
        })
        .catch(err => {
          console.error("Error converting signature data URL to file:", err);
          // Fallback to using the data URL directly
          setValue("signature", drawnSignatureDataUrl);
          setSignatureUrl(drawnSignatureDataUrl);
          
          // Clear any signature errors
          if (clearErrors) {
            clearErrors("signature");
          }
        });
    } catch (error) {
      console.error("Error in handleDrawnSignature:", error);
      // Fallback to using the data URL directly
      setValue("signature", drawnSignatureDataUrl);
      setSignatureUrl(drawnSignatureDataUrl);
      
      // Clear any signature errors
      if (clearErrors) {
        clearErrors("signature");
      }
    }
  };

  useEffect(() => {
    if (signatureUrl) {
      try {
        if (signatureUrl.startsWith('data:')) {
          fetch(signatureUrl)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], "signature.png", { type: "image/png" });
              setValue("signature", file);
              setValue("previous_signature", previousSignatureFile);
              setValue("signature_source", "draw");
              setSignatureSource("draw");
              
              // Clear any signature errors
              if (clearErrors) {
                clearErrors("signature");
              }
            })
            .catch(err => {
              console.error("Error converting signature data URL to file:", err);
              // Fallback to using the URL directly
              setValue("signature", signatureUrl);
              
              // Clear any signature errors
              if (clearErrors) {
                clearErrors("signature");
              }
            });
        } else if (signatureUrl.startsWith('blob:')) {
          setSignatureSource("upload");
          
          // Clear any signature errors
          if (clearErrors) {
            clearErrors("signature");
          }
        } else {
          setValue("signature", signatureUrl);
          setValue("previous_signature", signatureUrl);
          setValue("signature_source", "");
          setSignatureSource("");
          
          // Clear any signature errors
          if (clearErrors) {
            clearErrors("signature");
          }
        }
      } catch (error) {
        console.error("Error processing signature URL:", error);
        // Fallback to using the URL directly
        setValue("signature", signatureUrl);
        
        // Clear any signature errors
        if (clearErrors) {
          clearErrors("signature");
        }
      }
    }
    
    if (!drawSignatureModal && signatureUrl && signatureSource === "draw") {
      // Don't clear signature URL when modal closes if we have a valid signature
    }
  }, [signatureUrl, setValue, drawSignatureModal, previousSignatureFile, signatureSource, clearErrors]);

  // Check if there are existing signature URLs (for edit mode)
  useEffect(() => {
    if (existingSignatureUrl && typeof existingSignatureUrl === 'string' && existingSignatureUrl.startsWith('http')) {
      setSignatureUrl(existingSignatureUrl);
      setSignatureSource("");
      setValue("signature", existingSignatureUrl);
      setValue("previous_signature", existingSignatureUrl);
      
      // Clear any signature errors
      if (clearErrors) {
        clearErrors("signature");
      }
    }
  }, [existingSignatureUrl, setValue, clearErrors]);

  // Clear errors when recommendation is changed
  useEffect(() => {
    if (recommendationValue && recommendationValue !== "" && clearErrors) {
      clearErrors("recommendation");
    }
  }, [recommendationValue, clearErrors]);

  // Clear errors when signature is changed
  useEffect(() => {
    if (existingSignatureUrl && existingSignatureUrl !== "" && clearErrors) {
      clearErrors("signature");
    }
  }, [existingSignatureUrl, clearErrors]);

  // Custom submit handler to ensure signature data is properly processed
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields at once
    let hasErrors = false;
    
    // Validate recommendation
    if (!recommendationValue || recommendationValue === "") {
      if (setError) {
        setError("recommendation", {
          type: "manual",
          message: "Recommendation is required."
        });
      }
      hasErrors = true;
    }
    
    // Validate signature
    const signatureValue = watch ? watch("signature") : null;
    if (!signatureValue || signatureValue === "") {
      if (setError) {
        setError("signature", {
          type: "manual",
          message: "Signature is required (draw or upload)."
        });
      }
      hasErrors = true;
    }
    
    // If there are errors, stop submission
    if (hasErrors) {
      return;
    }
    
    // Make sure signature data is in the correct format before submission
    if (signatureValue && typeof signatureValue === 'object' && !(signatureValue instanceof File)) {
      try {
        if (signatureUrl) {
          setValue("signature", signatureUrl);
        }
      } catch (error) {
        console.error("Error processing signature before submission:", error);
      }
    }
    
    // Call the original onSubmit
    onSubmit(e);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="px-4 pt-4 pb-6">
        {/* Previous Approvals */}
        {approvals.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Previous Approvals</h3>
            <div className="space-y-4">
              {approvals.map((approval, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{approval.approver_name}</p>
                      <p className="text-sm text-gray-600">{approval.approval_stage_name}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      approval.status === 'approved' ? 'bg-green-100 text-green-800' :
                      approval.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      approval.status === 'not_started' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {approval.status === 'not_started' ? 'Pending' : approval.status}
                    </span>
                  </div>
                  {approval.recommendation && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Recommendation:</p>
                      <p className="text-sm text-gray-600">{approval.recommendation}</p>
                    </div>
                  )}
                  {approval.signature && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Signature:</p>
                      <img src={approval.signature} alt="Signature" className="h-12 mt-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Current Approval Form */}
        {currentUserApproval && (
          <div className="grid grid-cols-1 gap-6 mt-4 pb-6">
            <div>
              <label
                htmlFor="recommendation"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Your Recommendation
                <span className="text-red-600">*</span>
              </label>
              {errors && errors.recommendation && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.recommendation.message || "Recommendation is required."}
                  </p>
                )}
              <div className="relative mt-2">
                <textarea
                  {...register("recommendation", { required: true })}
                  id="recommendation"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                  rows={4}
                />
                
              </div>
            </div>
          </div>
        )}

        {/* Signature Section */}
        {currentUserApproval && (
          <>
            <div className="mt-4">
              <h1 className="text-lg font-semibold">Your Signature</h1>
              {errors && errors.signature && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.signature.message || "Signature is required (draw or upload)."}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
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
                    className="block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
                  />
                  {attachmentExist ? (
                    <button
                      type="button"
                      className="underline text-savoy-blue text-sm"
                      onClick={() => {
                        setValue("signature", "");
                        setAttachmentExist(false);
                        setSignatureUrl("");
                        setSignatureSource("");
                      }}
                    >
                      Remove Attachment
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Signature Preview */}
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
            {typeof Image !== 'undefined' ? (
              <Image
                className="border-0 ring-1 ring-inset ring-gray-300 m-auto mb-6"
                src={signatureUrl}
                width={500}
                height={200}
                alt="signatureImage"
              />
            ) : (
              <img
                className="border-0 ring-1 ring-inset ring-gray-300 m-auto mb-6 h-32"
                src={signatureUrl}
                alt="signatureImage"
              />
            )}
          </div>
        )}
      </div>
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
          onClick={() => setSelectedTab(1)}
        >
          Back
        </button>
        {currentUserApproval && (
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setValue('status', 'rejected');
                // Ensure signature is properly formatted before submission
                handleFormSubmit({
                  preventDefault: () => {}
                } as React.FormEvent);
              }}
              className="w-auto rounded-md bg-red-600 px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              {isLoading ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-6 h-6 mr-2 text-gray-200 animate-spin fill-red-600"
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
              ) : (
                "Reject"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setValue('status', 'approved');
                // Ensure signature is properly formatted before submission
                handleFormSubmit({
                  preventDefault: () => {}
                } as React.FormEvent);
              }}
              className="w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLoading ? (
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
              ) : (
                "Approve"
              )}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}

export default Recommendation;