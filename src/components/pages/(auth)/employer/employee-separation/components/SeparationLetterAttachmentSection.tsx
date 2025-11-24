import React from 'react';
import { TrashIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import ClipIcon from '@/svg/ClipIcon';

interface SeparationLetterAttachmentSectionProps {
  pdfAttachment: string | null;
  letterType: 'Acceptance' | 'Separation';
  onViewAttachment: (url: string) => void;
  canShowPreview?: boolean;
}

/**
 * Custom attachment section for Separation Letter email modals
 * Shows existing PDF attachments with view functionality
 */
export default function SeparationLetterAttachmentSection({
  pdfAttachment,
  letterType,
  onViewAttachment,
  canShowPreview = true
}: SeparationLetterAttachmentSectionProps) {
  // Get filename from attachment URL
  const getFilenameFromUrl = (url: string) => {
    if (!url) return '';
    
    // Remove AWS credentials from the URL if present
    let cleanUrl = url;
    if (url.includes('?AWSAccessKeyId=')) {
      cleanUrl = url.split('?AWSAccessKeyId=')[0];
    }
    
    const urlParts = cleanUrl.split('/');
    return urlParts[urlParts.length - 1];
  };

  return (
    <div className="mt-10 border-t pt-4">
      <label className='block text-sm font-medium leading-6 text-gray-900'>
        Attachment
      </label>
      <div className="mt-2 flex items-center gap-2 pl-2">
        <ClipIcon hasFile={!!pdfAttachment} />
        {pdfAttachment && (
          <>
            <span className="text-sm text-gray-600">
              {getFilenameFromUrl(pdfAttachment) || `Letter of ${letterType} - PDF`}
            </span>
            {canShowPreview && (
              <button
                type="button"
                onClick={() => onViewAttachment(pdfAttachment)}
                className="p-1 text-savoy-blue hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors ml-2"
                title="View attachment"
              >
                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
              </button>
            )}
            <div className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Letter of {letterType}
            </div>
          </>
        )}
        {!pdfAttachment && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">No attachment</span>
            <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              Generate letter first
            </div>
          </div>
        )}
      </div>
      
      {pdfAttachment && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg 
                className="h-5 w-5 text-blue-400" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Letter of {letterType} Ready
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  The PDF document has been generated using the separation date and employee details from the database.
                  You can preview the document using the view button above before sending.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}