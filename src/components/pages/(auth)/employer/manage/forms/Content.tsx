'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';
import DeleteModal from '@/components/DeleteModal';
import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import BackButton from '@/components/BackButton';
import classNames from '@/helpers/classNames';

import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import DuplicateIcon from '@/svg/DuplicateIcon';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

import useGetForms from './hooks/useGetForms';
import useDeleteForm from './hooks/useDeleteForm';
import useDuplicateForm from './hooks/useDuplicateForm';
import FormDistributionModal from './modals/FormDistributionModal';

import { T_HRForm } from '@/types/form';

type PaginationState = {
  totalRecords: number;
  totalPages: number;
};

type DeleteModalData = {
  id: number;
  open: boolean;
};

const Content = () => {
  const router = useRouter();

  const [formItems, setFormItems] = useState<T_HRForm[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationState>({ totalPages: 1, totalRecords: 0 });

  const [pendingFilter, setPendingFilter] = useState({ from: '', to: '', search: '' });
  const [appliedFilter, setAppliedFilter] = useState({ from: '', to: '', search: '' });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<DeleteModalData | null>(null);
  const [distributeFormId, setDistributeFormId] = useState<number | null>(null);

  const { data: formsData, isLoading, refetch } = useGetForms({
    ...appliedFilter,
    currentPage,
    pageSize,
  });

  const { mutate: deleteForm, isLoading: isDeleting } = useDeleteForm();
  const { mutate: duplicateForm } = useDuplicateForm();

  useEffect(() => {
    if (formsData?.data?.records) {
      setFormItems(formsData.data.records);
      setPagination({
        totalPages: formsData.data.total_pages || 1,
        totalRecords: formsData.data.total_records || 0,
      });
    } else {
      setFormItems([]);
      setPagination({ totalPages: 1, totalRecords: 0 });
    }
  }, [formsData]);

  const handleSearch = () => {
    setCurrentPage(1);
    setAppliedFilter({ ...pendingFilter });
  };

  const paginationChange = (event: any) => {
    setCurrentPage(event.selected + 1);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const handleDuplicate = (formId: number) => {
    duplicateForm(formId, {
      onSuccess: () => {
        toast.custom(() => <CustomToast message='Form duplicated successfully.' type='success' />, { duration: 4000 });
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err?.message ?? 'Failed to duplicate form.'} type='error' />, { duration: 4000 });
      },
    });
  };

  const handleEdit = (form: T_HRForm) => {
    if (!form.can_edit) {
      toast.custom(() => (
        <CustomToast message='This form has active distributions and cannot be edited. Duplicate it first.' type='info' />
      ), { duration: 4000 });
      return;
    }
    router.push(`/manage/forms/${form.id}`);
  };

  const renderRows = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={5}>
            <div className='py-5'>
              <LoadingSpinner size='lg' color='yellow' />
            </div>
          </td>
        </tr>
      );
    }

    if (formItems.length > 0) {
      return formItems.map((form) => (
        <tr key={form.id} className='cursor-pointer hover:bg-gray-50' onClick={() => router.push(`/manage/forms/${form.id}`)}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-left'>
            <div className='font-medium text-gray-800'>{form.title}</div>
            {!form.can_edit && (
              <span className='inline-block mt-0.5 rounded-full bg-yellow-50 px-2 py-0.5 text-xs text-yellow-700 ring-1 ring-yellow-200'>
                Distributed — read only
              </span>
            )}
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            {form.is_anonymous ? 'Yes' : 'No'}
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            {form.response_count}
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            {new Date(form.created_at).toLocaleDateString()}
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='flex items-center justify-center space-x-2' onClick={(e) => e.stopPropagation()}>
              <SmartButton
                id='distribute-form-btn'
                onClick={() => setDistributeFormId(form.id)}
                title='Distribute form'
              >
                <div className='w-[39px] h-[39px] flex items-center justify-center rounded border border-[#3d6cee9f]'>
                  <Image
                    src='/assets/send-icon.png'
                    width={20}
                    height={20}
                    alt='distribute'
                    className='max-w-[20px] max-h-[20px]'
                  />
                </div>
              </SmartButton>
              {form.can_edit ? (
                <SmartButton
                  id='edit-form-btn'
                  onClick={() => handleEdit(form)}
                >
                  <EditIcon />
                </SmartButton>
              ) : (
                <SmartButton
                  id='duplicate-form-btn'
                  onClick={() => handleDuplicate(form.id)}
                  title='Duplicate form'
                >
                  <DuplicateIcon />
                </SmartButton>
              )}
              <SmartButton
                id='delete-form-btn'
                onClick={() => setIsDeleteModalOpen({ id: form.id, open: true })}
              >
                <DeleteIcon />
              </SmartButton>
            </div>
          </td>
        </tr>
      ));
    }

    return (
      <tr>
        <td colSpan={5}>
          <div className='flex flex-col justify-center items-center py-4'>
            <p className='text-gray-300 text-sm'>There&apos;s no data found.</p>
            <p className='text-gray-300 text-sm mt-2'>
              Please click{' '}
              <SmartButton
                id='create-form-btn'
                onClick={() => router.push('/manage/forms/new')}
                className='text-green-500 hover:underline font-semibold underline'
              >
                create
              </SmartButton>
              {' '}to add a form.
            </p>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 mb-20 pb-56 md:pb-0 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <BackButton label='Manage' onClick={() => router.push('/manage')} />
        </div>

        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Forms</h2>
        </div>

        <div className='px-2 md:px-8 lg:px-4 mt-6 flex-1'>
          {/* Filter Row */}
          <div className='flex flex-col lg:flex-row items-left gap-4'>
            {/* Date Range */}
            <div className='flex-none flex flex-col md:flex-row items-left md:items-center gap-2 flex-wrap md:flex-nowrap'>
              <div className='relative flex-1 md:flex-none min-w-[140px] md:min-w-0'>
                <CustomDatePicker
                  id='forms-from-datepicker'
                  placeholder='mm/dd/yyyy'
                  className='appearance-none block w-full rounded-md py-1.5 px-3 md:pl-3 md:pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm leading-6'
                  selected={pendingFilter.from}
                  pickerOnChange={(date: any) => setPendingFilter({ ...pendingFilter, from: date })}
                  inputOnChange={(value: any) => setPendingFilter({ ...pendingFilter, from: value })}
                />
              </div>
              <p className='text-gray-600 text-sm self-center'>to</p>
              <div className='relative flex-1 md:flex-none min-w-[140px] md:min-w-0'>
                <CustomDatePicker
                  id='forms-to-datepicker'
                  placeholder='mm/dd/yyyy'
                  className='appearance-none block w-full rounded-md py-1.5 px-3 md:pl-3 md:pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm leading-6'
                  selected={pendingFilter.to}
                  pickerOnChange={(date: any) => setPendingFilter({ ...pendingFilter, to: date })}
                  inputOnChange={(value: any) => setPendingFilter({ ...pendingFilter, to: value })}
                  minDate={pendingFilter.from}
                />
              </div>
            </div>

            {/* Search */}
            <div className='flex gap-2 lg:w-1/3'>
              <div className='flex flex-row w-full items-center gap-2'>
                <input
                  type='text'
                  placeholder='Search forms...'
                  className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  value={pendingFilter.search}
                  onChange={(e) => setPendingFilter({ ...pendingFilter, search: e.target.value })}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                />
                <button
                  className='bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-100'
                  onClick={handleSearch}
                >
                  <MagnifyingGlassIcon className='h-5 w-5' />
                </button>
              </div>
            </div>

            {/* Create Button */}
            <div className='flex-1 flex justify-start lg:justify-end items-center gap-2'>
              <SmartButton
                id='create-form-btn'
                onClick={() => router.push('/manage/forms/new')}
                className='bg-green-500 rounded-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
              >
                CREATE
              </SmartButton>
            </div>
          </div>

          {/* Table */}
          <div className={classNames('mt-8 flow-root')}>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-300 text-center'>
                  <thead>
                    <tr>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 text-left'>
                        Form Title
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Anonymous
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Responses
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Created
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 bg-white'>
                    {renderRows()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Pagination */}
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

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          onConfirm={() => {
            deleteForm(isDeleteModalOpen.id, {
              onSuccess: () => {
                toast.custom(() => <CustomToast message='Form deleted successfully.' type='success' />, { duration: 4000 });
                setIsDeleteModalOpen(null);
                refetch();
              },
              onError: (err: any) => {
                toast.custom(() => <CustomToast message={err?.message ?? 'Failed to delete form.'} type='error' />, { duration: 4000 });
              },
            });
          }}
          isLoading={isDeleting}
        />
      )}

      {/* Distribution Modal */}
      {distributeFormId && (
        <FormDistributionModal
          formId={distributeFormId}
          isOpen={!!distributeFormId}
          setIsOpen={(open) => { if (!open) setDistributeFormId(null); }}
          onSuccess={() => { setDistributeFormId(null); refetch(); }}
        />
      )}
    </>
  );
};

export default Content;
