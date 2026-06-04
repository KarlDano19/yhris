'use client';

import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';

import ConfirmModal from '@/components/ConfirmModal';
import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import useApplicantItems from './hooks/useGetApplicantItems';
import useToggleApplicantStatus from './hooks/useToggleApplicantStatus';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import MoreIcon from '@/svg/MoreIcon';

const Content = () => {
  const [clientItems, setClientItems] = useState<any>([]);
  const [searchText, setSearchText] = useState('');
  const [appliedFilter, setAppliedFilter] = useState<any>({ search: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; item: any | null }>({
    isOpen: false,
    item: null,
  });

  const { data: dataApplicant, isLoading: isGetApplicantLoading, refetch } = useApplicantItems(appliedFilter);
  const toggleStatus = useToggleApplicantStatus();

  useEffect(() => {
    if (dataApplicant && !isGetApplicantLoading) {
      dataApplicant.map((item: any) => {
        item['created_at'] = Intl.DateTimeFormat('en-US').format(new Date(item.created_at));
      });
      setClientItems(dataApplicant);
    }
  }, [dataApplicant]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilter]);

  const totalRecords = clientItems.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedItems = clientItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = () => {
    setAppliedFilter({ search: searchText });
  };

  const handleToggle = (item: any) => {
    setConfirmModal({ isOpen: true, item });
  };

  const handleConfirmToggle = () => {
    const item = confirmModal.item;
    if (!item) return;

    const action = item.is_active ? 'disable' : 'enable';
    toggleStatus.mutate(
      { id: item.id, is_active: !item.is_active },
      {
        onSuccess: () => {
          setConfirmModal({ isOpen: false, item: null });
          toast.custom(
            <CustomToast
              message={`Applicant account ${action}d successfully.`}
              type='success'
            />
          );
          refetch();
        },
        onError: (err: any) => {
          setConfirmModal({ isOpen: false, item: null });
          toast.custom(
            <CustomToast
              message={err?.message || `Failed to ${action} applicant account.`}
              type='error'
            />
          );
        },
      }
    );
  };

  const renderRows = () => {
    if (isGetApplicantLoading) {
      return (
        <tr>
          <td colSpan={100}>
            <div className='py-5'>
              <LoadingSpinner size="lg" color="yellow" />
            </div>
          </td>
        </tr>
      );
    }
    if (paginatedItems && paginatedItems.length > 0) {
      return paginatedItems.map((item: any) => (
        <tr key={item.id}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.name}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.email}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.mobile}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.created_at}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm'>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {item.is_active ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm'>
            <button
              onClick={() => handleToggle(item)}
              disabled={toggleStatus.isLoading}
              className={`rounded-md px-3 py-1 text-xs font-semibold text-white shadow-sm disabled:opacity-50 ${
                item.is_active
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {item.is_active ? 'Disable' : 'Enable'}
            </button>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={6}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>{`There's no data yet.`}</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8'>
          <div className='mt-6 flex flex-col lg:flex-row gap-4'>
            <div className='flex-none w-full lg:w-1/2 space-y-4'>
              <h2 className='text-xl font-bold text-indigo-dye'>Applicant Monitoring</h2>
              <div className='relative flex items-center'>
                <input
                  type='text'
                  name='search'
                  id='search'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                  placeholder='Search ...'
                />
                <button
                  className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
                  onClick={handleSearch}
                >
                  <MagnifyingGlassIcon className='h-5 w-5' />
                </button>
                <div className='flex-1 flex justify-end ml-4'>
                  <button
                    className='bg-slate-500 w-max rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none focus:opacity-80 disabled:opacity-50'
                    disabled={true}
                  >
                    Applicant Analytics
                  </button>
                </div>
              </div>
            </div>
            <div className='flex-none w-full lg:w-1/2'>
              <div className='flex justify-between gap-3 px-5 py-5 font-semibold rounded-xl border border-solid border-slate-400 w-full max-w-[318px]'>
                <div className='flex flex-col my-auto text-base tracking-wide text-slate-700'>
                  <div>TOTAL</div>
                  <div className='mt-3.5'>applicant</div>
                </div>
                <div className='justify-center items-center px-16 py-6 text-3xl tracking-wide text-center text-blue-700 bg-indigo-50 rounded-md border border-violet-200 border-solid'>
                  {clientItems.length}
                </div>
                <MoreIcon />
              </div>
            </div>
          </div>
          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-300 text-center'>
                  <thead>
                    <tr>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Applicant
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Email
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Contact
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Registration Date
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Status
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
                </table>
                <hr />
              </div>
            </div>
            <Pagination
              pagination={{ totalPages, totalRecords }}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageSizeChange={(val) => { setPageSize(val); setCurrentPage(1); }}
              onPageChange={({ selected }) => setCurrentPage(selected + 1)}
            />
          </div>
      </div>

      <ConfirmModal
        message={`Are you sure you want to ${confirmModal.item?.is_active ? 'disable' : 'enable'} the account of ${confirmModal.item?.name}?`}
        isOpen={confirmModal.isOpen}
        setIsOpen={(open) => setConfirmModal((prev) => ({ ...prev, isOpen: open }))}
        confirmAction={handleConfirmToggle}
        isLoading={toggleStatus.isLoading}
      />
    </>
  );
};

export default Content;
