'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import CreateThirdPartyIntegrationModal from './modals/CreateThirdPartyIntegrationModal';
import useGetThirdPartyIntegrationItems from './hooks/useGetThirdPartyIntegrationItems';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import classNames from '@/helpers/classNames';
import { formatDateToLocal } from '@/helpers/date';

function Content({ hasActiveSubscription }: { hasActiveSubscription: boolean }) {
  const broadcastChannel = new BroadcastChannel('settings-integration-channel');
  const [itemsFilter, setItemsFilter] = useState<any>({
    search: '',
  });
  const [appliedFilter, setAppliedFilter] = useState<any>({
    search: '',
  });
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    totalRecords: number;
    totalPages: number;
  }>({
    totalPages: 1,
    totalRecords: 0,
  });
  const [thirdPartyIntegrationItems, setThirdPartyIntegrationItems] = useState<any>([]);
  const [isCreateThirdPartyIntegrationModalOpen, setIsCreateThirdPartyIntegrationModalOpen] = useState(false);
  const {
    data: dataThirdPartyIntegration,
    isLoading: isGetThirdPartyIntegrationLoading,
    refetch: refetchThirdPartyIntegration,
  } = useGetThirdPartyIntegrationItems({
    ...appliedFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setAppliedFilter({
      ...itemsFilter,
      search: searchText
    });
  };

  useEffect(() => {
    refetchThirdPartyIntegration();
  }, []);

  useEffect(() => {
    if (dataThirdPartyIntegration) {
      let items = [];
      let totalPages = 1;
      let totalRecords = 0;

      // Handle paginated response structure
      if (dataThirdPartyIntegration.records) {
        items = dataThirdPartyIntegration.records.map((item: any) => {
          item['created_at'] = formatDateToLocal(item.created_at);
          return item;
        });
        totalPages = dataThirdPartyIntegration.total_pages || 1;
        totalRecords = dataThirdPartyIntegration.total_records || items.length;
      } 
      // Handle array response structure (no pagination from backend)
      else if (Array.isArray(dataThirdPartyIntegration)) {
        items = dataThirdPartyIntegration.map((item: any) => {
          item['created_at'] = formatDateToLocal(item.created_at);
          return item;
        });
        
        // Calculate pagination locally if backend doesn't support it
        totalRecords = items.length;
        totalPages = Math.ceil(totalRecords / pageSize);
      }

      setThirdPartyIntegrationItems(items);
      setPagination({
        totalPages,
        totalRecords
      });
    }
  }, [dataThirdPartyIntegration, pageSize]);

  useEffect(() => {
    broadcastChannel.onmessage = (event) => {
      if (event.data.isGranted) {
        refetchThirdPartyIntegration();
      }
    };
    return () => {
      broadcastChannel.close();
    };
  }, []);

  const renderRows = () => {
    if (isGetThirdPartyIntegrationLoading) {
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
    if (thirdPartyIntegrationItems && thirdPartyIntegrationItems.length > 0) {
      return thirdPartyIntegrationItems.map((item: any) => (
        <tr key={item.id}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.created_at}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.email}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.provider}</td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={7}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>{`There's no data yet.`}</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>Please click create to add Third Party Platform.</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 mb-20 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <Link href='/settings/general-settings' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>General Settings</h4>
          </Link>
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Third Party Platform</h2>
        </div>

        {/* Content Section with flex-1 */}
        <div className='px-2 md:px-8 lg:px-4 mt-6 flex-1'>
          <div className={classNames('flex flex-col lg:flex-row items-left gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='flex gap-2 lg:w-1/3 pr-5 md:pr-16'>
              <div className='flex-none w-11/12 lg:w-full'>
                <div className='relative flex items-center'>
                  <input
                  type='text'
                  name='search'
                  id='search'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  placeholder='Search ...'
                />
              </div>
            </div>
            <button
              className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
              onClick={handleSearch}
            >
                <MagnifyingGlassIcon className='h-5 w-5' />
              </button>
            </div>
            <div className='flex-1 flex justify-start lg:justify-end'>
              <button
                className='bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                onClick={() => setIsCreateThirdPartyIntegrationModalOpen(true)}
                disabled={false}
              >
                CREATE
              </button>
            </div>
          </div>
          
          <div className={classNames('mt-8 flow-root', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-300 text-center'>
                  <thead>
                    <tr>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date Created
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Email
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Provider
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
                </table>
                <hr />
              </div>
            </div>
          </div>
        </div>
        
        {/* Sticky Pagination */}
        <div className="px-2 md:px-8 lg:px-4 mt-8 mb-0 md:sticky md:bottom-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t">
          <Pagination
            pagination={pagination}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageSizeChange={pageSizeChange}
            onPageChange={paginationChange}
          />
        </div>
      </div>
      
      <CreateThirdPartyIntegrationModal
        isOpen={isCreateThirdPartyIntegrationModalOpen}
        setIsOpen={setIsCreateThirdPartyIntegrationModalOpen}
      />
    </>
  );
}

export default Content;
