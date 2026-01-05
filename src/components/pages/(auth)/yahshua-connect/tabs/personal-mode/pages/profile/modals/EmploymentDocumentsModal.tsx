import { useState, useEffect } from 'react';

import Modal from '../../../../../components/Modal';

import ViewDocumentModal from './ViewDocumentModal';

import { DocumentTextIcon, EyeIcon } from '@heroicons/react/24/outline';

import { T_EmploymentDocument } from '@/types/personal-mode';

interface EmploymentDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: T_EmploymentDocument[];
  onSave: (files: { [key: string]: File }) => void;
}

const EmploymentDocumentsModal = ({
  isOpen,
  onClose,
  documents,
  onSave,
}: EmploymentDocumentsModalProps) => {
  const [localDocuments, setLocalDocuments] = useState<T_EmploymentDocument[]>(documents);
  const [viewingDocument, setViewingDocument] = useState<{ name: string; url: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLocalDocuments(documents);
    }
  }, [documents, isOpen]);

  const handleFileUpload = (documentId: string, file: File) => {
    setLocalDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              uploaded: true,
              file: file,
              fileUrl: doc.fileUrl || URL.createObjectURL(file), // Keep existing fileUrl or create new one
            }
          : doc
      )
    );
  };

  const handleViewDocument = (document: T_EmploymentDocument) => {
    if (document.fileUrl) {
      setViewingDocument({
        name: document.name,
        url: document.fileUrl,
      });
    }
  };

  const handleSave = () => {
    const files: { [key: string]: File } = {};
    localDocuments.forEach((doc) => {
      if (doc.file) {
        // Map document IDs to backend field names
        const fieldMap: { [key: string]: string } = {
          'medical-certificate': 'medical_certificate',
          'certificate-of-employment': 'certificate_of_employment',
          'birth-certificate': 'birth_certificate',
          'diploma': 'diploma',
          'transcript-of-records': 'transcript_of_records',
          'nbi-police-clearance': 'nbi_police_clearance',
        };
        const backendFieldName = fieldMap[doc.id] || doc.id;
        files[backendFieldName] = doc.file;
      }
    });
    onSave(files);
    onClose();
  };

  const footerContent = (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-2.5 border-2 border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSave}
        className="px-6 py-2.5 bg-savoy-blue text-white rounded-lg font-medium hover:bg-savoy-blue/90 transition-colors"
      >
        Save Changes
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employment Documents"
      size="2xl"
      footerContent={footerContent}
    >
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Upload documents required for employment verification
        </p>
      </div>

      <div className="space-y-3">
        {localDocuments.map((document) => (
          <div
            key={document.id}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Document Icon */}
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>

            {/* Document Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 mb-0.5">{document.name}</h4>
              <p className="text-xs text-gray-500">Required</p>
            </div>

            {/* Upload/View Buttons */}
            <div className="flex-shrink-0 flex items-center gap-2">
              {document.uploaded && document.fileUrl && (
                <button
                  type="button"
                  onClick={() => handleViewDocument(document)}
                  className="p-2 text-gray-600 hover:text-savoy-blue hover:bg-savoy-blue/10 rounded-lg transition-colors"
                  title="View document"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              )}
              {document.uploaded ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 font-medium">Uploaded</span>
                  <label className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(document.id, file);
                        }
                      }}
                    />
                    Replace
                  </label>
                </div>
              ) : (
                <label className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(document.id, file);
                      }
                    }}
                  />
                  Upload
                </label>
              )}
            </div>
          </div>
        ))}
      </div>

      {viewingDocument && (
        <ViewDocumentModal
          isOpen={!!viewingDocument}
          onClose={() => setViewingDocument(null)}
          documentName={viewingDocument.name}
          fileUrl={viewingDocument.url}
        />
      )}
    </Modal>
  );
};

export default EmploymentDocumentsModal;

