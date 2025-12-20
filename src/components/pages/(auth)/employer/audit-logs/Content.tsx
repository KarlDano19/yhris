'use client';

import React, { useEffect, useMemo, useState, Fragment, useRef } from 'react';

import Link from 'next/link';

import { Menu, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import ViewAuditLogDetails from './modals/ViewAuditLogDetails';
import useGetAuditLogsItems from './hooks/useGetAuditLogsItems';
import useGetAuditLogFilters from './hooks/useGetAuditLogFilters';

import { ArrowLeftIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

import classNames from '@/helpers/classNames';
import SelectChevronDown from '@/svg/SelectChevronDown';
import { useFilterPersistence } from '@/components/hooks/useFilterPersistence';
import { formatDateTimeSeparate } from '@/helpers/date';

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_ModalData = {
  id: number;
  open: boolean;
};

type AuditLogFilterValues = {
  action: string;
  user: string;
  module: string;
};

const defaultAdvancedFilter: AuditLogFilterValues = {
  action: 'ALL',
  user: 'ALL',
  module: 'ALL',
};

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [persistedAdvancedFilter, setPersistedAdvancedFilter] = useFilterPersistence<AuditLogFilterValues>(
    'audit-logs-advanced-filter',
    defaultAdvancedFilter
  );
  const [auditLogsData, setAuditLogsData] = useState<any>([]);
  const [openModal, setOpenModal] = useState<T_ModalData | null>(null);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPages: 1,
    totalRecords: 0,
  });
  const [itemsFilter, setItemsFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
    action: persistedAdvancedFilter.action === 'ALL' ? '' : persistedAdvancedFilter.action,
    module: persistedAdvancedFilter.module === 'ALL' ? '' : persistedAdvancedFilter.module,
    user: persistedAdvancedFilter.user === 'ALL' ? '' : persistedAdvancedFilter.user,
  });
  const [advancedFilter, setAdvancedFilter] = useState<AuditLogFilterValues>(persistedAdvancedFilter);
  const [filterDraft, setFilterDraft] = useState<AuditLogFilterValues>(persistedAdvancedFilter);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterPopoverRef = useRef<HTMLDivElement | null>(null);
  const {
    data: auditLogsItems,
    isLoading: isAuditLogsLoading,
    isFetching: isAuditLogsFetching,
    refetch: auditLogsRefetch,
  } = useGetAuditLogsItems({ ...itemsFilter, pageSize: pageSize, currentPage: currentPage });
  const {
    data: auditFilterOptions,
    isFetching: isAuditFilterFetching,
    refetch: refetchAuditFilterOptions,
  } = useGetAuditLogFilters({ enabled: false });

  const actionOptions = useMemo(
    () => auditFilterOptions?.actions ?? [],
    [auditFilterOptions]
  );

  const userOptions = useMemo(
    () =>
      (auditFilterOptions?.users ?? []).map((user: any) => ({
        value: String(user.id),
        label: user.name ? `${user.name} (${user.email})` : user.email ?? 'Unknown User',
      })),
    [auditFilterOptions]
  );

  const moduleOptions = useMemo(
    () => auditFilterOptions?.modules ?? [],
    [auditFilterOptions]
  );

  const actionOptionsWithAll = useMemo(
    () => [{ value: 'ALL', label: 'All Actions' }, ...actionOptions],
    [actionOptions]
  );
  const moduleOptionsWithAll = useMemo(
    () => [{ value: 'ALL', label: 'All Modules' }, ...moduleOptions],
    [moduleOptions]
  );

  const userOptionsWithAll = useMemo(
    () => [{ value: 'ALL', label: 'All Users' }, ...userOptions],
    [userOptions]
  );


  const menuOptions = [
    {
      name: 'Export',
    }
  ];

  useEffect(() => {
    if (auditLogsItems) {
      setAuditLogsData(auditLogsItems.records);
      setPagination({
        totalPages: auditLogsItems.total_pages,
        totalRecords: auditLogsItems.total_records,
      });
    }
  }, [auditLogsItems]);


  useEffect(() => {
    if (!isAuditLogsLoading && !isAuditLogsFetching && isSearching) {
      setIsSearching(false);
    }
  }, [isAuditLogsLoading, isAuditLogsFetching, isSearching]);

  const triggerRefetch = () => {
    setTimeout(() => {
      auditLogsRefetch();
    }, 0);
  };

  const handleSearch = () => {
    const dateFrom = Date.parse(itemsFilter.from);
    const dateTo = Date.parse(itemsFilter.to);

    if (dateFrom && !dateTo) {
      return toast.custom(() => <CustomToast message='Invalid date to.' type='error' />, {
        duration: 5000,
      });
    }
    if (!dateFrom && dateTo) {
      return toast.custom(() => <CustomToast message='Invalid date from.' type='error' />, {
        duration: 5000,
      });
    }
    if (dateFrom > dateTo) {
      return toast.custom(
        () => <CustomToast message='You have entered an invalid date range. Please select again.' type='error' />,
        {
          duration: 5000,
        }
      );
    }
    setCurrentPage(1);
    setIsSearching(true);
    triggerRefetch();
  };

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const handleFilterOpenChange = (value: boolean) => {
    if (value && !auditFilterOptions) {
      refetchAuditFilterOptions();
    }
    setIsFilterOpen(value);
  };

  useEffect(() => {
    if (isFilterOpen) {
      setFilterDraft(advancedFilter);
    }
  }, [isFilterOpen, advancedFilter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isFilterOpen && filterPopoverRef.current && !filterPopoverRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);

  useEffect(() => {
    setAdvancedFilter((prev) => {
      if (
        prev.module === persistedAdvancedFilter.module &&
        prev.user === persistedAdvancedFilter.user &&
        prev.action === persistedAdvancedFilter.action
      ) {
        return prev;
      }
      return persistedAdvancedFilter;
    });

    setFilterDraft(persistedAdvancedFilter);

    setItemsFilter((prev: any) => {
      const normalizedAction = persistedAdvancedFilter.action === 'ALL' ? '' : persistedAdvancedFilter.action;
      const normalizedModule = persistedAdvancedFilter.module === 'ALL' ? '' : persistedAdvancedFilter.module;
      const normalizedUser = persistedAdvancedFilter.user === 'ALL' ? '' : persistedAdvancedFilter.user;
      if (
        prev.module === normalizedModule &&
        prev.user === normalizedUser &&
        prev.action === normalizedAction
      ) {
        return prev;
      }
      return {
        ...prev,
        action: normalizedAction,
        module: normalizedModule,
        user: normalizedUser,
      };
    });
  }, [persistedAdvancedFilter]);

  const handleAdvancedFilterApply = (values: AuditLogFilterValues) => {
    const normalizedAction = values.action === 'ALL' ? '' : values.action;
    const normalizedModule = values.module === 'ALL' ? '' : values.module;
    const normalizedUser = values.user === 'ALL' ? '' : values.user;
    setAdvancedFilter(values);
    setPersistedAdvancedFilter(values);
    setItemsFilter((prev: any) => ({
      ...prev,
      action: normalizedAction,
      module: normalizedModule,
      user: normalizedUser,
    }));
    setCurrentPage(1);
    setIsSearching(true);
    triggerRefetch();
  };

  const renderRows = () => {
    if (!hasActiveSubscription) {
      return (
        <tr>
          <td colSpan={100}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>This feature is not available for your subscription.</h4>
          </td>
        </tr>
      );
    }

    if (isSearching || isAuditLogsLoading || isAuditLogsFetching) {
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
    if (auditLogsData && auditLogsData.length > 0) {
      return auditLogsData.map((item: any) => (
        <tr key={item.id} className='cursor-pointer hover:bg-gray-100' onClick={() => setOpenModal({ id: item.id, open: true })}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.id}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 grid'>{formatDateTimeSeparate(item.created_at).formattedDate} <span>{formatDateTimeSeparate(item.created_at).formattedTime}</span></td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.action.toUpperCase()}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.email}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.model_name}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-green-500'>Success</td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={7}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 pb-56 md:pb-0 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <Link href='/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Dashboard</h4>
          </Link>
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Audit Logs</h2>
        </div>

        {/* Content Section with flex-1 */}
        <div className='px-2 md:px-8 lg:px-4 mt-6 flex-1'>
          <div className={classNames('flex flex-col lg:flex-row items-left gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='flex-none flex flex-col md:flex-row items-left md:items-center gap-2 flex-wrap md:flex-nowrap'>
              <div className='relative flex-1 md:flex-none min-w-[140px] md:min-w-0'>
                <CustomDatePicker
                  id='from-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className='appearance-none block w-full rounded-md py-1.5 px-3 md:pl-3 md:pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 md:placeholder:text-black text-sm leading-6'
                  selected={itemsFilter.from}
                  pickerOnChange={(date: any) => {
                    if (itemsFilter) setItemsFilter({ ...itemsFilter, from: date });
                  }}
                  inputOnChange={(value: any) => {
                    setItemsFilter({
                      ...itemsFilter,
                      from: value,
                    });
                  }}
                />
              </div>
              <p className='text-gray-600 text-sm md:text-base self-center'>to</p>
              <div className='relative flex-1 md:flex-none min-w-[140px] md:min-w-0'>
                <CustomDatePicker
                  id='to-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className='appearance-none block w-full rounded-md py-1.5 px-3 md:pl-3 md:pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 md:placeholder:text-black text-sm leading-6'
                  selected={itemsFilter.to}
                  pickerOnChange={(date: any) => {
                    if (itemsFilter) setItemsFilter({ ...itemsFilter, to: date });
                    if (!itemsFilter) setItemsFilter(date);
                  }}
                  inputOnChange={(value: any) => {
                    setItemsFilter({
                      ...itemsFilter,
                      to: value,
                    });
                  }}
                  minDate={itemsFilter.from}
                />
              </div>
            </div>
            <div className='flex gap-2 lg:w-1/3'>
              <div className='flex flex-row w-full items-center gap-2'>
                <input
                  type='text'
                  name='search'
                  id='search'
                  data-tooltip-id='search-tooltip'
                  data-tooltip-content='Search for: User, Module'
                  data-tooltip-place='bottom'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  value={itemsFilter.search}
                  onChange={(e) => setItemsFilter({ ...itemsFilter, search: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  placeholder='Search ...'
                />
                <button
                  className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
                  onClick={handleSearch}
                >
                  <MagnifyingGlassIcon className='h-5 w-5' />
                </button>
              </div>
            </div>
            <div className='flex-1 flex justify-end'>
              <div className='relative' ref={filterPopoverRef}>
                <button
                  className='border border-blue-600 rounded-l-md py-2 px-5 text-blue-600 text-sm font-semibold hover:shadow-md focus:shadow-none disabled:opacity-50 bg-white flex items-center gap-2'
                  onClick={() => handleFilterOpenChange(!isFilterOpen)}
                  disabled={isAuditFilterFetching}
                >
                  Advance Filter
                </button>
                {isFilterOpen && (
                  <div className='absolute right-0 mt-3 w-[320px] rounded-xl border border-gray-200 bg-white shadow-xl z-40 p-4 space-y-4'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-800 mb-1'>Action</label>
                      <div className='relative'>
                        <select
                          value={
                            actionOptionsWithAll.some((opt) => opt.value === filterDraft.action)
                              ? filterDraft.action
                              : 'ALL'
                          }
                          onChange={(e) => setFilterDraft((prev) => ({ ...prev, action: e.target.value }))}
                          className='truncate w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 pr-9 text-sm text-gray-700 focus:border-[#355fd0] outline-none disabled:opacity-60'
                          disabled={isAuditFilterFetching}
                        >
                          {actionOptionsWithAll.map((option) => (
                            <option key={`action-${option.value}`} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'>
                          <SelectChevronDown />
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-800 mb-1'>User</label>
                      <div className='relative'>
                        <select
                          value={
                            userOptionsWithAll.some((opt) => opt.value === filterDraft.user)
                              ? filterDraft.user
                              : 'ALL'
                          }
                          onChange={(e) => setFilterDraft((prev) => ({ ...prev, user: e.target.value }))}
                          className='truncate w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 pr-9 text-sm text-gray-700 focus:border-[#355fd0] outline-none disabled:opacity-60'
                          disabled={isAuditFilterFetching}
                        >
                          {userOptionsWithAll.map((option) => (
                            <option key={`user-${option.value}`} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'>
                          <SelectChevronDown />
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-800 mb-1'>Module</label>
                      <div className='relative'>
                        <select
                          value={
                            moduleOptionsWithAll.some((opt) => opt.value === filterDraft.module)
                              ? filterDraft.module
                              : 'ALL'
                          }
                          onChange={(e) => setFilterDraft((prev) => ({ ...prev, module: e.target.value }))}
                          className='truncate w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 pr-9 text-sm text-gray-700 focus:border-[#355fd0] outline-none disabled:opacity-60'
                          disabled={isAuditFilterFetching}
                        >
                          {moduleOptionsWithAll.map((option) => (
                            <option key={`module-${option.value}`} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'>
                          <SelectChevronDown />
                        </span>
                      </div>
                    </div>
                    <div className='pt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                      <button
                        onClick={() => setFilterDraft({ action: 'ALL', user: 'ALL', module: 'ALL' })}
                        className='rounded-lg border border-[#355fd0] bg-white px-4 py-1.5 text-sm font-medium text-[#355fd0] hover:bg-[#355fd0]/10'
                        disabled={isAuditFilterFetching}
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => {
                          handleAdvancedFilterApply(filterDraft);
                          setIsFilterOpen(false);
                        }}
                        className='rounded-lg bg-[#355fd0] px-5 py-1.5 text-sm font-semibold text-white hover:bg-[#355fd0]/90 disabled:opacity-60'
                        disabled={isAuditFilterFetching}
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Menu as='div' className='relative'>
                <Menu.Button className='border border-blue-600 py-2 px-3 rounded-r-md text-blue-600 text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'>
                  <span className='sr-only'>Open options</span>
                  <div className='flex gap-4'>
                    <ChevronDownIcon className='flex-none h-5 w-5' aria-hidden='true' />
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items className='absolute right-0 z-10 mt-2 w-[8.6rem] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <div className='py-1'>
                      {menuOptions.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <span
                              className={classNames(
                                'block px-4 py-2 text-sm cursor-pointer text-center',
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              )}
                            >
                              {item.name}
                            </span>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-300 text-center'>
                  <thead>
                    <tr>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Unique No.
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date and Time
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Action
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        User
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Module
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Status
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
      {openModal && (
        <ViewAuditLogDetails
          isOpen={openModal}
          setIsOpen={setOpenModal}
          refetch={auditLogsRefetch}
        />
      )}

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Content;
