"use client";

import { Fragment, useState, useEffect, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import { XCircleIcon } from "@heroicons/react/24/solid";

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl?: string;
  imageUrl?: string; // Added for backward compatibility
  fileName?: string;
  title?: string;
}

export default function FilePreviewModal({
  isOpen,
  onClose,
  fileUrl = '',
  imageUrl = '', // Added for backward compatibility
  fileName = '',
  title = 'File Preview'
}: FilePreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [normalizedUrl, setNormalizedUrl] = useState('');
  const [fileType, setFileType] = useState<'image' | 'pdf' | 'other'>('other');
  const cancelButtonRef = useRef(null);
  
  // Use imageUrl if fileUrl is not provided (for backward compatibility)
  const effectiveUrl = fileUrl || imageUrl;
  
  // Normalize the URL to prevent duplicate URLs
  useEffect(() => {
    if (effectiveUrl) {
      // Add a cache-busting timestamp to prevent browser caching
      const timestamp = new Date().getTime();
      
      // Remove any existing query parameters before adding timestamp
      const baseUrl = effectiveUrl.includes('?') 
        ? effectiveUrl.split('?')[0] 
        : effectiveUrl;
      
      setNormalizedUrl(`${baseUrl}?t=${timestamp}`);
      
      // If imageUrl is provided, assume it's an image
      if (imageUrl && !fileUrl) {
        setFileType('image');                                                                                                                                                                                                                                                                                                                                 
        return;
      }
      
      // Determine file type based on extension or URL
      const url = effectiveUrl.toLowerCase();
      
      // Remove query parameters for extension checking
      const urlWithoutParams = url.split('?')[0];
      
      // Check if the URL contains file extension indicators
      if (/\.(jpeg|jpg|png|gif|webp|bmp|svg)$/i.test(urlWithoutParams)) {
        setFileType('image');
      } else if (/\.(pdf)$/i.test(urlWithoutParams) || url.includes('.pdf') || url.includes('/pdf/') || 
                 url.includes('application/pdf') || url.includes('content-type=pdf')) {
        setFileType('pdf');
      } else {
        // Check content of URL for indications of file type
        if (url.includes('image') || url.includes('photo') || url.includes('picture')) {
          setFileType('image');
        } else if (url.includes('pdf') || url.includes('document')) {
          setFileType('pdf');
        } else {
          setFileType('other');
        }
      }
    }
  }, [effectiveUrl, fileUrl, imageUrl]);
  
  // Reset loading state when modal opens or file URL changes
  useEffect(() => {
    if (isOpen && normalizedUrl) {
      setIsLoading(true);
      setHasError(false);
      
      // Try to detect file type from content-type header
      const checkContentType = async () => {
        try {
          const response = await fetch(normalizedUrl, { method: 'HEAD' });
          const contentType = response.headers.get('content-type');
          
          if (contentType) {
            if (contentType.includes('image/')) {
              setFileType('image');
            } else if (contentType.includes('application/pdf') || contentType.includes('pdf')) {
              setFileType('pdf');
            }
          }
        } catch (error) {
          console.error('Error checking content type:', error);
        }
      };
      
      // Try to check content type first
      checkContentType();
      
      if (fileType === 'image') {
        // Preload the image
        const img = new Image();
        img.onload = () => setIsLoading(false);
        img.onerror = () => {
          setIsLoading(false);
          setHasError(true);
        };
        img.src = normalizedUrl;
      } else {
        // For non-image files, we can't preload, so just set loading to false
        setIsLoading(false);
      }
    }
  }, [isOpen, normalizedUrl, fileType]);

  // Render content based on file type
  const renderFileContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-savoy-blue"></div>
          <p className="mt-2 text-sm text-gray-500">Loading {fileType === 'image' ? 'image' : 'file'}...</p>
        </div>
      );
    }
    
    if (hasError) {
      return (
        <div className="flex flex-col items-center text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="mt-2">Failed to load {fileType === 'image' ? 'image' : 'file'}</p>
        </div>
      );
    }
    
    if (fileType === 'image') {
      return (
        <img 
          src={normalizedUrl} 
          alt={fileName || title} 
          className="max-h-[70vh] object-contain"
          key={normalizedUrl}
        />
      );
    } else if (fileType === 'pdf') {
      return (
        <div className="w-full h-[70vh] flex flex-col">
          <iframe 
            src={`${normalizedUrl}#toolbar=1&view=FitH`} 
            className="w-full h-full border-0"
            title={fileName || "PDF Preview"}
            allowFullScreen
          />
          <div className="mt-2 text-center">
            <a 
              href={normalizedUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-savoy-blue hover:underline"
            >
              Open PDF in new tab
            </a>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="bg-gray-100 p-8 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="mt-4 text-gray-600">This file type cannot be previewed.</p>
          <div className="mt-2 flex flex-col gap-2 items-center">
            <a 
              href={normalizedUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-savoy-blue hover:underline"
            >
              Download or open file
            </a>
            
            <button
              onClick={() => setFileType('pdf')}
              className="text-savoy-blue hover:underline text-sm"
            >
              Try to view as PDF
            </button>
            
            <div className="text-xs text-gray-500 mt-2 max-w-md text-center">
              <p>File URL: {normalizedUrl.substring(0, 50)}{normalizedUrl.length > 50 ? '...' : ''}</p>
              <p>Detected type: {fileType}</p>
            </div>
          </div>
        </div>
      );
    }
  };

  // Determine title based on file type
  const displayTitle = title || (fileType === 'image' ? 'Image Preview' : 'File Preview');

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        initialFocus={cancelButtonRef}
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
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    {displayTitle} {fileName ? `- ${fileName}` : ''}
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={onClose}
                  />
                </div>
                
                <div className="p-4 flex justify-center min-h-[400px] items-center">
                  {!normalizedUrl && (
                    <div className="text-gray-500">No {fileType === 'image' ? 'image' : 'file'} available</div>
                  )}
                  
                  {normalizedUrl && renderFileContent()}
                </div>
                
                <hr />
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                    ref={cancelButtonRef}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 