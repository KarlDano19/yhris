"use client";

import { Fragment, useState, useEffect } from 'react';

import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

import useFileforge from '../hooks/useFileforge';
import LoadingSpinner from '@/components/LoadingSpinner';
import CustomToast from '@/components/CustomToast';

import OshProgramDocumentPreview from '../documents/OshProgramDocument';
import useGetOshProgramVersionDetails from '../hooks/useGetOshProgramVersionDetails';

import { T_OshProgram } from '@/types/osh-program';
import { printOshProgram } from '../PrintData';
import PrintIcon from "@/svg/PrintIcon";

interface VersionHistoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  versionId?: number;
  scrollToPage?: number; // Page number to scroll to (1-3 for now)
  relevantPages?: number[]; // Array of pages that contain changes
}

export default function VersionHistoryDetailsModal({
  isOpen,
  onClose,
  onBack,
  versionId,
  scrollToPage,
  relevantPages = [],
}: VersionHistoryDetailsModalProps) {

  // State for page navigation
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [currentScrollPage, setCurrentScrollPage] = useState<number | undefined>(scrollToPage);

  // Fetch version details
  const { data: versionData, isLoading } = useGetOshProgramVersionDetails(
    versionId || 0, 
    isOpen && !!versionId
  );

  // Use version data directly since it matches T_OshProgram structure
  const transformedData = versionData as unknown as T_OshProgram;

  // Reset navigation when modal opens or relevant pages change
  useEffect(() => {
    if (isOpen && relevantPages.length > 0) {
      setCurrentPageIndex(0);
      setCurrentScrollPage(relevantPages[0]);
    }
  }, [isOpen, relevantPages]);

  // Navigation functions
  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      const newIndex = currentPageIndex - 1;
      setCurrentPageIndex(newIndex);
      setCurrentScrollPage(relevantPages[newIndex]);
    }
  };

  const goToNextPage = () => {
    if (currentPageIndex < relevantPages.length - 1) {
      const newIndex = currentPageIndex + 1;
      setCurrentPageIndex(newIndex);
      setCurrentScrollPage(relevantPages[newIndex]);
    }
  };

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-5xl h-[97.5vh] flex flex-col">
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
                      {/* Page Navigation Controls */}
                      {relevantPages.length > 1 && (
                        <div className="flex items-center space-x-2 mr-4">
                          <button
                            onClick={goToPreviousPage}
                            disabled={currentPageIndex === 0}
                            className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
                            title="Previous change page"
                          >
                            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                          </button>
                          
                          <span className="text-gray-600 text-sm font-medium">
                            {currentPageIndex + 1}/{relevantPages.length}
                          </span>
                          
                          <button
                            onClick={goToNextPage}
                            disabled={currentPageIndex === relevantPages.length - 1}
                            className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
                            title="Next change page"
                          >
                            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      )}

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
                      <LoadingSpinner size="2xl" color="yellow" />
                    </div>
                  ) : transformedData ? (
                    <div className="w-full max-w-none">
                      <OshProgramDocumentPreview data={transformedData} scrollToPage={currentScrollPage} />
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
