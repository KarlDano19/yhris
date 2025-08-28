"use client";

import { Fragment } from 'react';

import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon } from "@heroicons/react/24/solid";

import useFileforge from '../hooks/useFileforge';
import CustomToast from '@/components/CustomToast';

import OshProgramDocumentPreview from '../print/OshProgramDocument';
import useGetOshProgramVersionDetails from '../hooks/useGetOshProgramVersionDetails';

import { T_OshProgram } from '@/types/osh-program';
import { printOshProgram } from '../PrintData';
import PrintIcon from "@/svg/PrintIcon";

interface VersionHistoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  versionId?: number;
}

export default function VersionHistoryDetailsModal({
  isOpen,
  onClose,
  onBack,
  versionId,
}: VersionHistoryDetailsModalProps) {

  // Fetch version details
  const { data: versionData, isLoading } = useGetOshProgramVersionDetails(
    versionId || 0, 
    isOpen && !!versionId
  );

  // Use version data directly since it matches T_OshProgram structure
  const transformedData = versionData as unknown as T_OshProgram;

  const { generatePDFLocally, isGenerating } = useFileforge({
    onSuccess: () => {
      toast.custom(() => <CustomToast message='PDF generated successfully.' type='success' />, { duration: 3000 });
    },
    onError: (error) => {
      toast.custom(() => <CustomToast message={`Failed to generate PDF: ${error.message}`} type='error' />, { duration: 5000 });
    },
  });

   const handlePrint = async () => {
    if (!transformedData) return;
    
    try {
      await printOshProgram({
        data: transformedData,
        filename: `osh-program-version-${versionData?.version_number_formatted || 'unknown'}.pdf`,
        generatePDFLocally
      });
    } catch (error) {
      console.error('Print error:', error);
    }
  };



  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-visible rounded-b-lg bg-white text-left shadow-xl transition-all w-full max-w-5xl h-[97.5vh] flex flex-col">
                {/* Header */}
                <div className="flex bg-savoy-blue p-4 items-center">
                  <h3 className="flex-1 text-white font-semibold text-lg">
                    Version History: {versionData?.version_number_formatted || 'Loading...'}
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer hover:text-gray-200"
                    onClick={onBack}
                  />
                </div>
                
                {/* Document Info */}
                <div className="bg-gray-50 px-4 py-2   border-b">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      OSH Program Document - Complete Preview
                    </p>
                    <div className="flex items-center space-x-2">
                      {/* Download Button */}
                      <button
                        onClick={handlePrint}
                        disabled={isGenerating}
                        className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isGenerating ? "Generating PDF..." : "Download PDF"}
                      >
                        {isGenerating ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        ) : (
                          <PrintIcon/>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Document Content */}
                <div className="overflow-auto bg-gray-100 flex-1">
                  {isLoading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                      <div role="status" className="text-center">
                        <svg
                          aria-hidden="true"
                          className="inline w-20 h-20 text-gray-200 animate-spin fill-yellow-400"
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
                    </div>
                  ) : transformedData ? (
                    <div className="w-full max-w-none">
                      <OshProgramDocumentPreview data={transformedData} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <p className="text-gray-500">Version data not found</p>
                    </div>
                  )}
                </div>



                {/* Footer */}
                <div className="bg-gray-50 px-4 py-3 border-t">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={onBack}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={onBack}
                      className="px-4 py-2 text-sm font-medium text-white bg-savoy-blue border border-transparent rounded-md hover:bg-savoy-blue-dark"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
              </Dialog>
      </Transition.Root>

    </>
  );
}
