'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';

import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import { useQueryClient } from '@tanstack/react-query';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import LoadingSpinner from '@/components/LoadingSpinner';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import ProgressModal from '@/components/ProgressModal';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import Pagination from '@/components/Pagination';
import AddSeparationModal from './modals/AddSeparationModal';
import { getSeparationPhase, getSeparationProgress, getPendingTasksCount, PHASE_COLORS, PHASE_BAR_COLORS, SeparationPhase } from './functions/separationPhase';
import useGetSeparationItems from './hooks/useGetSeparationItems';
import useGetSeparationStats from './hooks/useGetSeparationStats';
import useDeleteSeparation from './hooks/useDeleteSeparation';
import usePatchSeparation from './hooks/usePatchSeparation';
import useBulkDeleteSeparations from './hooks/useBulkDeleteSeparations';
import Filter, { FilterGroup, FilterValues } from '@/components/common/Filter';
import { useFilterPersistence } from '@/components/hooks/useFilterPersistence';

import { MagnifyingGlassIcon, UsersIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import EyePassword from '@/svg/EyePassword';

import BackButton from '@/components/BackButton';
import DeleteIcon from '@/svg/DeleteIcon';
import PlaceholderAvatar from '@/components/common/PlaceholderAvatar';

import {
  T_DeleteSepartionModal,
} from '@/types/globals';

import classNames from '@/helpers/classNames';
import { formatDateToLocal } from '@/helpers/date';

// ── Stat card sub-component ────────────────────────────────────────────────────
type StatCardProps = {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  badge?: number;
};

const StatCard = ({ label, value, icon, color, badge }: StatCardProps) => (
  <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4'>
    <div className={classNames('flex items-center justify-center w-12 h-12 rounded-full', color)}>
      {icon}
    </div>
    <div>
      {badge !== undefined && badge > 0 && (
        <p className='text-xs font-semibold text-green-600 mb-0.5'>+{badge} THIS WEEK</p>
      )}
      <p className='text-2xl font-bold text-indigo-dye'>{value}</p>
      <p className='text-sm text-gray-500'>{label}</p>
    </div>
  </div>
);

// ── Progress bar sub-component ─────────────────────────────────────────────────
const ProgressBar = ({ percent, barColor }: { percent: number; barColor: string }) => (
  <div className='w-24 bg-gray-200 rounded-full h-2'>
    <div
      className={classNames('h-2 rounded-full transition-all duration-300', barColor)}
      style={{ width: `${percent}%` }}
    />
  </div>
);

// ── Employee avatar sub-component ─────────────────────────────────────────────
const EmployeeAvatar = ({ photo, firstname, lastname }: { photo?: string; firstname?: string; lastname?: string }) => {
  const [imgError, setImgError] = useState(false);
  const hasPhoto = !!photo && !photo.includes('no-photo.png') && !imgError;

  if (hasPhoto) {
    return (
      <img
        src={photo}
        alt={`${firstname} ${lastname}`}
        className='w-9 h-9 rounded-full object-cover flex-shrink-0'
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <PlaceholderAvatar
      width={36}
      height={36}
      firstName={firstname || ''}
      lastName={lastname || ''}
      className='flex-shrink-0'
    />
  );
};

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [separationItems, setSeparationItems] = useState<any>([]);
  const [itemsFilter, setItemsFilter] = useState<any>({ from: '', to: '', search: '' });
  const [appliedFilter, setAppliedFilter] = useState<any>({ from: '', to: '', search: '' });
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{ totalRecords: number; totalPages: number }>({
    totalPages: 1,
    totalRecords: 0,
  });

  const [filters, setFilters] = useFilterPersistence<FilterValues>('employee-separation', {
    status: ['unfinished'],
  });
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isAddSeparationModalOpen, setIsAddSeparationModalOpen] = useState(false);
  const [isDeleteSepartionModalOpen, setIsDeleteSepartionModalOpen] = useState<T_DeleteSepartionModal | null>(null);

  const [selectedSeparations, setSelectedSeparations] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteConfirmModalOpen, setIsBulkDeleteConfirmModalOpen] = useState<DeleteModalData | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [menuKey, setMenuKey] = useState(0);

  const { mutate } = usePatchSeparation();
  const { mutate: deleteSeparation, isLoading: isDeleteSeparationLoading } = useDeleteSeparation();
  const bulkDeleteMutation = useBulkDeleteSeparations();

  const { data: dataSeparation, isLoading: isGetSeparationLoading, refetch } = useGetSeparationItems({
    ...appliedFilter,
    pageSize,
    currentPage,
    status: filters.status?.join(','),
  });

  const { data: statsData } = useGetSeparationStats();
  const [isSearching, setIsSearching] = useState(false);

  // ── Derived stats (from separation_dashboard view_type — counts only) ────────
  const stats = useMemo(() => ({
    total: statsData?.total ?? 0,
    inProgress: statsData?.in_progress ?? 0,
    completed: statsData?.completed ?? 0,
    pendingThisWeek: statsData?.pending_this_week ?? 0,
    createdThisWeek: statsData?.created_this_week ?? 0,
  }), [statsData]);

  const filterGroups: FilterGroup[] = [
    {
      id: 'status',
      title: 'Separation Status',
      options: [
        { label: 'Unfinished', value: 'unfinished' },
        { label: 'Separated', value: 'separated' },
      ],
      multiSelect: true,
      allowEmpty: false,
    },
  ];

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setIsFilterLoading(true);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (dataSeparation && isFilterLoading) setIsFilterLoading(false);
  }, [dataSeparation, isFilterLoading]);

  useEffect(() => {
    const handleScroll = () => {
      document.body.click();
      setMenuKey(prev => prev + 1);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const setReceived = (id: string, emailType: string) => {
    const loadingKey = `${id}-${emailType}`;
    setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));
    const itemIndex = separationItems.findIndex((item: any) => item.id === id);
    const separationItemsCopy = JSON.parse(JSON.stringify(separationItems));
    const currentDate = new Date();
    separationItemsCopy[itemIndex].id = id;
    separationItemsCopy[itemIndex].actionType = 'received';
    separationItemsCopy[itemIndex].emailType = emailType;
    separationItemsCopy[itemIndex].dateReceived = currentDate;
    if (emailType === 'letters') {
      separationItemsCopy[itemIndex].isLetterReceived = true;
      separationItemsCopy[itemIndex].letterReceivedDate = formatDateToLocal(currentDate.toISOString());
    }
    if (emailType === 'sign documents') {
      separationItemsCopy[itemIndex].isDocumentsReceived = true;
      separationItemsCopy[itemIndex].documentReceivedDate = formatDateToLocal(currentDate.toISOString());
    }
    if (emailType === 'quit claim') {
      separationItemsCopy[itemIndex].isQuitclaimReceived = true;
      separationItemsCopy[itemIndex].quitclaimReceivedDate = formatDateToLocal(currentDate.toISOString());
    }
    mutate(separationItemsCopy[itemIndex], {
      onSuccess: (data: any) => {
        setSeparationItems([...separationItemsCopy]);
        setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
        if (emailType === 'quit claim') queryClient.invalidateQueries(['employeePaginatedSelectCache']);
      },
      onError: (err: any) => {
        setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
        toast.custom(() => <CustomToast message={err} type='error' />, { duration: 7000 });
      },
    });
  };

  const paginationChange = (event: any) => setCurrentPage(event.selected + 1);
  const pageSizeChange = (value: number) => { setCurrentPage(1); setPageSize(value); };

  const handleSearch = () => {
    const dateFrom = Date.parse(itemsFilter.from);
    const dateTo = Date.parse(itemsFilter.to);
    if (dateFrom && !dateTo) return toast.custom(() => <CustomToast message='Invalid date to.' type='error' />, { duration: 5000 });
    if (!dateFrom && dateTo) return toast.custom(() => <CustomToast message='Invalid date from.' type='error' />, { duration: 5000 });
    if (dateFrom && dateTo && dateFrom > dateTo) return toast.custom(() => <CustomToast message='You have entered an invalid date range. Please select again.' type='error' />, { duration: 5000 });
    setCurrentPage(1);
    setIsSearching(true);
    setAppliedFilter({ ...itemsFilter, search: searchText });
  };

  useEffect(() => {
    if (!isGetSeparationLoading && isSearching) setIsSearching(false);
  }, [isGetSeparationLoading, isSearching]);

  useEffect(() => { refetch(); }, []);

  const mapSeparation = (separation: any) => {
    separation['separationDate'] = formatDateToLocal(separation.date_of_separation);
    separation['name'] = separation.name;
    separation['reasonForLeaving'] = separation.reason_of_leaving;
    separation['isLetterSent'] = separation.is_letter_sent;
    separation['isLetterReceived'] = separation.is_letter_received;
    separation['letterReceivedDate'] = formatDateToLocal(separation.letter_received_date);
    separation['letter_attachment'] = separation.letter_attachment;
    separation['letter_attachments'] = separation.letter_attachments || [];
    separation['isDocumentsSent'] = separation.is_documents_sent;
    separation['isDocumentsReceived'] = separation.is_documents_received;
    separation['documentReceivedDate'] = formatDateToLocal(separation.documents_received_date);
    separation['documents_attachment'] = separation.documents_attachment;
    separation['document_attachments'] = separation.document_attachments || [];
    separation['isLastPayReleased'] = separation.is_last_pay_released;
    separation['last_pay_attachment'] = separation.last_pay_attachment;
    separation['last_pay_attachments'] = separation.last_pay_attachments || [];
    separation['isQuitclaimSigned'] = separation.is_quit_claim_signed;
    separation['isQuitclaimReceived'] = separation.is_quit_claim_received;
    separation['quitclaimReceivedDate'] = formatDateToLocal(separation.quit_claim_received_date);
    separation['quit_claim_attachment'] = separation.quit_claim_attachment;
    separation['quitclaim_attachments'] = separation.quitclaim_attachments || [];
    return separation;
  };

  useEffect(() => {
    if (dataSeparation) {
      let items: any[] = [];
      let totalPages = 1;
      let totalRecords = 0;

      if (dataSeparation.records) {
        items = dataSeparation.records.map(mapSeparation);
        totalPages = dataSeparation.total_pages || 1;
        totalRecords = dataSeparation.total_records || items.length;
      } else if (Array.isArray(dataSeparation)) {
        items = dataSeparation.map(mapSeparation);
        totalRecords = items.length;
        totalPages = Math.ceil(totalRecords / pageSize);
      }

      setSeparationItems(items);
      setPagination({ totalPages, totalRecords });
    }
  }, [dataSeparation, pageSize]);


  useEffect(() => {
    if (separationItems) {
      const allSeparationIds = new Set(separationItems.map((s: any) => s.id));
      const allSelected = allSeparationIds.size > 0 && Array.from(allSeparationIds).every((id: any) => selectedSeparations.has(id));
      setSelectAll(allSelected);
    }
  }, [selectedSeparations, separationItems]);

  const handleSeparationSelect = (separationId: number) => {
    setSelectedSeparations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(separationId)) newSet.delete(separationId);
      else newSet.add(separationId);
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (!separationItems) return;
    if (selectAll) setSelectedSeparations(new Set());
    else setSelectedSeparations(new Set(separationItems.map((s: any) => s.id)));
  };

  const handleBulkDelete = () => {
    if (selectedSeparations.size === 0) return;
    setBulkDeleteCount(selectedSeparations.size);
    setIsBulkDeleteConfirmModalOpen({ open: true });
  };

  const confirmBulkDeleteWarning = () => {
    setIsBulkDeleteConfirmModalOpen(null);
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await bulkDeleteMutation.mutateAsync(Array.from(selectedSeparations));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete separations';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
      setIsBulkDeleteModalOpen(false);
    }
  };

  const handleBulkDeleteSuccess = () => {
    toast.custom(() => <CustomToast message={`${bulkDeleteCount} separation(s) deleted successfully.`} type="success" />, { duration: 3000 });
    queryClient.invalidateQueries(['employeePaginatedSelectCache']);
    setSelectedSeparations(new Set());
    setSelectAll(false);
    setBulkDeleteCount(0);
    refetch();
  };

  const renderRows = () => {
    if (isSearching || isGetSeparationLoading || isFilterLoading) {
      return (
        <tr>
          <td colSpan={100}>
            <div className='py-5'><LoadingSpinner size="lg" color="yellow" /></div>
          </td>
        </tr>
      );
    }
    if (filters.status && filters.status.length === 0) {
      return (
        <tr>
          <td colSpan={8}>
            <div className='py-4'><h4 className='text-center text-gray-300 text-sm'>No filter options selected.</h4></div>
          </td>
        </tr>
      );
    }
    if (separationItems && separationItems.length > 0) {
      return separationItems.map((item: any) => {
        const phase = getSeparationPhase(item);
        const progress = getSeparationProgress(item);
        const pending = getPendingTasksCount(item);
        const phaseColor = PHASE_COLORS[phase];
        const barColor = PHASE_BAR_COLORS[phase];

        return (
          <tr key={item.id} className='hover:bg-gray-50 transition-colors'>
            <td className='whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500'>
              <input
                type="checkbox"
                checked={selectedSeparations.has(item.id)}
                onChange={() => handleSeparationSelect(item.id)}
                className="w-4 h-4 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue"
              />
            </td>
            <td className='whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500'>{item.separationDate}</td>
            <td className='whitespace-nowrap px-3 py-4 text-sm'>
              <div className='flex items-center gap-3'>
                <EmployeeAvatar
                  photo={item.photo}
                  firstname={item.name?.split(' ')[0]}
                  lastname={item.name?.split(' ').slice(1).join(' ')}
                />
                <div>
                  <span className='font-medium text-gray-900'>{item.name}</span>
                  {item.position && <p className='text-xs text-gray-400'>{item.position}</p>}
                </div>
              </div>
            </td>
            <td className='whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500'>{item.reasonForLeaving}</td>
            <td className='whitespace-nowrap px-3 py-4 text-center text-sm'>
              <span className={classNames('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', phaseColor)}>
                {phase}
              </span>
            </td>
            <td className='whitespace-nowrap px-3 py-4 text-center text-sm'>
              <div className='flex flex-col items-center gap-1'>
                <ProgressBar percent={progress} barColor={barColor} />
                <span className='text-xs text-gray-400'>{progress}%</span>
              </div>
            </td>
            <td className='whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500'>
              {pending > 0 ? (
                <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700'>
                  {pending} pending
                </span>
              ) : (
                <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700'>
                  Done
                </span>
              )}
            </td>
            <td className='whitespace-nowrap px-3 py-4 text-center text-sm'>
              <div className='flex items-center justify-center gap-2'>
                <button
                  onClick={() => router.push(`/employee-separation/${item.id}`)}
                  className='p-1.5 rounded-md hover:bg-gray-100 text-indigo-dye'
                  data-tooltip-id='view-case-tooltip'
                  data-tooltip-content='View Case'
                  data-tooltip-place='bottom'
                >
                  <EyePassword visible />
                </button>
                <SmartButton
                  id="edit-separation-btn"
                  onClick={() => setIsDeleteSepartionModalOpen({ open: true, id: item.id, name: item.name })}
                  disabled={selectedSeparations.size > 1}
                  className={classNames('p-1.5 rounded-md hover:bg-gray-100', selectedSeparations.size > 1 ? 'opacity-50 cursor-not-allowed' : '')}
                >
                  <DeleteIcon />
                </SmartButton>
              </div>
            </td>
          </tr>
        );
      });
    }
    return (
      <tr>
        <td colSpan={8}>
          <h4 className='text-center text-gray-300 text-sm mt-4'>{`There's no data yet.`}</h4>
          <h4 className='text-center text-gray-300 text-sm mb-4'>Please click create to add separation of employee.</h4>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <BackButton label="Dashboard" onClick={() => router.push('/dashboard')} />
        </div>

        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Employee Resignation/Separation</h2>
        </div>

        {/* Stats Cards */}
        <div className='px-2 md:px-8 lg:px-4 mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4'>
          <StatCard
            label="Total Separations"
            value={stats.total}
            icon={<UsersIcon className='h-6 w-6 text-indigo-600' />}
            color="bg-indigo-50"
            badge={stats.createdThisWeek}
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon={<ClockIcon className='h-6 w-6 text-blue-600' />}
            color="bg-blue-50"
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            icon={<CheckCircleIcon className='h-6 w-6 text-green-600' />}
            color="bg-green-50"
          />
          <StatCard
            label="Pending This Week"
            value={stats.pendingThisWeek}
            icon={<ExclamationTriangleIcon className='h-6 w-6 text-orange-600' />}
            color="bg-orange-50"
          />
        </div>

        {/* Filters & Actions */}
        <div className='px-2 md:px-8 lg:px-4 mt-6 flex-1'>
          <div className={classNames('flex flex-col lg:flex-row items-left gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='flex-none flex flex-col md:flex-row items-left md:items-center gap-2 flex-wrap md:flex-nowrap'>
              <div className='relative flex-1 md:flex-none min-w-[140px] md:min-w-0'>
                <CustomDatePicker
                  id='from-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className='appearance-none block w-full rounded-md py-1.5 px-3 md:pl-3 md:pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 md:placeholder:text-black text-sm leading-6'
                  selected={itemsFilter.from}
                  pickerOnChange={(date: any) => { if (itemsFilter) setItemsFilter({ ...itemsFilter, from: date }); }}
                  inputOnChange={(value: any) => setItemsFilter({ ...itemsFilter, from: value })}
                />
              </div>
              <p className='text-gray-600 text-sm md:text-base self-center'>to</p>
              <div className='relative flex-1 md:flex-none min-w-[140px] md:min-w-0'>
                <CustomDatePicker
                  id='to-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className='appearance-none block w-full rounded-md py-1.5 px-3 md:pl-3 md:pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 md:placeholder:text-black text-sm leading-6'
                  selected={itemsFilter.to}
                  pickerOnChange={(date: any) => { if (itemsFilter) setItemsFilter({ ...itemsFilter, to: date }); if (!itemsFilter) setItemsFilter(date); }}
                  inputOnChange={(value: any) => setItemsFilter({ ...itemsFilter, to: value })}
                  minDate={itemsFilter.from}
                />
              </div>
            </div>
            <div className='flex gap-2 lg:w-1/3'>
              <div className='flex flex-row w-full items-center gap-2'>
                <input
                  type='text'
                  data-tooltip-id='search-tooltip'
                  data-tooltip-content='Search for: Employee Name / Reason of Leaving'
                  data-tooltip-place='bottom'
                  name='search'
                  id='search'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  placeholder='Search ...'
                />
                <button className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100' onClick={handleSearch}>
                  <MagnifyingGlassIcon className='h-5 w-5' />
                </button>
              </div>
            </div>
            <div className='flex-1 flex justify-start lg:justify-end gap-2'>
              <SmartButton
                id='create-separation-btn'
                className='bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                onClick={() => setIsAddSeparationModalOpen(true)}
              >
                CREATE
              </SmartButton>
              <Filter
                filterGroups={filterGroups}
                defaultValues={filters}
                resetValues={{ status: ['unfinished'] }}
                onFilterChange={handleFilterChange}
                buttonId="separation-filter-btn"
                size="small"
              />
            </div>
          </div>

          {selectedSeparations.size > 1 && (
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <SmartButton
                  id="edit-separation-btn"
                  onClick={handleBulkDelete}
                  disabled={bulkDeleteMutation.isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bulkDeleteMutation.isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </div>
                  ) : 'Delete Selected'}
                </SmartButton>
                <span className="text-sm text-gray-700 font-medium">{selectedSeparations.size} selected</span>
              </div>
            </div>
          )}

          <div className={classNames('mt-6 flow-root', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='overflow-x-auto'>
              <table className={classNames('min-w-full divide-y divide-gray-200', separationItems.length === 0 && 'mb-6')}>
                <thead className='bg-gray-50'>
                  <tr>
                    <th scope='col' className='px-3 py-3 text-sm font-semibold text-gray-700'>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        disabled={!separationItems || separationItems.length === 0}
                        className="w-4 h-4 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue disabled:opacity-50"
                      />
                    </th>
                    <th scope='col' className='px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Date</th>
                    <th scope='col' className='px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Employee</th>
                    <th scope='col' className='px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Reason</th>
                    <th scope='col' className='px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Current Phase</th>
                    <th scope='col' className='px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Progress</th>
                    <th scope='col' className='px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Pending</th>
                    <th scope='col' className='px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100 bg-white'>{renderRows()}</tbody>
              </table>
            </div>
            <hr />
          </div>
        </div>

        <div className="px-2 md:px-8 lg:px-4 mt-8 mb-36 md:sticky md:bottom-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t">
          <Pagination
            pagination={pagination}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageSizeChange={pageSizeChange}
            onPageChange={paginationChange}
          />
        </div>
      </div>

      <AddSeparationModal isOpen={isAddSeparationModalOpen} setIsOpen={setIsAddSeparationModalOpen} refetch={refetch} />

      {isDeleteSepartionModalOpen && (
        <DeleteModal
          isOpen={isDeleteSepartionModalOpen}
          setIsOpen={setIsDeleteSepartionModalOpen}
          onConfirm={() => {
            deleteSeparation(isDeleteSepartionModalOpen.id, {
              onSuccess: (data: any) => {
                toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
                queryClient.invalidateQueries(['employeePaginatedSelectCache']);
                setIsDeleteSepartionModalOpen(null);
                refetch();
              },
              onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
              },
            });
          }}
          isLoading={isDeleteSeparationLoading}
        />
      )}
      {isBulkDeleteConfirmModalOpen?.open && (
        <DeleteModal
          isOpen={isBulkDeleteConfirmModalOpen}
          setIsOpen={setIsBulkDeleteConfirmModalOpen}
          onConfirm={confirmBulkDeleteWarning}
          isLoading={false}
          customText={`${bulkDeleteCount} separation${bulkDeleteCount > 1 ? 's' : ''}`}
        />
      )}
      {isBulkDeleteModalOpen && (
        <ProgressModal
          isOpen={isBulkDeleteModalOpen}
          setIsOpen={setIsBulkDeleteModalOpen}
          onConfirm={confirmBulkDelete}
          title={`Deleting ${bulkDeleteCount} separation${bulkDeleteCount > 1 ? 's' : ''}...`}
          isProcessing={bulkDeleteMutation.isLoading}
          onSuccess={handleBulkDeleteSuccess}
        />
      )}

      <Tooltip id='search-tooltip' />
      <Tooltip id='view-case-tooltip' />
    </>
  );
};

export default Content;
