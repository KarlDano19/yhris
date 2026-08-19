'use client';

import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
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
import MoveDocumentModal from './modals/MoveDocumentModal';
import FilePreviewModal from '@/components/FilePreviewModal';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import ProgressModal from '@/components/ProgressModal';

import useGetFolders from '../hooks/useGetFolders';
import useGetDocuments from '../hooks/useGetDocuments';
import { useDeleteDocument } from '../hooks/useDeleteDocument';
import useGetFilePreviewUrl from '../hooks/useGetFilePreviewUrl';
import { useReorderFolders } from '../hooks/useReorderFolders';

import type { Employee } from '@/types/employee-201-records/employee';
import type { T_EmployeeDocument, T_EmployeeDocumentFolder } from '@/types/employee-201-records/document-repository';

import { TrashIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

export default function DocumentRepositoryForm({ emp }: { emp?: Partial<Employee> }) {
  const params = useParams();
  const employeeId = parseInt(params.id as string);
  const queryClient = useQueryClient();

  const [selectedFolderId, setSelectedFolderId] = useState<number | null | undefined>(undefined);
  const [pendingSearchTerm, setPendingSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTrashViewOpen, setIsTrashViewOpen] = useState(false);

  // Modal states
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isRenameFolderModalOpen, setIsRenameFolderModalOpen] = useState(false);
  const [isDeleteFolderModalOpen, setIsDeleteFolderModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<T_EmployeeDocumentFolder | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<T_EmployeeDocument | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Bulk selection state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<Set<number>>(new Set());
  const [isBulkMove, setIsBulkMove] = useState(false);
  const [isBulkDeleteConfirmModalOpen, setIsBulkDeleteConfirmModalOpen] = useState<DeleteModalData | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const bulkDeleteFailedCountRef = useRef(0);

  // Fetch folders
  const { data: folders, isLoading: foldersLoading, refetch: refetchFolders } = useGetFolders(employeeId);

  // Mirrors `folders` in plain React state so drag reordering can update it via
  // flushSync — React Query's cache notifications are batched on a microtask,
  // so flushSync can't force a synchronous re-render from setQueryData alone,
  // which was causing the reordered list to flash back to its old position.
  const [localFolders, setLocalFolders] = useState<T_EmployeeDocumentFolder[] | null>(null);

  useEffect(() => {
    setLocalFolders(folders ?? null);
  }, [folders]);

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
  const { mutate: deleteDocument, mutateAsync: deleteDocumentAsync } = useDeleteDocument(employeeId);

  // Employee 201 docs are on a protected local path — need auth token to fetch
  const { data: previewUrl = '', isFetching: isPreviewLoading } = useGetFilePreviewUrl(selectedDocument?.file ?? '');

  // Reorder folders mutation
  const { mutate: reorderFolders } = useReorderFolders(employeeId);

  const handleFolderSelect = (folderId: number | null | undefined) => {
    setSelectedFolderId(folderId);
  };

  const handleSearchSubmit = () => {
    setSearchTerm(pendingSearchTerm);
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

  const handleReorderFolders = (folderIds: number[]) => {
    const sourceFolders = localFolders ?? folders;
    if (!sourceFolders) return;

    const foldersById = new Map(sourceFolders.map((folder) => [folder.id, folder]));
    const reordered = folderIds
      .map((id, index) => {
        const folder = foldersById.get(id);
        return folder ? { ...folder, order: index } : null;
      })
      .filter((folder): folder is T_EmployeeDocumentFolder => folder !== null);

    setLocalFolders(reordered);
    queryClient.setQueryData(['employeeDocumentFoldersCache', employeeId], reordered);

    reorderFolders(
      { folder_ids: folderIds },
      {
        onError: (error) => {
          toast.custom((t) => (
            <CustomToast message={error.message || 'Failed to reorder folders'} type="error" />
          ));
          refetchFolders();
        },
      }
    );
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    const sourceFolders = localFolders ?? folders;
    if (!destination || !sourceFolders || source.index === destination.index) return;

    const reordered = Array.from(sourceFolders);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);

    // `setLocalFolders` inside handleReorderFolders is plain React state, so
    // flushSync forces that re-render to happen before the browser paints the
    // drop frame, eliminating the flash back to the old position. (React
    // Query's cache update alone isn't enough — its notifyManager batches
    // listener notifications on a microtask, which flushSync can't force.)
    flushSync(() => {
      handleReorderFolders(reordered.map((folder) => folder.id));
    });
  };

  const handleDownload = (document: T_EmployeeDocument) => {
    setSelectedDocument(document);
    setIsDownloadModalOpen(true);
  };

  const handlePreview = (document: T_EmployeeDocument) => {
    setSelectedDocument(document);
    setIsPreviewModalOpen(true);
  };

  const handleMoveDocument = (document: T_EmployeeDocument) => {
    setIsBulkMove(false);
    setSelectedDocument(document);
    setIsMoveModalOpen(true);
  };

  const handleToggleSelectionMode = () => {
    setIsSelectionMode((prev) => !prev);
    setSelectedDocumentIds(new Set());
  };

  const handleToggleSelectDocument = (documentId: number) => {
    setSelectedDocumentIds((prev) => {
      const next = new Set(prev);
      if (next.has(documentId)) {
        next.delete(documentId);
      } else {
        next.add(documentId);
      }
      return next;
    });
  };

  const handleSelectAllDocuments = () => {
    const visibleIds = (documents || []).map((doc) => doc.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedDocumentIds.has(id));
    setSelectedDocumentIds(allSelected ? new Set() : new Set(visibleIds));
  };

  const handleBulkMove = () => {
    if (selectedDocumentIds.size === 0) return;
    setIsBulkMove(true);
    setIsMoveModalOpen(true);
  };

  const handleBulkDelete = () => {
    if (selectedDocumentIds.size === 0) return;
    setBulkDeleteCount(selectedDocumentIds.size);
    setIsBulkDeleteConfirmModalOpen({ open: true });
  };

  const confirmBulkDeleteWarning = () => {
    setIsBulkDeleteConfirmModalOpen(null);
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      const ids = Array.from(selectedDocumentIds);
      const results = await Promise.allSettled(ids.map((id) => deleteDocumentAsync(id)));
      bulkDeleteFailedCountRef.current = results.filter((r) => r.status === 'rejected').length;
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleBulkDeleteSuccess = () => {
    const failedCount = bulkDeleteFailedCountRef.current;
    const successCount = bulkDeleteCount - failedCount;

    if (failedCount === 0) {
      toast.custom((t) => (
        <CustomToast message={`${bulkDeleteCount} document(s) deleted successfully`} type="success" />
      ));
    } else {
      toast.custom((t) => (
        <CustomToast
          message={`${successCount}/${bulkDeleteCount} document(s) deleted. ${failedCount} failed.`}
          type={failedCount === bulkDeleteCount ? 'error' : 'success'}
        />
      ));
    }

    setSelectedDocumentIds(new Set());
    setIsSelectionMode(false);
    refetchDocuments();
    refetchFolders();
  };

  const handlePreviewDownload = () => {
    setIsPreviewModalOpen(false);
    if (selectedDocument) {
      setIsDownloadModalOpen(true);
    }
  };

  const handleConfirmDownload = async () => {
    if (!selectedDocument?.file) return;

    setIsDownloading(true);
    try {
      const token = getCookie('token');
      const isLocalPath = selectedDocument.file.startsWith('/');

      if (!isLocalPath) {
        // S3/MinIO presigned URLs — open in new tab to avoid CORS
        window.open(selectedDocument.file, '_blank');
        setIsDownloadModalOpen(false);
        setSelectedDocument(null);
        return;
      }

      const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}${selectedDocument.file}`;
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar: Folder List */}
            <div className="w-full md:w-64 md:flex-shrink-0">
              <DocumentFolderList
                folders={localFolders ?? folders ?? []}
                selectedFolderId={selectedFolderId}
                onFolderSelect={handleFolderSelect}
                onCreateFolder={() => setIsCreateFolderModalOpen(true)}
                onRenameFolder={handleRenameFolder}
                onDeleteFolder={handleDeleteFolder}
                isLoading={foldersLoading}
              />
            </div>

            {/* Main Content: Upload Zone + Document List */}
            <div className="flex-1 min-w-0 space-y-6">
              <DocumentUploadZone
                employeeId={employeeId}
                folderId={selectedFolderId}
                onUploadSuccess={handleUploadSuccess}
              />

              <DocumentList
                documents={documents || []}
                isLoading={documentsLoading}
                searchTerm={pendingSearchTerm}
                onSearchChange={setPendingSearchTerm}
                onSearchSubmit={handleSearchSubmit}
                onPreview={handlePreview}
                onDownload={handleDownload}
                onDelete={handleDeleteDocument}
                onMove={handleMoveDocument}
                isSelectionMode={isSelectionMode}
                selectedIds={selectedDocumentIds}
                onToggleSelectionMode={handleToggleSelectionMode}
                onToggleSelect={handleToggleSelectDocument}
                onSelectAll={handleSelectAllDocuments}
                onBulkMove={handleBulkMove}
                onBulkDelete={handleBulkDelete}
              />
            </div>
          </div>
        </DragDropContext>
      )}

      {/* Modals */}
      <FilePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setTimeout(() => setSelectedDocument(null), 300);
        }}
        fileName={selectedDocument?.file_name ?? ''}
        fileUrl={previewUrl}
        isLoadingUrl={isPreviewLoading}
        onDownload={handlePreviewDownload}
      />

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

      <MoveDocumentModal
        isOpen={isMoveModalOpen}
        onClose={() => {
          setIsMoveModalOpen(false);
          setSelectedDocument(null);
          if (isBulkMove) {
            setIsBulkMove(false);
            setSelectedDocumentIds(new Set());
            setIsSelectionMode(false);
          }
        }}
        employeeId={employeeId}
        documents={
          isBulkMove
            ? (documents || []).filter((doc) => selectedDocumentIds.has(doc.id))
            : selectedDocument
              ? [selectedDocument]
              : []
        }
        folders={folders || []}
      />

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteConfirmModalOpen?.open && (
        <DeleteModal
          isOpen={isBulkDeleteConfirmModalOpen}
          setIsOpen={setIsBulkDeleteConfirmModalOpen}
          onConfirm={confirmBulkDeleteWarning}
          isLoading={false}
          customText={`${bulkDeleteCount} selected document${bulkDeleteCount > 1 ? 's' : ''}`}
        />
      )}

      {/* Bulk Delete Progress Modal */}
      {isBulkDeleteModalOpen && (
        <ProgressModal
          isOpen={isBulkDeleteModalOpen}
          setIsOpen={setIsBulkDeleteModalOpen}
          onConfirm={confirmBulkDelete}
          title={`Deleting ${bulkDeleteCount} document${bulkDeleteCount > 1 ? 's' : ''}...`}
          isProcessing={isBulkDeleting}
          onSuccess={handleBulkDeleteSuccess}
        />
      )}

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