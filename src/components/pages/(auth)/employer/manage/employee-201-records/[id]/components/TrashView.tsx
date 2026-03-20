'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';

import useGetDeletedDocuments from '../hooks/useGetDeletedDocuments';
import useGetDeletedFolders from '../hooks/useGetDeletedFolders';
import { useRestoreDocument } from '../hooks/useRestoreDocument';
import { useRestoreFolder } from '../hooks/useRestoreFolder';

import { DocumentIcon, FolderIcon, TrashIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

type Tab = 'documents' | 'folders';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

type Props = {
  employeeId: number;
};

export default function TrashView({ employeeId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('documents');

  const { data: deletedDocuments, isLoading: docsLoading } = useGetDeletedDocuments(employeeId);
  const { data: deletedFolders, isLoading: foldersLoading } = useGetDeletedFolders(employeeId);

  const { mutate: restoreDocument, isLoading: restoringDoc } = useRestoreDocument(employeeId);
  const { mutate: restoreFolder, isLoading: restoringFolder } = useRestoreFolder(employeeId);

  const handleRestoreDocument = (documentId: number, fileName: string) => {
    if (!confirm(`Restore "${fileName}"?`)) return;
    restoreDocument(documentId, {
      onSuccess: () => {
        toast.custom((t) => (
          <CustomToast toast={toast} t={t} message="Document restored successfully" type="success" />
        ));
      },
      onError: (error) => {
        toast.custom((t) => (
          <CustomToast
            toast={toast}
            t={t}
            message={error.message || 'Failed to restore document'}
            type="error"
          />
        ));
      },
    });
  };

  const handleRestoreFolder = (folderId: number, folderName: string) => {
    if (!confirm(`Restore folder "${folderName}"?`)) return;
    restoreFolder(folderId, {
      onSuccess: () => {
        toast.custom((t) => (
          <CustomToast toast={toast} t={t} message="Folder restored successfully" type="success" />
        ));
      },
      onError: (error) => {
        toast.custom((t) => (
          <CustomToast
            toast={toast}
            t={t}
            message={error.message || 'Failed to restore folder'}
            type="error"
          />
        ));
      },
    });
  };

  const isLoading = activeTab === 'documents' ? docsLoading : foldersLoading;
  const isEmpty =
    activeTab === 'documents'
      ? !docsLoading && (!deletedDocuments || deletedDocuments.length === 0)
      : !foldersLoading && (!deletedFolders || deletedFolders.length === 0);

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'documents'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Deleted Documents
        </button>
        <button
          onClick={() => setActiveTab('folders')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'folders'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Deleted Folders
        </button>
      </div>

      {/* Content */}
      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 p-3 rounded-lg bg-gray-50">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="flex-1 h-4 bg-gray-200 rounded" />
              <div className="w-16 h-4 bg-gray-200 rounded" />
              <div className="w-24 h-4 bg-gray-200 rounded" />
              <div className="w-16 h-7 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && isEmpty && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <TrashIcon className="w-12 h-12 mb-3" />
          <p className="text-sm">Trash is empty</p>
        </div>
      )}

      {!isLoading && activeTab === 'documents' && deletedDocuments && deletedDocuments.length > 0 && (
        <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
          {deletedDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 px-4 py-3 bg-white hover:bg-gray-50">
              <DocumentIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span className="flex-1 text-sm text-gray-800 truncate" title={doc.file_name}>
                {doc.file_name}
              </span>
              <span className="text-xs text-gray-500 w-20 text-right flex-shrink-0">
                {formatFileSize(doc.file_size)}
              </span>
              <span className="text-xs text-gray-500 w-36 flex-shrink-0">
                Deleted: {formatDate(doc.deleted_at)}
              </span>
              <button
                onClick={() => handleRestoreDocument(doc.id, doc.file_name)}
                disabled={restoringDoc}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <ArrowUturnLeftIcon className="w-3.5 h-3.5" />
                Restore
              </button>
            </div>
          ))}
        </div>
      )}

      {!isLoading && activeTab === 'folders' && deletedFolders && deletedFolders.length > 0 && (
        <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
          {deletedFolders.map((folder) => (
            <div key={folder.id} className="flex items-center gap-4 px-4 py-3 bg-white hover:bg-gray-50">
              <FolderIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <span className="flex-1 text-sm text-gray-800 truncate" title={folder.name}>
                {folder.name}
              </span>
              {folder.description && (
                <span className="text-xs text-gray-400 truncate max-w-xs flex-shrink-0">
                  {folder.description}
                </span>
              )}
              <span className="text-xs text-gray-500 w-36 flex-shrink-0">
                Deleted: {formatDate(folder.deleted_at)}
              </span>
              <button
                onClick={() => handleRestoreFolder(folder.id, folder.name)}
                disabled={restoringFolder}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <ArrowUturnLeftIcon className="w-3.5 h-3.5" />
                Restore
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
