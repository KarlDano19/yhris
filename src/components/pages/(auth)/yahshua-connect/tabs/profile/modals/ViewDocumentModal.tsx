import Modal from '../../../components/Modal';

import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface ViewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  fileUrl: string;
}

const ViewDocumentModal = ({
  isOpen,
  onClose,
  documentName,
  fileUrl,
}: ViewDocumentModalProps) => {
  const isImage = fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPdf = fileUrl.match(/\.pdf$/i);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={documentName}
      size="4xl"
      showCloseButton={true}
    >
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
        {isImage ? (
          <img
            src={fileUrl}
            alt={documentName}
            className="max-w-full max-h-[70vh] object-contain"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.png';
            }}
          />
        ) : isPdf ? (
          <iframe
            src={fileUrl}
            className="w-full h-[70vh] border-0 rounded-lg"
            title={documentName}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <DocumentTextIcon className="h-16 w-16 mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Document Preview</p>
            <p className="text-sm mb-4">This file type cannot be previewed</p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-savoy-blue text-white rounded-lg hover:bg-savoy-blue/90 transition-colors"
            >
              Download File
            </a>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ViewDocumentModal;

