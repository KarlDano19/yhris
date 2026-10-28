'use client';

import React from 'react';
import {
  DocumentIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  EyeIcon,
  FolderArrowDownIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { T_EmployeeDocument } from '@/types/employee-201-records/document-repository';

interface DocumentListProps {
  documents: T_EmployeeDocument[];
  isLoading?: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearchSubmit: () => void;
  onDownload?: (document: T_EmployeeDocument) => void;
  onPreview?: (document: T_EmployeeDocument) => void;
  onDelete?: (documentId: number) => void;
  onMove?: (document: T_EmployeeDocument) => void;
  isSelectionMode: boolean;
  selectedIds: Set<number>;
  onToggleSelectionMode: () => void;
  onToggleSelect: (documentId: number) => void;
  onSelectAll: () => void;
  onBulkMove: () => void;
  onBulkDelete: () => void;
}

const DocumentList = ({
  documents,
  isLoading = false,
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  onDownload,
  onPreview,
  onDelete,
  onMove,
  isSelectionMode,
  selectedIds,
  onToggleSelectionMode,
  onToggleSelect,
  onSelectAll,
  onBulkMove,
  onBulkDelete,
}: DocumentListProps) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full rounded-md bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const allSelected = documents.length > 0 && documents.every((doc) => selectedIds.has(doc.id));

  return (
    <div className="space-y-4">
      {/* Search Bar + Selection Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSearchSubmit();
              }
            }}
            className="w-full h-10 px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={onSearchSubmit}
          className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          title="Search"
        >
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
        </button>
        {documents.length > 0 && (
          <button
            onClick={onToggleSelectionMode}
            className={`flex-shrink-0 h-10 flex items-center gap-1.5 px-3 text-sm font-medium rounded-lg border transition-colors whitespace-nowrap ${
              isSelectionMode
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CheckCircleIcon className="h-4 w-4" />
            {isSelectionMode ? 'Cancel' : 'Select'}
          </button>
        )}
      </div>

      {/* Bulk Action Bar */}
      {isSelectionMode && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-blue-800">
              {selectedIds.size} selected
            </span>
            <button
              onClick={onSelectAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-50"
            >
              {allSelected ? 'Deselect all' : 'Select all'}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBulkMove}
              disabled={selectedIds.size === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FolderArrowDownIcon className="h-4 w-4" />
              Move
            </button>
            <button
              onClick={onBulkDelete}
              disabled={selectedIds.size === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TrashIcon className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      )}

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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {documents.map((doc) => {
            const isSelected = selectedIds.has(doc.id);
            return (
              <div
                key={doc.id}
                onClick={() => isSelectionMode && onToggleSelect(doc.id)}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow bg-white flex flex-col ${
                  isSelectionMode
                    ? `cursor-pointer ${isSelected ? 'border-blue-400 ring-1 ring-blue-400' : 'border-gray-200'}`
                    : 'border-gray-200'
                }`}
              >
                {/* Document Icon and Name */}
                <div className="flex items-start gap-3 mb-3">
                  {isSelectionMode && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(doc.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-shrink-0 mt-2.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  )}
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <DocumentIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate" title={doc.file_name}>
                      {doc.file_name}
                    </h4>
                    <p className="text-xs text-gray-500">{formatFileSize(doc.file_size)}</p>
                  </div>
                </div>

                {/* Metadata */}
                <div className={`space-y-1 mb-3 flex-1 ${isSelectionMode ? 'pl-7' : ''}`}>
                  {doc.folder_name && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <span className="font-medium">Folder:</span>
                      <span className="truncate">{doc.folder_name}</span>
                    </div>
                  )}
                  {doc.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">{doc.description}</p>
                  )}
                  <div className="text-xs text-gray-500">Uploaded {formatDate(doc.created_at)}</div>
                  {doc.uploaded_by && (
                    <div className="text-xs text-gray-500 truncate">by {doc.uploaded_by}</div>
                  )}
                </div>

                {/* Actions */}
                {!isSelectionMode && (
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    {onPreview && (
                      <button
                        onClick={() => onPreview(doc)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors border border-gray-200 whitespace-nowrap"
                      >
                        <EyeIcon className="h-4 w-4 flex-shrink-0" />
                        Preview
                      </button>
                    )}
                    <button
                      onClick={() => onDownload && onDownload(doc)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 rounded-md transition-colors whitespace-nowrap"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 flex-shrink-0" />
                      Download
                    </button>
                    {onMove && (
                      <button
                        onClick={() => onMove(doc)}
                        className="flex-shrink-0 flex items-center justify-center p-1.5 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        title="Move to folder"
                      >
                        <FolderArrowDownIcon className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(doc.id)}
                        className="flex-shrink-0 flex items-center justify-center p-1.5 text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
