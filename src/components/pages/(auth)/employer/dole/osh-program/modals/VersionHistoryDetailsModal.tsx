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
        onClose={onBack}
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
              <Dialog.Panel className="relative transform overflow-visible rounded-b-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-full max-w-4xl max-h-[98vh] overflow-y-auto">
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
                <div className="bg-gray-50 px-4 py-4 border-b">
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
                <div className="p-6 overflow-auto bg-gray-100 max-h-[70vh]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
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
