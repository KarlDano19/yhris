'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import Section from '../common/Section';

import DocumentFolderList from './DocumentFolderList';
import DocumentList from './DocumentList';
import DocumentUploadZone from './DocumentUploadZone';
import CreateFolderModal from './modals/CreateFolderModal';
import RenameFolderModal from './modals/RenameFolderModal';
import DeleteFolderModal from './modals/DeleteFolderModal';

import useGetFolders from '../hooks/useGetFolders';
import useGetDocuments from '../hooks/useGetDocuments';
import { useDeleteDocument } from '../hooks/useDeleteDocument';

import type { Employee } from '@/types/employee-201-records/employee';
import type { T_EmployeeDocumentFolder } from '@/types/employee-201-records/document-repository';

export default function DocumentRepositoryForm({ emp }: { emp?: Partial<Employee> }) {
  const params = useParams();
  const employeeId = parseInt(params.id as string);

  const [selectedFolderId, setSelectedFolderId] = useState<number | null | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isRenameFolderModalOpen, setIsRenameFolderModalOpen] = useState(false);
  const [isDeleteFolderModalOpen, setIsDeleteFolderModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<T_EmployeeDocumentFolder | null>(null);

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
      <CustomToast toast={toast} t={t} message="Documents uploaded successfully" type="success" />
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

  const handleDownload = (document: any) => {
    if (document.file) {
      window.open(document.file, '_blank');
    }
  };

  const handleDeleteDocument = (documentId: number) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument(documentId, {
        onSuccess: () => {
          toast.custom((t) => (
            <CustomToast toast={toast} t={t} message="Document deleted successfully" type="success" />
          ));
          refetchDocuments();
          refetchFolders();
        },
        onError: (error) => {
          toast.custom((t) => (
            <CustomToast
              toast={toast}
              t={t}
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

      {/* Modals */}
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