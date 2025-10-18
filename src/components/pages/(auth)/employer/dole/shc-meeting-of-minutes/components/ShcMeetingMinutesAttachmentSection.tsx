import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import ClipIcon from '@/svg/ClipIcon';

interface ShcMeetingMinutesAttachmentSectionProps {
  pdfAttachment: string | null;
  onViewAttachment: (url: string) => void;
  onAttachmentUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: () => void;
  attachment: File | null;
  attachmentExist: boolean;
}

export default function ShcMeetingMinutesAttachmentSection({
  pdfAttachment,
  onViewAttachment,
  onAttachmentUpload,
  onRemoveAttachment,
  attachment,
  attachmentExist
}: ShcMeetingMinutesAttachmentSectionProps) {
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
    <div className="mt-2">
      {/* Display existing attachment from backend */}
      {pdfAttachment && (
        <div className="mb-3 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center gap-2">
            <ClipIcon hasFile={true} />
            <span className="text-sm text-gray-600">
              {getFilenameFromUrl(pdfAttachment)}
            </span>
            <ArrowTopRightOnSquareIcon 
              className="h-5 w-5 text-savoy-blue cursor-pointer ml-2"
              onClick={() => onViewAttachment(pdfAttachment)}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Current attachment (will be included in email)</p>
        </div>
      )}
      
      {/* Show message when no attachments available */}
      {!pdfAttachment && !attachment && (
        <div className="text-sm text-gray-500">
          No attachment available
        </div>
      )}
      
      {/* File upload for new attachment */}
      <input
        id='attachment'
        type='file'
        onChange={onAttachmentUpload}
        className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100'
      />
      {attachmentExist ? (
        <button
          type='button'
          className='underline text-savoy-blue text-sm mt-1'
          onClick={onRemoveAttachment}
        >
          Remove New Attachment
        </button>
      ) : null}
      <p className='text-xs mt-1 text-gray-400'>Maximum file size: 10mb. <span className='text-red-600'>Upload a new file to replace the current attachment.</span></p>
    </div>
  );
}
