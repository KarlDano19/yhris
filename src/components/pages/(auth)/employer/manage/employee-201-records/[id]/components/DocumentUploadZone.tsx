'use client';

import React, { useState, useRef } from 'react';

import toast from 'react-hot-toast';

import { useUploadDocuments } from '../hooks/useUploadDocuments';
import CustomToast from '@/components/CustomToast';

import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DocumentUploadZoneProps {
  employeeId: number;
  folderId: number | null | undefined;
  onUploadSuccess?: () => void;
}

export default function DocumentUploadZone({
  employeeId,
  folderId,
  onUploadSuccess,
}: DocumentUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadDocuments, isLoading: isUploading } = useUploadDocuments(employeeId);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    validateAndAddFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      validateAndAddFiles(files);
    }
  };

  const validateAndAddFiles = (files: File[]) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    files.forEach((file) => {
      if (file.size > maxSize) {
        invalidFiles.push(`${file.name} (exceeds 10MB)`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      toast.custom((t) => (
        <CustomToast
          toast={toast}
          t={t}
          message={`Some files are too large: ${invalidFiles.join(', ')}`}
          type="error"
        />
      ));
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast.custom((t) => (
        <CustomToast
          toast={toast}
          t={t}
          message="Please select files to upload"
          type="error"
        />
      ));
      return;
    }

    // Create a FileList-like object
    const dataTransfer = new DataTransfer();
    selectedFiles.forEach((file) => dataTransfer.items.add(file));
    const files = dataTransfer.files;

    uploadDocuments(
      {
        files,
        folderId: folderId === undefined ? null : folderId,
      },
      {
        onSuccess: (data) => {
          toast.custom((t) => (
            <CustomToast
              toast={toast}
              t={t}
              message={data.message || 'Documents uploaded successfully'}
              type="success"
            />
          ));
          setSelectedFiles([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          if (onUploadSuccess) {
            onUploadSuccess();
          }
        },
        onError: (error) => {
          toast.custom((t) => (
            <CustomToast
              toast={toast}
              t={t}
              message={error.message || 'Failed to upload documents'}
              type="error"
            />
          ));
        },
      }
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <CloudArrowUpIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-sm font-medium text-gray-700 mb-1">
          Drop files here or click to browse
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Maximum file size: 10MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          accept=".doc,.docx,.pdf,.csv,.xls,.xlsx"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
        >
          Select Files
        </label>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Selected Files ({selectedFiles.length})
            </h4>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? 'Uploading...' : 'Upload Files'}
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-64 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 hover:bg-gray-50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-3 p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                  title="Remove file"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
