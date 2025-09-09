'use client';

import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { CloudArrowUpIcon, DocumentIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

import ModalLayout from './ModalLayout';
import CustomToast from '@/components/CustomToast';
import useBatchUploadResumes from '../hooks/useBatchUploadResumes';

interface BatchUploadProps {
  isOpen: boolean;
  onClose: () => void;
  jobPostingId: number;
  onSuccess: () => void;
}

interface UploadedFile {
  file: File;
  id: string;
  name: string;
  size: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface ProcessingResult {
  total_files: number;
  successful: number;
  failed: number;
  created_applicants: Array<{
    id: number;
    name: string;
    email: string;
    filename: string;
  }>;
  errors: Array<{
    filename: string;
    error: string;
  }>;
}

const BatchResumeUpload: React.FC<BatchUploadProps> = ({
  isOpen,
  onClose,
  jobPostingId,
  onSuccess
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [results, setResults] = useState<ProcessingResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { mutate: batchUploadMutate, isLoading: isProcessing } = useBatchUploadResumes();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    const newFiles: UploadedFile[] = files.map(file => {
      let status: 'pending' | 'error' = 'pending';
      let error: string | undefined;

      if (file.size > maxFileSize) {
        status = 'error';
        error = 'File size exceeds 10MB limit';
      } else if (!allowedTypes.includes(file.type)) {
        status = 'error';
        error = 'Only PDF and DOCX files are allowed';
      }

      return {
        file,
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: formatFileSize(file.size),
        status,
        error
      };
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    const newFiles: UploadedFile[] = files.map(file => {
      let status: 'pending' | 'error' = 'pending';
      let error: string | undefined;

      if (file.size > maxFileSize) {
        status = 'error';
        error = 'File size exceeds 10MB limit';
      } else if (!allowedTypes.includes(file.type)) {
        status = 'error';
        error = 'Only PDF and DOCX files are allowed';
      }

      return {
        file,
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: formatFileSize(file.size),
        status,
        error
      };
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };
  const handleProcessFiles = async () => {
    const validFiles = uploadedFiles.filter(file => file.status === 'pending');
    
    if (validFiles.length === 0) {
      toast.custom(<CustomToast message="No valid files to process" type="error" />);
      return;
    }

    const formData = new FormData();
    formData.append('job_posting', jobPostingId.toString());

    validFiles.forEach((fileItem, index) => {
      formData.append(`resume_${index}`, fileItem.file);
    });

    // Update file status to uploading
    setUploadedFiles(prev =>
      prev.map(file =>
        file.status === 'pending' ? { ...file, status: 'uploading' } : file
      )
    );

    batchUploadMutate(formData, {
      onSuccess: (data) => {
        // Debug: log the response structure
        console.log('Batch upload response:', data);
        
        // Handle the response structure - data should contain the results directly
        const results = data || {};
        setResults(results);
        
        // Update file statuses based on results
        setUploadedFiles(prev =>
          prev.map(file => {
            if (file.status === 'uploading') {
              // Safely access errors array
              const errors = results.errors || [];
              const error = errors.find((err: any) => err.filename === file.name);
              if (error) {
                return { ...file, status: 'error', error: error.error };
              } else {
                return { ...file, status: 'success' };
              }
            }
            return file;
          })
        );

        const successfulCount = results.successful || 0;
        const totalFiles = results.total_files || 0;

        toast.custom(
          <CustomToast 
            message={`Successfully processed ${successfulCount} out of ${totalFiles} files`} 
            type="success" 
          />
        );

        if (successfulCount > 0) {
          onSuccess();
        }
      },
      onError: (error: any) => {
        console.error('Batch processing error:', error);
        toast.custom(<CustomToast message={error.message || 'Processing failed'} type="error" />);
        
        // Reset file statuses
        setUploadedFiles(prev =>
          prev.map(file =>
            file.status === 'uploading' ? { ...file, status: 'pending' } : file
          )
        );
      }
    });
  };

  const handleClose = () => {
    if (!isProcessing) {
      setUploadedFiles([]);
      setResults(null);
      onClose();
    }
  };

  const validFilesCount = uploadedFiles.filter(file => file.status === 'pending').length;

  return (
    <ModalLayout 
      isOpen={isOpen} 
      handleClose={handleClose} 
      title="Batch Resume Upload"
    >
      <div className="p-6">
        {/* Upload Area */}
        {!results && (
          <div className="mb-6">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop resume files here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF and DOCX files up to 10MB each
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* File List */}
        {uploadedFiles.length > 0 && !results && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Selected Files ({uploadedFiles.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    file.status === 'error'
                      ? 'border-red-200 bg-red-50'
                      : file.status === 'uploading'
                      ? 'border-blue-200 bg-blue-50'
                      : file.status === 'success'
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <DocumentIcon className="h-8 w-8 text-gray-400 mr-3 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">{file.size}</p>
                      {file.error && (
                        <p className="text-xs text-red-600 mt-1">{file.error}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {file.status === 'uploading' && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    )}
                    {file.status === 'success' && (
                      <div className="h-4 w-4 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    {file.status === 'error' && (
                      <div className="h-4 w-4 bg-red-600 rounded-full flex items-center justify-center">
                        <XMarkIcon className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                    {(file.status === 'pending' || file.status === 'error') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        disabled={isProcessing}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Results Display */}
        {results && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Processing Results</h3>
            
            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{results.total_files || 0}</div>
                  <div className="text-sm text-gray-600">Total Files</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{results.successful || 0}</div>
                  <div className="text-sm text-gray-600">Successful</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{results.failed || 0}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </div>
            </div>

            {/* Successful Applicants */}
            {results.created_applicants && results.created_applicants.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-green-700 mb-2">
                  Successfully Created Applicants ({results.created_applicants.length})
                </h4>
                <div className="bg-green-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  {results.created_applicants.map((applicant, index) => (
                    <div key={index} className="flex justify-between items-start py-2 border-b border-green-200 last:border-b-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-green-900">
                            {applicant.name}
                          </span>
                          <span className="px-2 py-1 text-xs bg-green-200 text-green-800 rounded-full">
                            Affinda AI
                          </span>
                        </div>
                        <div className="text-xs text-green-700 mt-1">
                          📧 {applicant.email}
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                          📄 {applicant.filename}
                        </div>
                      </div>
                      <div className="text-xs text-green-600 ml-2">
                        ID: {applicant.id}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Errors */}
            {results.errors && results.errors.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-red-700 mb-2">
                  Processing Errors ({results.errors.length})
                </h4>
                <div className="bg-red-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  {results.errors.map((error, index) => (
                    <div key={index} className="py-2 border-b border-red-200 last:border-b-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-red-900">
                          📄 {error.filename}
                        </span>
                        <span className="px-2 py-1 text-xs bg-red-200 text-red-800 rounded-full">
                          Failed
                        </span>
                      </div>
                      <div className="text-xs text-red-700 mt-1 bg-red-100 p-2 rounded">
                        ⚠️ {error.error}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          {!results && (
            <>
              <button
                type="button"
                onClick={handleClose}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessFiles}
                disabled={validFilesCount === 0 || isProcessing}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                    Processing...
                  </>
                ) : (
                  `Process ${validFilesCount} Files`
                )}
              </button>
            </>
          )}
          
          {results && (
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              Close
            </button>
          )}
        </div>

        {/* Processing Info */}
        {isProcessing && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  🤖 Processing resumes with dual Affinda AI calls...
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Making two API calls per resume: contact info extraction + AI summary generation.
                </p>
              </div>
            </div>
            
            <div className="mt-3 bg-blue-100 rounded p-2">
              <p className="text-xs text-blue-600">
                <strong>Dual API Processing:</strong>
              </p>
              <ul className="text-xs text-blue-600 mt-1 list-disc list-inside space-y-1">
                <li>👤 API Call 1: Contact info & work experience</li>
                <li>📝 API Call 2: AI-generated resume summaries</li>
                <li>🔄 Parallel processing for optimal speed</li>
                <li>✅ Creating comprehensive applicant profiles</li>
              </ul>
            </div>
            
            <div className="mt-2 p-2 bg-green-100 rounded">
              <p className="text-xs text-green-700">
                <strong>✨ Enhanced Extraction:</strong> Using specialized document types for 
                maximum accuracy in both contact extraction and summary generation.
              </p>
            </div>
          </div>
        )}
      </div>
    </ModalLayout>
  );
};

export default BatchResumeUpload;
