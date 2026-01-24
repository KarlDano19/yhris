import { XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

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
  if (!isOpen) return null;

  const isImage = fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPdf = fileUrl.match(/\.pdf$/i);

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">{documentName}</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDocumentModal;
