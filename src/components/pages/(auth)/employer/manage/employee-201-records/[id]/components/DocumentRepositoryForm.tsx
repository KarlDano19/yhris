'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { getCookie } from 'cookies-next';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import Section from '../common/Section';

import DocumentFolderList from './DocumentFolderList';
import DocumentList from './DocumentList';
import DocumentUploadZone from './DocumentUploadZone';
import TrashView from './TrashView';
import CreateFolderModal from './modals/CreateFolderModal';
import RenameFolderModal from './modals/RenameFolderModal';
import DeleteFolderModal from './modals/DeleteFolderModal';
import DownloadDocumentModal from './modals/DownloadDocumentModal';

import useGetFolders from '../hooks/useGetFolders';
import useGetDocuments from '../hooks/useGetDocuments';
import { useDeleteDocument } from '../hooks/useDeleteDocument';

import type { Employee } from '@/types/employee-201-records/employee';
import type { T_EmployeeDocument, T_EmployeeDocumentFolder } from '@/types/employee-201-records/document-repository';

import { TrashIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

export default function DocumentRepositoryForm({ emp }: { emp?: Partial<Employee> }) {
  const params = useParams();
  const employeeId = parseInt(params.id as string);

  const [selectedFolderId, setSelectedFolderId] = useState<number | null | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTrashViewOpen, setIsTrashViewOpen] = useState(false);

  // Modal states
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isRenameFolderModalOpen, setIsRenameFolderModalOpen] = useState(false);
  const [isDeleteFolderModalOpen, setIsDeleteFolderModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<T_EmployeeDocumentFolder | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<T_EmployeeDocument | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch folders
  const { data: folders, isLoading: foldersLoading, refetch: refetchFolders } = useGetFolders(employeeId);

  // Fetch documents
  const {
    data: documents,
    isLoading: documentsLoading,
    refetch: refetchDocuments,
  } = useGetDocuments({
    employeeId,
    folderId: selectedFolderId,
    search: searchTerm,
  });

  // Delete document mutation
  const { mutate: deleteDocument } = useDeleteDocument(employeeId);

  const handleFolderSelect = (folderId: number | null | undefined) => {
    setSelectedFolderId(folderId);
  };

  const handleUploadSuccess = () => {
    toast.custom((t) => (
      <CustomToast message="Documents uploaded successfully" type="success" />
    ));
    refetchDocuments();
    refetchFolders();
  };

  const handleRenameFolder = (folder: T_EmployeeDocumentFolder) => {
    setSelectedFolder(folder);
    setIsRenameFolderModalOpen(true);
  };

  const handleDeleteFolder = (folderId: number) => {
    const folder = folders?.find((f) => f.id === folderId);
    if (folder) {
      setSelectedFolder(folder);
      setIsDeleteFolderModalOpen(true);
    }
  };

  const handleDownload = (document: T_EmployeeDocument) => {
    setSelectedDocument(document);
    setIsDownloadModalOpen(true);
  };

  const handleConfirmDownload = async () => {
    if (!selectedDocument?.file) return;

    setIsDownloading(true);
    try {
      const token = getCookie('token');
      const fileUrl = selectedDocument.file.startsWith('/')
        ? `${process.env.NEXT_PUBLIC_API_URL}${selectedDocument.file}`
        : selectedDocument.file;

      const res = await fetch(fileUrl, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!res.ok) throw new Error('Failed to download file.');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = selectedDocument.file_name || 'download';
      a.click();
      window.URL.revokeObjectURL(url);

      setIsDownloadModalOpen(false);
      setSelectedDocument(null);
    } catch {
      toast.custom((t) => (
        <CustomToast message="Failed to download file." type="error" />
      ));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeleteDocument = (documentId: number) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument(documentId, {
        onSuccess: () => {
          toast.custom((t) => (
            <CustomToast message="Document deleted successfully" type="success" />
          ));
          refetchDocuments();
          refetchFolders();
        },
        onError: (error) => {
          toast.custom((t) => (
            <CustomToast
              message={error.message || 'Failed to delete document'}
              type="error"
            />
          ));
        },
      });
    }
  };

  return (
    <Section>
      {/* Toolbar */}
      <div className="flex justify-end mb-4">
        {isTrashViewOpen ? (
          <button
            onClick={() => setIsTrashViewOpen(false)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            <ArrowUturnLeftIcon className="w-4 h-4" />
            Back to Files
          </button>
        ) : (
          <button
            onClick={() => setIsTrashViewOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            <TrashIcon className="w-4 h-4" />
            Trash
          </button>
        )}
      </div>

      {isTrashViewOpen ? (
        <TrashView employeeId={employeeId} />
      ) : (
        <div className="flex gap-6">
          {/* Sidebar: Folder List */}
          <div className="w-64 flex-shrink-0">
            <DocumentFolderList
              folders={folders || []}
              selectedFolderId={selectedFolderId}
              onFolderSelect={handleFolderSelect}
              onCreateFolder={() => setIsCreateFolderModalOpen(true)}
              onRenameFolder={handleRenameFolder}
              onDeleteFolder={handleDeleteFolder}
              isLoading={foldersLoading}
            />
          </div>

          {/* Main Content: Upload Zone + Document List */}
          <div className="flex-1 space-y-6">
            <DocumentUploadZone
              employeeId={employeeId}
              folderId={selectedFolderId}
              onUploadSuccess={handleUploadSuccess}
            />

            <DocumentList
              documents={documents || []}
              isLoading={documentsLoading}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onDownload={handleDownload}
              onDelete={handleDeleteDocument}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <DownloadDocumentModal
        isOpen={isDownloadModalOpen}
        onClose={() => {
          setIsDownloadModalOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
        onConfirm={handleConfirmDownload}
        isDownloading={isDownloading}
      />

      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        employeeId={employeeId}
      />

      <RenameFolderModal
        isOpen={isRenameFolderModalOpen}
        onClose={() => {
          setIsRenameFolderModalOpen(false);
          setSelectedFolder(null);
        }}
        employeeId={employeeId}
        folder={selectedFolder}
      />

      <DeleteFolderModal
        isOpen={isDeleteFolderModalOpen}
        onClose={() => {
          setIsDeleteFolderModalOpen(false);
          setSelectedFolder(null);
        }}
        employeeId={employeeId}
        folder={selectedFolder}
      />
    </Section>
  );
}