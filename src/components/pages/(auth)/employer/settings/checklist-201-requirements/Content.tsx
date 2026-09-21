'use client';

import React, { useEffect, useState } from 'react';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';
import BackButton from '@/components/BackButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import CustomToast from '@/components/CustomToast';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import AddModal from './modals/AddModal';
import EditModal from './modals/EditModal';
import useGetChecklist201Requirements from './hooks/useGetChecklist201Requirements';
import useDeleteChecklist201Requirement from './hooks/useDeleteChecklist201Requirement';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_EditModalData = {
  open: boolean;
  id: number;
  name: string;
  is_active: boolean;
};

const Content = () => {
  const [requirementItems, setRequirementItems] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState<T_EditModalData | null>(null);
  const [deleteModalData, setDeleteModalData] = useState<DeleteModalData | null>(null);
  const [searchText, setSearchText] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPages: 1,
    totalRecords: 0,
  });

  const {
    data: requirementListData,
    isLoading: isRequirementListLoading,
    refetch: refetchRequirements,
  } = useGetChecklist201Requirements({ search: appliedSearch, pageSize, currentPage });

  const { mutate: deleteRequirement, isLoading: isDeleteLoading } = useDeleteChecklist201Requirement();

  useEffect(() => {
    if (requirementListData) {
      setRequirementItems(requirementListData.records || []);
      setPagination({
        totalPages: requirementListData.total_pages || 1,
        totalRecords: requirementListData.total_records || 0,
      });
    }
  }, [requirementListData]);

  const handleSearch = () => {
    setCurrentPage(1);
    setAppliedSearch(searchText);
  };

  const paginationChange = (event: any) => {
    setCurrentPage(event.selected + 1);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const handleDelete = () => {
    if (!deleteModalData?.id) return;
    deleteRequirement(deleteModalData.id, {
      onSuccess: (res: any) => {
        toast.custom(() => <CustomToast message={res.message} type='success' />, { duration: 4000 });
        setDeleteModalData(null);
        refetchRequirements();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, { duration: 5000 });
      },
    });
  };

  const renderRows = () => {
    if (isRequirementListLoading) {
      return (
        <tr>
          <td colSpan={4}>
            <div className='py-5'>
              <LoadingSpinner size='lg' color='yellow' />
            </div>
          </td>
        </tr>
      );
    }
    if (requirementItems.length > 0) {
      return requirementItems.map((item: any) => (
        <tr key={item.id}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.order}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-900 text-left'>{item.name}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm'>
            <span
              className={
                item.is_active
                  ? 'rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-medium'
                  : 'rounded-full bg-gray-100 text-gray-500 px-3 py-1 text-xs font-medium'
              }
            >
              {item.is_active ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='flex gap-2 justify-center'>
              <SmartButton id='edit-checklist-201-requirement-btn' onClick={() => setEditModalData({ open: true, id: item.id, name: item.name, is_active: item.is_active })}>
                <EditIcon />
              </SmartButton>
              <SmartButton id='delete-checklist-201-requirement-btn' onClick={() => setDeleteModalData({ open: true, id: item.id })}>
                <DeleteIcon />
              </SmartButton>
            </div>
          </td>
        </tr>
      ));
    }
    return (
      <tr>
        <td colSpan={4}>
          <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
          <h4 className='text-center text-gray-300 text-sm mb-4'>Please click add requirement to add one.</h4>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 mb-20 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <BackButton label='Settings' href='/settings' />
        </div>

        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>201 Checklist Templates</h2>
          <p className='text-sm text-gray-500 mt-1'>
            Manage the default requirements that automatically populate every new applicant&apos;s 201 Checklist Monitoring during onboarding.
          </p>
        </div>

        <div className='px-2 md:px-8 lg:px-4 mt-6 flex-1'>
          <div className='flex flex-col lg:flex-row items-left gap-4'>
            <div className='flex gap-2 lg:w-1/3'>
              <div className='flex flex-row w-full items-center gap-2'>
                <input
                  type='text'
                  name='search'
                  id='search'
                  data-tooltip-id='search-tooltip'
                  data-tooltip-content='Search for: Requirement Name'
                  data-tooltip-place='bottom'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                  placeholder='Search ...'
                />
                <button
                  className='bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-100'
                  onClick={handleSearch}
                >
                  <MagnifyingGlassIcon className='h-5 w-5' />
                </button>
              </div>
            </div>
            <div className='flex-1 flex justify-start lg:justify-end'>
              <SmartButton
                id='create-checklist-201-requirement-btn'
                onClick={() => setIsAddModalOpen(true)}
                className='bg-green-500 rounded-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
              >
                + Add Requirement
              </SmartButton>
            </div>
          </div>

          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-300 text-center'>
                  <thead>
                    <tr>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Order</th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 text-left'>Requirement</th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Status</th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Action</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
                </table>
                <hr />
              </div>
            </div>
          </div>
        </div>

        <div className='px-2 md:px-8 lg:px-4 mt-8 mb-0 md:sticky md:bottom-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t'>
          <Pagination
            pagination={pagination}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageSizeChange={pageSizeChange}
            onPageChange={paginationChange}
          />
        </div>
      </div>

      <AddModal isOpen={isAddModalOpen} setIsOpen={setIsAddModalOpen} refetch={refetchRequirements} />

      {editModalData && (
        <EditModal isOpen={editModalData} setIsOpen={setEditModalData} refetch={refetchRequirements} />
      )}

      {deleteModalData?.open && (
        <DeleteModal
          isOpen={deleteModalData}
          setIsOpen={setDeleteModalData}
          onConfirm={handleDelete}
          isLoading={isDeleteLoading}
          customText='this requirement'
        />
      )}

      <Tooltip id='search-tooltip' />
    </>
  );
};

export default Content;
