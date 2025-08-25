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
import useFileforge from '../hooks/useFileforge';
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
  currentPage = 1,
  totalPages = 14
}: VersionHistoryDetailsModalProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);

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
    }
  });

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleFitToPage = () => {
    // Calculate optimal zoom level based on viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const documentWidth = 210; // mm
    const documentHeight = 297; // mm
    
    // Convert mm to pixels (approximate)
    const mmToPx = 3.779527559; // 1mm ≈ 3.78px
    const docWidthPx = documentWidth * mmToPx;
    const docHeightPx = documentHeight * mmToPx;
    
    // Calculate zoom to fit width or height (whichever is smaller)
    const widthRatio = (viewportWidth * 0.8) / docWidthPx; // 80% of viewport width
    const heightRatio = (viewportHeight * 0.6) / docHeightPx; // 60% of viewport height
    
    const optimalZoom = Math.min(widthRatio, heightRatio) * 100;
    setZoomLevel(Math.max(50, Math.min(optimalZoom, 200))); // Clamp between 50% and 200%
  };

  // Function to get page numbers 1-14
  const getPageNumbers = () => {
    return Array.from({ length: 14 }, (_, i) => i + 1);
  };

  const handlePrint = async () => {
    if (!transformedData) return;
    
    try {
      const pageNumbers = getPageNumbers();
      
      await generatePDFLocally(
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          <DocumentPageOne data={transformedData as any} isMultiPage={true} pageNumber={pageNumbers[0]} />
          <DocumentPageTwo data={transformedData as any} isMultiPage={true} pageNumber={pageNumbers[1]} />
          <DocumentPageThree data={transformedData as any} isMultiPage={true} pageNumber={pageNumbers[2]} />
          <DocumentPageFour data={transformedData as any} isMultiPage={true} pageNumber={pageNumbers[3]} />
          <DocumentPageFive data={transformedData as any} isMultiPage={true} pageNumber={pageNumbers[4]} />
          <DocumentPageSix data={transformedData as any} isMultiPage={true} pageNumber={pageNumbers[5]} />
          <DocumentPageSeven data={transformedData as any} isMultiPage={true} pageNumber={pageNumbers[6]} />
          <DocumentPageEight data={transformedData as any} isMultiPage={true} pageNumber={pageNumbers[7]} />
          <DocumentPageNine data={transformedData as any} isMultiPage={true} pageNumber={pageNumbers[8]} />
          <DocumentPageTen data={transformedData as any} isMultiPage={true} pageNumber={pageNumbers[9]} />
          <DocumentPageEleven data={transformedData as any} isMultiPage={true} pageNumber={pageNumbers[10]} />
          <DocumentPageTwelve data={transformedData as any} isMultiPage={true} pageNumber={pageNumbers[11]} />
          <DocumentPageThirteen data={transformedData as any} isMultiPage={true} pageNumber={pageNumbers[12]} />
          <DocumentPageFourteen data={transformedData as any} isMultiPage={true} pageNumber={pageNumbers[13]} />
        </div>,
        `osh-program-version-${versionData?.version_number_formatted || 'unknown'}.pdf`
      );
    } catch (error) {
      console.error('Print error:', error);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < totalPages) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 1) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };



  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        onClose={onClose}
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
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-full max-w-4xl max-h-[98vh] overflow-y-auto">
                {/* Header */}
                <div className="flex bg-savoy-blue p-4 items-center">
                  <h3 className="flex-1 text-white font-semibold text-lg">
                    Version History: {versionData?.version_number_formatted || 'Loading...'}
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer hover:text-gray-200"
                    onClick={onClose}
                  />
                </div>
                
                {/* Page indicator */}
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Page {currentPageIndex} of {transformedData ? getPageNumbers().length : totalPages}
                    </p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPageIndex === 1}
                        className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPageIndex === (transformedData ? getPageNumbers().length : totalPages)}
                        className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Document Content */}
                <div className="p-6 flex justify-center overflow-auto bg-gray-100">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-savoy-blue"></div>
                    </div>
                  ) : transformedData ? (
                    <div 
                      className="bg-white shadow-lg relative flex-shrink-0"
                      style={{ 
                        width: '210mm', 
                        height: '297mm', 
                        transform: `scale(${Math.min(zoomLevel / 100, window.innerWidth < 768 ? 0.5 : 0.8)})`, 
                        transformOrigin: 'top center',
                        margin: '0 auto'
                      }}
                    >
                      {(() => {
                        const pageNumbers = getPageNumbers();
                        const currentPageNumber = pageNumbers[currentPageIndex - 1] || currentPageIndex;
                        
                        if (currentPageIndex === 1) {
                          return <DocumentPageOne data={transformedData as any} pageNumber={currentPageNumber} />;
                        } else if (currentPageIndex === 2) {
                          return <DocumentPageTwo data={transformedData as any} pageNumber={currentPageNumber} />;
                        } else if (currentPageIndex === 3) {
                          return <DocumentPageThree data={transformedData as any} pageNumber={currentPageNumber} />;
                        } else if (currentPageIndex === 4) {
                          return <DocumentPageFour data={transformedData as any} pageNumber={currentPageNumber} />;
                        } else if (currentPageIndex === 5) {
                          return <DocumentPageFive data={transformedData as any} pageNumber={currentPageNumber} />;
                        } else if (currentPageIndex === 6) {
                          return <DocumentPageSix data={transformedData as any} pageNumber={currentPageNumber} />;
                        } else if (currentPageIndex === 7) {
                          return <DocumentPageSeven data={transformedData as any} pageNumber={currentPageNumber} />;
                        } else if (currentPageIndex === 8) {
                          return <DocumentPageEight data={transformedData as any} pageNumber={currentPageNumber} />;
                        } else if (currentPageIndex === 9) {
                          return <DocumentPageNine data={transformedData as any} pageNumber={currentPageNumber} />;
                        } else if (currentPageIndex === 10) {
                          return <DocumentPageTen data={transformedData as any} pageNumber={currentPageNumber} />;
                        } else if (currentPageIndex === 11) {
                          return <DocumentPageEleven data={transformedData as any} pageNumber={currentPageNumber} />;
                        } else if (currentPageIndex === 12) {
                          return <DocumentPageTwelve data={transformedData as any} pageNumber={currentPageNumber} />;
                        } else if (currentPageIndex === 13) {
                          return <DocumentPageThirteen data={transformedData as any} pageNumber={currentPageNumber} />;
                        } else {
                          return <DocumentPageFourteen data={transformedData as any} pageNumber={currentPageNumber} />;
                        }
                      })()}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <p className="text-gray-500">Version data not found</p>
                    </div>
                  )}
                </div>

                {/* Document Controls */}
                <div className="bg-gray-50 px-4 py-3 border-t">
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={handleZoomIn}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                      title="Zoom In"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleZoomOut}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                      title="Zoom Out"
                    >
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleFitToPage}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                      title="Fit to Page"
                    >
                      <ArrowsPointingOutIcon className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handlePrint}
                      disabled={isGenerating}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      title={isGenerating ? "Generating PDF..." : "Print"}
                    >
                      {isGenerating ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                      ) : (
                        <ArrowDownTrayIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
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
                      onClick={onClose}
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
