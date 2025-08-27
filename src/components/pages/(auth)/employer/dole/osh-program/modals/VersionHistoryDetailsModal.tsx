"use client";

import { Fragment, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { 
  XCircleIcon, 
  ArrowDownTrayIcon,
  PlusIcon,
  MinusIcon,
  ArrowsPointingOutIcon
} from "@heroicons/react/24/solid";
import useFileforge from '../hooks/useFileforge';
import { printOshProgram } from '../PrintData';

// Import individual page components for preview
import DocumentPageOne from '../print/DocumentPageOne';
import DocumentPageTwo from '../print/DocumentPageTwo';
import DocumentPageThree from '../print/DocumentPageThree';
import DocumentPageFour from '../print/DocumentPageFour';
import DocumentPageFive from '../print/DocumentPageFive';
import DocumentPageSix from '../print/DocumentPageSix';
import DocumentPageSeven from '../print/DocumentPageSeven';
import DocumentPageEight from '../print/DocumentPageEight';
import DocumentPageNine from '../print/DocumentPageNine';
import DocumentPageTen from '../print/DocumentPageTen';
import DocumentPageEleven from '../print/DocumentPageEleven';
import DocumentPageTwelve from '../print/DocumentPageTwelve';
import DocumentPageThirteen from '../print/DocumentPageThirteen';
import DocumentPageFourteen from '../print/DocumentPageFourteen';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import useGetOshProgramVersionDetails from '../hooks/useGetOshProgramVersionDetails';
import { T_OshProgram } from '@/types/osh-program';

interface VersionHistoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  versionId?: number;
  currentPage?: number;
  totalPages?: number;
}

export default function VersionHistoryDetailsModal({
  isOpen,
  onClose,
  onBack,
  versionId,
}: VersionHistoryDetailsModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 14;

  // Fetch version details
  const { data: versionData, isLoading } = useGetOshProgramVersionDetails(
    versionId || 0, 
    isOpen && !!versionId
  );

  // Use version data directly since it matches T_OshProgram structure
  const transformedData = versionData as unknown as T_OshProgram;

  const { generatePDFLocally, isGenerating } = useFileforge({
    pageMargins: {
      top: '0.2in',
      right: '0.2in',
      bottom: '0.2in',
      left: '0.2in'
    },
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

  // Navigation functions
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to render individual page content
  const renderPageContent = () => {
    if (!transformedData) return null;
    
    let pageContent;
    switch (currentPage) {
      case 1:
        pageContent = <DocumentPageOne data={transformedData} />;
        break;
      case 2:
        pageContent = <DocumentPageTwo data={transformedData} />;
        break;
      case 3:
        pageContent = <DocumentPageThree data={transformedData} />;
        break;
      case 4:
        pageContent = <DocumentPageFour data={transformedData} />;
        break;
      case 5:
        pageContent = <DocumentPageFive data={transformedData} />;
        break;
      case 6:
        pageContent = <DocumentPageSix data={transformedData} />;
        break;
      case 7:
        pageContent = <DocumentPageSeven data={transformedData} />;
        break;
      case 8:
        pageContent = <DocumentPageEight data={transformedData} />;
        break;
      case 9:
        pageContent = <DocumentPageNine data={transformedData} />;
        break;
      case 10:
        pageContent = <DocumentPageTen data={transformedData} />;
        break;
      case 11:
        pageContent = <DocumentPageEleven data={transformedData} />;
        break;
      case 12:
        pageContent = <DocumentPageTwelve data={transformedData} />;
        break;
      case 13:
        pageContent = <DocumentPageThirteen data={transformedData} />;
        break;
      case 14:
        pageContent = <DocumentPageFourteen data={transformedData} />;
        break;
      default:
        pageContent = <DocumentPageOne data={transformedData} />;
    }
    
    return (
      <div className="bg-white shadow-lg relative flex-shrink-0">
        <div 
          className="a4-page"
          style={{
            width: '210mm',
            minHeight: '297mm',
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif',
            boxSizing: 'border-box',
            padding: '32px 35px 32px 50px',
            backgroundColor: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        >
          {pageContent}
        </div>
      </div>
    );
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
                      OSH Program Document - Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center space-x-2">
                      {/* Page Navigation */}
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Previous Page"
                      >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Next Page"
                      >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <div className="w-px h-7 bg-gray-300"></div>

                      {/* Download Button */}
                      <button
                        onClick={handlePrint}
                        disabled={isGenerating}
                        className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isGenerating ? "Generating PDF..." : "Download PDF"}
                      >
                        {isGenerating ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        ) : (
                          <ArrowDownTrayIcon className="w-7 h-7" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Document Content */}
                <div className="p-6 flex justify-center overflow-auto bg-gray-100">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                    </div>
                  ) : transformedData ? (
                    <div className="bg-white shadow-lg relative flex-shrink-0">
                      {renderPageContent()}
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
