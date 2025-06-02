"use client";

import { useEffect, useState } from "react";

import DrawSignatureModal from "../DrawSignatureModal";

import { XCircleIcon } from "@heroicons/react/24/solid";

function ReccomendationPrint({
  register,
  onSubmit,
  setValue,
  isLoading,
  approvals = [],
  currentUserApproval = null,
}: {
  register: any;
  onSubmit: any;
  setValue: any;
  isLoading: boolean;
  approvals?: any[];
  currentUserApproval?: any;
}) {
  const [drawSignatureModal, setDrawSignatureModal] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string>("");
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

        {/* Previous Approvals */}
        {approvals.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Approvals</h3>
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
              <div className="relative mt-2">
                <textarea
                  {...register("recommendation")}
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
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
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
          </>
        )}
      </div>
      {drawSignatureModal && (
        <DrawSignatureModal
          isOpen={drawSignatureModal}
          setIsOpen={setDrawSignatureModal}
          setSignatureUrl={setSignatureUrl}
        />
      )}
    </form>
  );
}

export default ReccomendationPrint;