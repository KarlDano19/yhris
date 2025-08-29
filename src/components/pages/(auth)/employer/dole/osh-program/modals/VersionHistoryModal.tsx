"use client";

import { Fragment, useState, useEffect } from 'react';

import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon, EyeIcon } from "@heroicons/react/24/solid";

import CustomToast from '@/components/CustomToast';
import Pagination from '@/components/Pagination';
import useGetOshProgramVersionHistory from '../hooks/useGetOshProgramVersionHistory';
import useDeleteOshProgramVersion from '../hooks/useDeleteOshProgramVersion';
import useBulkDeleteOshProgramVersions from '../hooks/useBulkDeleteOshProgramVersions';
import DeleteVersionModal from './DeleteVersionModal';

import DeleteIcon from '@/svg/DeleteIcon';


interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: (versionId: number) => void;
  onViewChanges: (versionNumber: string, changes: string, versionId?: number) => void;
}

export default function VersionHistoryModal({
  isOpen,
  onClose,
  onViewDetails,
  onViewChanges,
}: VersionHistoryModalProps) {
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [versionToDelete, setVersionToDelete] = useState<{ id: number; versionNumber: string } | null>(null);
  const [selectedVersions, setSelectedVersions] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Fetch version history data
  const { data: versionHistoryData, isLoading, refetch } = useGetOshProgramVersionHistory({
    page_size: pageSize,
    current_page: currentPage,
  });

  // Delete version mutation
  const deleteVersionMutation = useDeleteOshProgramVersion();
  const bulkDeleteVersionMutation = useBulkDeleteOshProgramVersions();

  // Reset to first page and refetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setSelectedVersions(new Set());
      setSelectAll(false);
      // Refetch data when modal opens to get the latest version history
      refetch();
    }
  }, [isOpen, refetch]);

  const pagination = {
    totalPages: versionHistoryData?.total_pages || 0,
    totalRecords: versionHistoryData?.total_records || 0
  };

  // Update select all state when versions change
  useEffect(() => {
    if (versionHistoryData?.records) {
      const allVersionIds = new Set(versionHistoryData.records.map(v => v.id));
      const allSelected = allVersionIds.size > 0 && 
        Array.from(allVersionIds).every(id => selectedVersions.has(id));
      setSelectAll(allSelected);
    }
  }, [selectedVersions, versionHistoryData?.records]);

  // Handle empty page navigation
  useEffect(() => {
    if (versionHistoryData?.records && versionHistoryData.records.length === 0 && currentPage > 1 && pagination.totalPages > 0) {
      // Navigate to the previous page if current page is empty and not the first page
      setCurrentPage(Math.min(currentPage - 1, pagination.totalPages));
    }
  }, [versionHistoryData?.records, currentPage, pagination.totalPages]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1); // Reset to first page when changing records per page
  };

  const handleDeleteVersion = (versionId: number, versionNumber: string) => {
    setVersionToDelete({ id: versionId, versionNumber });
    setDeleteModalOpen(true);
  };



  const confirmDeleteVersion = async () => {
    if (!versionToDelete) return;
    
    try {
      await deleteVersionMutation.mutateAsync(versionToDelete.id);
      toast.custom(() => <CustomToast message="Version deleted successfully." type="success" />, { duration: 3000 });
      setDeleteModalOpen(false);
      setVersionToDelete(null);
      // Clear selection for deleted version
      setSelectedVersions(prev => {
        const newSet = new Set(prev);
        newSet.delete(versionToDelete.id);
        return newSet;
      });
      // Wait a bit before refetching to ensure the delete operation is complete
      setTimeout(() => {
        refetch();
      }, 500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete version';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setVersionToDelete(null);
  };

  // Handle individual version selection
  const handleVersionSelect = (versionId: number) => {
    setSelectedVersions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(versionId)) {
        newSet.delete(versionId);
      } else {
        newSet.add(versionId);
      }
      return newSet;
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (!versionHistoryData?.records) return;
    
    if (selectAll) {
      // Deselect all
      setSelectedVersions(new Set());
    } else {
      // Select all
      const allIds = versionHistoryData.records.map(v => v.id);
      setSelectedVersions(new Set(allIds));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedVersions.size === 0) return;
    
    const selectedVersionsList = Array.from(selectedVersions);
    const versionNumbers = versionHistoryData?.records
      ?.filter(v => selectedVersionsList.includes(v.id))
      .map(v => v.version_number_formatted)
      .join(', ') || '';
    
    setVersionToDelete({ 
      id: -1, // Special ID to indicate bulk delete
      versionNumber: versionNumbers 
    });
    setDeleteModalOpen(true);
  };

  // Handle bulk delete confirmation
  const confirmBulkDelete = async () => {
    if (selectedVersions.size === 0) return;
    
    try {
      // Use bulk delete mutation
      const versionIds = Array.from(selectedVersions);
      await bulkDeleteVersionMutation.mutateAsync(versionIds);
      
      toast.custom(() => <CustomToast message={`${selectedVersions.size} version(s) deleted successfully.`} type="success" />, { duration: 3000 });
      setDeleteModalOpen(false);
      setVersionToDelete(null);
      setSelectedVersions(new Set());
      setSelectAll(false);
      
      // Wait a bit before refetching to ensure the delete operations are complete
      setTimeout(() => {
        refetch();
      }, 500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete versions';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
    }
  };

  const isBulkDelete = versionToDelete?.id === -1;

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={()=>{}}
        >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-visible rounded-b-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex bg-savoy-blue p-4 items-center">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">
                      Version History
                    </h3>
                    {versionHistoryData?.version_info && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-white text-sm opacity-90">
                          {versionHistoryData.version_info.current_count}/{versionHistoryData.version_info.max_limit} versions
                        </span>
                        {versionHistoryData.version_info.remaining_slots <= 5 && (
                          <span className="text-yellow-300 text-xs font-medium">
                            ({versionHistoryData.version_info.remaining_slots} remaining)
                          </span>
                        )}
                        {!versionHistoryData.version_info.can_create_new && (
                          <span className="text-red-300 text-xs font-medium">
                            Limit reached - delete old versions
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer hover:text-gray-200"
                    onClick={onClose}
                  />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Version Limit Warning */}
                  {versionHistoryData?.version_info && (
                    <>
                      {!versionHistoryData.version_info.can_create_new && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800">
                                Version Limit Reached
                              </h3>
                              <div className="mt-1 text-sm text-red-700">
                                <p>
                                  You&apos;ve reached the maximum limit of {versionHistoryData.version_info.max_limit} versions. 
                                  Please delete some older versions before creating new ones.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {versionHistoryData.version_info.remaining_slots <= 5 && versionHistoryData.version_info.remaining_slots > 0 && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-yellow-800">
                                Approaching Version Limit
                              </h3>
                              <div className="mt-1 text-sm text-yellow-700">
                                <p>
                                  You have {versionHistoryData.version_info.remaining_slots} version slots remaining. 
                                  Consider deleting old versions to free up space.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Bulk Actions */}
                  {selectedVersions.size > 1 && (
                    <div className="mb-4 p-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleBulkDelete}
                          disabled={bulkDeleteVersionMutation.isLoading}
                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {bulkDeleteVersionMutation.isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Deleting...
                            </div>
                          ) : (
                            'Delete Selected'
                          )}
                        </button>
                        <button
                          onClick={() => setSelectedVersions(new Set())}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Clear Selected
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <div className="mb-2 text-sm text-gray-600">
                      {versionHistoryData?.records && (
                        <span>
                          Showing {versionHistoryData.records.length} of {pagination.totalRecords} versions
                        </span>
                      )}
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={handleSelectAll}
                              disabled={!versionHistoryData?.records || versionHistoryData.records.length === 0}
                              className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue disabled:opacity-50"
                            />
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Version No.
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Changes
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date Updated
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center">
                              <div className="flex justify-center items-center py-8">
                                <div role="status" className="text-center">
                                  <svg
                                    aria-hidden="true"
                                    className="inline w-20 h-20 text-gray-200 animate-spin fill-yellow-400"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                      fill="currentFill"
                                    />
                                  </svg>
                                  <span className="sr-only">Loading...</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : versionHistoryData?.records && versionHistoryData.records.length > 0 ? (
                          versionHistoryData.records.map((version) => (
                            <tr key={version.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={selectedVersions.has(version.id)}
                                  onChange={() => handleVersionSelect(version.id)}
                                  className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {version.version_number_formatted}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                <button
                                  onClick={() => onViewChanges(version.version_number_formatted, version.changes_summary || 'No changes summary available', version.id)}
                                  className="text-left hover:text-savoy-blue hover:underline cursor-pointer truncate block w-full"
                                  title="Click to view changes details"
                                >
                                  {version.changes_summary || 'No changes summary available'}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(version.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => onViewDetails(version.id)}
                                    className="text-savoy-blue hover:text-savoy-blue-dark p-1 rounded-full hover:bg-gray-100"
                                    title="View Details"
                                  >
                                    <EyeIcon className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteVersion(version.id, version.version_number_formatted)}
                                    disabled={deleteVersionMutation.isLoading || selectedVersions.size > 1}
                                    className={`text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${selectedVersions.size > 1 ? 'invisible' : ''}`}
                                    title="Delete Version"
                                  >
                                    {deleteVersionMutation.isLoading ? (
                                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                                    ) : (
                                      <DeleteIcon />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                              No version history available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="mt-6">
                    <Pagination
                      pagination={pagination}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      onPageSizeChange={handlePageSizeChange}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>

      {/* Delete Version Confirmation Modal */}
      {deleteModalOpen && (
        <DeleteVersionModal
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={isBulkDelete ? confirmBulkDelete : confirmDeleteVersion}
          versionNumber={versionToDelete?.versionNumber || ''}
          isLoading={isBulkDelete ? bulkDeleteVersionMutation.isLoading : deleteVersionMutation.isLoading}
          isBulkDelete={isBulkDelete}
          selectedCount={isBulkDelete ? selectedVersions.size : undefined}
        />
      )}


    </>
  );
}
