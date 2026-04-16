import { useState, useEffect } from 'react';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';

import { DocumentTextIcon } from '@heroicons/react/24/outline';

import { T_EmploymentDocument } from '@/types/personal-mode';

function DocumentsTab({
  setValue,
  watch,
  setCurrentTab,
}: {
  setValue: any;
  watch: any;
  setCurrentTab: any;
}) {
  const employmentDocuments = watch('employmentDocuments') || [];

  const [localDocuments, setLocalDocuments] = useState<T_EmploymentDocument[]>([
    {
      id: 'medical-certificate',
      name: 'Medical Certificate',
      required: true,
      uploaded: false,
    },
    {
      id: 'certificate-of-employment',
      name: 'Certificate of Employment',
      required: true,
      uploaded: false,
    },
    {
      id: 'birth-certificate',
      name: 'Birth Certificate',
      required: true,
      uploaded: false,
    },
    {
      id: 'diploma',
      name: 'Diploma',
      required: true,
      uploaded: false,
    },
    {
      id: 'transcript-of-records',
      name: 'Transcript of Records',
      required: true,
      uploaded: false,
    },
    {
      id: 'nbi-police-clearance',
      name: 'NBI/Police Clearance',
      required: true,
      uploaded: false,
    },
  ]);

  useEffect(() => {
    if (employmentDocuments && employmentDocuments.length > 0) {
      setLocalDocuments(employmentDocuments);
    }
  }, [employmentDocuments]);

  const handleFileUpload = (documentId: string, file: File) => {
    // Check file size (10MB limit)
    const maxFileSize = 10 * 1024 * 1024; // 10 MB in bytes
    if (file.size > maxFileSize) {
      toast.custom(() => <CustomToast message={`${file.name} exceeds 10MB limit.`} type='error' />, { duration: 2000 });
      return;
    }

    const updatedDocuments = localDocuments.map((doc) =>
      doc.id === documentId
        ? {
            ...doc,
            uploaded: true,
            file: file,
            fileUrl: doc.fileUrl || URL.createObjectURL(file),
          }
        : doc
    );

    setLocalDocuments(updatedDocuments);
    setValue('employmentDocuments', updatedDocuments);
  };

  const handleNext = () => {
    setCurrentTab(5);
  };

  const handleBack = () => {
    setCurrentTab(3);
  };

  return (
    <div className='mt-10'>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-indigo-dye mb-2">Employment Documents</h3>
        <p className="text-sm text-gray-600">
          Upload documents required for employment verification
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Maximum file size: 10 MB per file. Accepted formats: PDF, PNG, JPG, JPEG
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
              <h4 className="font-semibold text-gray-900">
                {document.name}
              </h4>
            </div>

            {/* Upload/Replace Buttons */}
            <div className="flex-shrink-0 flex items-center gap-2">
              {document.uploaded ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 font-medium">✓ Uploaded</span>
                  <label className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer text-sm">
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
                <label className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer text-sm">
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

      <div className='flex justify-between py-10'>
        <button
          type='button'
          onClick={handleBack}
          className='w-auto rounded-md bg-gray-300 px-14 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
        >
          Back
        </button>
        <button
          type='button'
          onClick={handleNext}
          className='w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DocumentsTab;
