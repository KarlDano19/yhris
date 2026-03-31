'use client';

import React from 'react';
import {
  DocumentIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import { T_EmployeeDocument } from '@/types/employee-201-records/document-repository';

interface DocumentListProps {
  documents: T_EmployeeDocument[];
  isLoading?: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onDownload?: (document: T_EmployeeDocument) => void;
  onDelete?: (documentId: number) => void;
  onMove?: (document: T_EmployeeDocument) => void;
}

export default function DocumentList({
  documents,
  isLoading = false,
  searchTerm,
  onSearchChange,
  onDownload,
  onDelete,
  onMove,
}: DocumentListProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full rounded-md bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Document Grid */}
      {documents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <DocumentIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No documents found</p>
          <p className="text-sm mt-1">
            {searchTerm ? 'Try a different search term' : 'Upload files to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="group relative border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              {/* Document Icon and Name */}
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <DocumentIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate" title={doc.file_name}>
                    {doc.file_name}
                  </h4>
                  <p className="text-xs text-gray-500">{formatFileSize(doc.file_size)}</p>
                </div>

                {/* Actions Menu */}
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative">
                    <button
                      className="p-1 rounded hover:bg-gray-100"
                      title="More actions"
                    >
                      <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-1 mb-3">
                {doc.folder_name && (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <span className="font-medium">Folder:</span>
                    <span>{doc.folder_name}</span>
                  </div>
                )}
                {doc.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">{doc.description}</p>
                )}
                <div className="text-xs text-gray-500">
                  Uploaded {formatDate(doc.created_at)}
                </div>
                {doc.uploaded_by && (
                  <div className="text-xs text-gray-500">
                    by {doc.uploaded_by}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => onDownload && onDownload(doc)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Download
                </button>
                {onDelete && (
                  <button
                    onClick={() => onDelete(doc.id)}
                    className="flex items-center justify-center px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
