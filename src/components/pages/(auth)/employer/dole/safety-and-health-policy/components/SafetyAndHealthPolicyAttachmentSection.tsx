import React from 'react';
import { TrashIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import ClipIcon from '@/svg/ClipIcon';
import PrintIcon from '@/svg/PrintIcon';
import LoadingSpinner from '@/components/LoadingSpinner';
import classNames from '@/helpers/classNames';

interface SafetyAndHealthPolicyAttachmentSectionProps {
  pdfAttachment: string | null;
  isDeleting: boolean;
  onViewAttachment: (url: string) => void;
  onDeleteAttachment: () => void;
  onGeneratePDF?: () => void;
  isGeneratingPDF?: boolean;
  canGeneratePDF?: boolean;
}

/**
 * Custom attachment section for Safety and Health Policy modals
 * Shows existing PDF attachments with view/delete functionality
 */
export default function SafetyAndHealthPolicyAttachmentSection({
  pdfAttachment,
  isDeleting,
  onViewAttachment,
  onDeleteAttachment,
  onGeneratePDF,
  isGeneratingPDF = false,
  canGeneratePDF = true
}: SafetyAndHealthPolicyAttachmentSectionProps) {
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
    <div className="mt-10 pt-4">
      <label className='block text-sm font-medium leading-6 text-gray-900'>
        Attachment
      </label>
      <div className="mt-2 flex items-center gap-2 pl-2">
        {pdfAttachment && (
          <>
            <ClipIcon hasFile={!!pdfAttachment} />
            <span className="text-sm text-gray-600">
              {getFilenameFromUrl(pdfAttachment)}
            </span>
            <button
              type="button"
              onClick={() => onViewAttachment(pdfAttachment)}
              className="p-1 text-savoy-blue hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors ml-2"
              title="View attachment"
            >
              <ArrowTopRightOnSquareIcon className="h-5 w-5" />
            </button>
              <button
                type="button"
                onClick={onDeleteAttachment}
                disabled={isDeleting}
                className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                title="Delete attachment"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <TrashIcon className="h-4 w-4" />
                )}
              </button>
          </>
        )}
        {!pdfAttachment && (
          <>
            {onGeneratePDF && (
              <button
                type="button"
                onClick={onGeneratePDF}
                disabled={!canGeneratePDF || isGeneratingPDF}
                className={classNames(!canGeneratePDF && 'opacity-50 pointer-events-none', 'disabled:opacity-50 disabled:pointer-events-none')}
                title="Generate PDF"
              >
                {isGeneratingPDF ? (
                  <LoadingSpinner size="sm" color="yellow" />
                ) : (
                  <PrintIcon />
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}