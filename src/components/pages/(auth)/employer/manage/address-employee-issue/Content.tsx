'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import Pagination from '@/components/Pagination';
import useGetDepartmentItems from '@/components/hooks/useGetDepartmentItems';
import useGetEmployeeItems from '@/components/hooks/useGetEmployeeItems';
import useGetPositionItems from '@/components/hooks/useGetPositionItems';
import useGetEmployeeIssueItems from './hooks/useGetEmployeeIssueItems';
import usePatchEmployeeIssueItems from './hooks/usePatchEmployeeIssueItems';
import UploadEmployeeIssueAttachmentModal from './modals/UploadNTEAttachmentModal';
import NTEAttachmentViewModal from './modals/NTEAttachmentViewModal';
import UploadDecisionAttachmentModal from './modals/UploadDecisionAttachment';
import DecisionAttachmentViewModal from './modals/DecisionSummaryViewModal';
import IncidentReportModal from './modals/IncidentReportModal';
import InvestigationReportDetailsModal from './modals/InvestigationReportDetailsModal';
import SendNTEModal from './modals/SendNTEModal';
import SendNTE from './SendNTE';
import Investigation from './Investigation';
import InvestigationModal from './modals/InvestigationModal';
import SendDecision from './SendDecision';
import SendDecisionModal from './modals/SendDecisionModal';

import {
  T_SendNTEModal,
  T_SendDecisionModal,
  T_InvestigationModal,
  T_InvestigationReportDetailsModal,
  T_UploadEmployeeIssueAttachmentModal,
  T_NTEAttachmentViewModal,
  T_DecisionAttachmentViewModal,
} from '@/types/globals';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import classNames from '@/helpers/classNames';

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [employeeIssueItems, setEmployeeIssueItems] = useState<any>([]);
  const [departmentItems, setDepartmentItems] = useState<any>([]);
  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const [positionItems, setPositionItems] = useState<any>([]);
  const [itemsFilter, setItemsFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });
  const [appliedFilter, setAppliedFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    totalRecords: number;
    totalPages: number;
  }>({
    totalPages: 1,
    totalRecords: 0,
  });
  const [isIncidentReportModalOpen, setIsIncidentReportModalOpen] = useState(false);
  const [isSendNTEModalOpen, setIsSendNTEModalOpen] = useState<T_SendNTEModal | null>(null);
  const [isInvestigateModalOpen, setIsInvestigateModalOpen] = useState<T_InvestigationModal | null>(null);
  const [isInvestigationReportDetailsModalOpen, setInvestigationReportDetailsModalOpen] =
    useState<T_InvestigationReportDetailsModal | null>(null);
  const [isNTEAttachmentViewModalOpen, setNTEAttachmentViewModalOpen] = useState<T_NTEAttachmentViewModal | null>(null);
  const [isUploadEmployeeIssueAttachmentModalOpen, setIsUploadEmployeeIssueAttachmentModalOpen] =
    useState<T_UploadEmployeeIssueAttachmentModal | null>(null);
  const [isSendDecisionModalOpen, setIsSendDecisionModalOpen] = useState<T_SendDecisionModal | null>(null);
  const [isDecisionAttachmentViewModalOpen, setIsDecisionAttachmentViewModalOpen] =
    useState<T_DecisionAttachmentViewModal | null>(null);
  const [isUploadDecisionAttachmentModalOpen, setIsUploadDecisionAttachmentModalOpen] =
    useState<T_DecisionAttachmentViewModal | null>(null);
  const { mutate, isLoading } = usePatchEmployeeIssueItems();
  const {
    data: dataEmployeeIssues,
    isLoading: isGetEmployeeIssuesLoading,
    refetch,
  } = useGetEmployeeIssueItems({
    ...appliedFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });
  const { data: dataDepartment } = useGetDepartmentItems();
  const { data: dataEmployee } = useGetEmployeeItems();
  const { data: dataPosition } = useGetPositionItems();
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['userRightsCache']) as { state: { data: any } | undefined };
  const [isSearching, setIsSearching] = useState(false);
  const [isRedirectingToDocumentGenerator, setIsRedirectingToDocumentGenerator] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const openNteModal = searchParams.get('openNteModal');
    const employeeId = searchParams.get('employeeId');
    if (openNteModal === 'true' && employeeId) {
      setIsSendNTEModalOpen({
        id: Number(employeeId),
      });
      // Remove the query params from the URL
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('openNteModal');
      newParams.delete('employeeId');
      router.replace(`/manage/address-employee-issue${newParams.toString() ? '?' + newParams.toString() : ''}`);
    }
  }, [searchParams, router]);

  const setReleased = (id: string, emailType: string) => {
    const itemIndex = employeeIssueItems.findIndex((item: any) => item.id === id);
    const employeeIssueItemsCopy = JSON.parse(JSON.stringify(employeeIssueItems));
    const currentDate = new Date();
    employeeIssueItemsCopy[itemIndex].id = id;
    employeeIssueItemsCopy[itemIndex].actionType = 'received';
    employeeIssueItemsCopy[itemIndex].emailType = emailType;
    employeeIssueItemsCopy[itemIndex].dateReceived = currentDate;
    if (emailType === 'nte') {
      employeeIssueItemsCopy[itemIndex].isNTEReceived = true;
      employeeIssueItemsCopy[itemIndex].incidentReceivedDate = new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }).format(currentDate);
    }
    if (emailType === 'decision') {
      employeeIssueItemsCopy[itemIndex].isDecisionReceived = true;
      employeeIssueItemsCopy[itemIndex].decisionReceivedDate = new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }).format(currentDate);
    }
    const callbackReq = {
      onSuccess: (data: any) => {
        setEmployeeIssueItems([...employeeIssueItemsCopy]);
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate(employeeIssueItemsCopy[itemIndex], callbackReq);
  };

  useEffect(() => {
    if (dataDepartment) {
      setDepartmentItems(dataDepartment);
    }
    if (dataEmployee) {
      setEmployeeItems(dataEmployee);
    }
    if (dataPosition) {
      setPositionItems(dataPosition);
    }
    if (dataEmployeeIssues) {
      let items = [];
      let totalPages = 1;
      let totalRecords = 0;

      // Handle paginated response structure
      if (dataEmployeeIssues.records) {
        items = dataEmployeeIssues.records.map((employeeIssue: any) => {
          employeeIssue.incidentDate = Intl.DateTimeFormat('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          }).format(new Date(employeeIssue.incident_date));
          employeeIssue['isNTESent'] = employeeIssue.is_nte_sent;
          employeeIssue['isNTEReceived'] = employeeIssue.is_nte_received;
          employeeIssue['incidentReceivedDate'] =
            employeeIssue.incident_received_date &&
            new Intl.DateTimeFormat('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            }).format(new Date(employeeIssue.incident_received_date));
          employeeIssue['isInvestigated'] = employeeIssue.investigate ? true : false;
          employeeIssue['investigatedDate'] = employeeIssue.investigate
            ? Intl.DateTimeFormat('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              }).format(new Date(employeeIssue.investigate.date_of_investigation))
            : '';
          employeeIssue['isDecisionSent'] = employeeIssue.is_decision_sent;
          employeeIssue['isDecisionReceived'] = employeeIssue.is_decision_received;
          employeeIssue['decisionReceivedDate'] =
            employeeIssue.decision_received_date &&
            new Intl.DateTimeFormat('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            }).format(new Date(employeeIssue.decision_received_date));
          employeeIssue['investigateForm'] = employeeIssue.investigate || {
            date: '',
            witness: '',
            presider: '',
            isAttendHearing: '',
            decision: '',
            attachments: '',
          };
          employeeIssue['issueNTEForm'] = {
            template: 'Test',
            to: '',
            message: '',
          };
          employeeIssue['sendDecisionForm'] = {
            template: 'Test',
            to: '',
            message: '',
          };
          employeeIssue['is_responded'] = employeeIssue.is_responded;
          return employeeIssue;
        });
        totalPages = dataEmployeeIssues.total_pages || 1;
        totalRecords = dataEmployeeIssues.total_records || items.length;
      } 
      // Handle array response structure (no pagination from backend)
      else if (Array.isArray(dataEmployeeIssues)) {
        items = dataEmployeeIssues.map((employeeIssue: any) => {
          // Same transformation as above
          employeeIssue.incidentDate = Intl.DateTimeFormat('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          }).format(new Date(employeeIssue.incident_date));
          employeeIssue['isNTESent'] = employeeIssue.is_nte_sent;
          employeeIssue['isNTEReceived'] = employeeIssue.is_nte_received;
          employeeIssue['incidentReceivedDate'] =
            employeeIssue.incident_received_date &&
            new Intl.DateTimeFormat('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            }).format(new Date(employeeIssue.incident_received_date));
          employeeIssue['isInvestigated'] = employeeIssue.investigate ? true : false;
          employeeIssue['investigatedDate'] = employeeIssue.investigate
            ? Intl.DateTimeFormat('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              }).format(new Date(employeeIssue.investigate.date_of_investigation))
            : '';
          employeeIssue['isDecisionSent'] = employeeIssue.is_decision_sent;
          employeeIssue['isDecisionReceived'] = employeeIssue.is_decision_received;
          employeeIssue['decisionReceivedDate'] =
            employeeIssue.decision_received_date &&
            new Intl.DateTimeFormat('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            }).format(new Date(employeeIssue.decision_received_date));
          employeeIssue['investigateForm'] = employeeIssue.investigate || {
            date: '',
            witness: '',
            presider: '',
            isAttendHearing: '',
            decision: '',
            attachments: '',
          };
          employeeIssue['issueNTEForm'] = {
            template: 'Test',
            to: '',
            message: '',
          };
          employeeIssue['sendDecisionForm'] = {
            template: 'Test',
            to: '',
            message: '',
          };
          employeeIssue['is_responded'] = employeeIssue.is_responded;
          return employeeIssue;
        });
        
        // Calculate pagination locally if backend doesn't support it
        totalRecords = items.length;
        totalPages = Math.ceil(totalRecords / pageSize);
      }

      setEmployeeIssueItems(items);
      setPagination({
        totalPages,
        totalRecords
      });


    }
  }, [dataEmployeeIssues, dataDepartment, dataEmployee, dataPosition, pageSize]);

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const handleSearch = () => {
    // Check date validity first
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
    if (dateFrom && dateTo && dateFrom > dateTo) {
      return toast.custom(
        () => <CustomToast message='You have entered an invalid date range. Please select again.' type='error' />,
        {
          duration: 5000,
        }
      );
    }
    setIsSearching(true);
    setAppliedFilter({
      ...itemsFilter,
      search: searchText
    });
  };

  useEffect(() => {
    if (!isGetEmployeeIssuesLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isGetEmployeeIssuesLoading, isSearching]);

  const renderRows = () => {
    if (isSearching || isGetEmployeeIssuesLoading) {
      return (
        <tr>
          <td colSpan={100}>
            <div role='status' className='py-5 text-center'>
              <svg
                aria-hidden='true'
                className='inline w-12 h-12 mr-2 text-gray-200 animate-spin fill-yellow-400'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
              <span className='sr-only'>Loading...</span>
            </div>
          </td>
        </tr>
      );
    }
    if (employeeIssueItems && employeeIssueItems.length > 0) {
      return employeeIssueItems.map((item: any) => {
        // Get is_responded from the original data (it should be included in the list response)
        const isResponded = item.is_responded;
        const hasInvestigationReport = item.isInvestigated;
        
        return (
          <tr
            key={item.id}
            // onClick={() => alert('Clicked Employee Issue Item')}
            // className='hover:bg-gray-200/30 cursor-pointer'
          >
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.incidentDate}</td>
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
              <span>{item.name}</span>
            </td>
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
              <SendNTE
                id={item.id}
                isNTESent={item.isNTESent}
                isNTEReceived={item.isNTEReceived}
                incidentReceivedDate={item.incidentReceivedDate}
                employeeIssueDetails={item}
                setIsSendNTEModalOpen={setIsSendNTEModalOpen}
                setIsUploadEmployeeIssueAttachmentModalOpen={setIsUploadEmployeeIssueAttachmentModalOpen}
                setNTEAttachmentViewModalOpen={setNTEAttachmentViewModalOpen}
                setReleased={setReleased}
                isLoading={isLoading}
                setIsRedirectingToDocumentGenerator={setIsRedirectingToDocumentGenerator}
              />
            </td>
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top'>
              <Investigation
                id={item.id}
                investigatedDate={item.investigatedDate}
                isInvestigated={item.isInvestigated}
                setIsInvestigateModalOpen={setIsInvestigateModalOpen}
                setInvestigationReportDetailsModalOpen={setInvestigationReportDetailsModalOpen}
                isResponded={item.is_responded === true}
              />
            </td>
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top'>
              <SendDecision
                id={item.id}
                isDecisionSent={item.isDecisionSent}
                isDecisionReceived={item.isDecisionReceived}
                decisionReceivedDate={item.decisionReceivedDate}
                employeeIssueDetails={item}
                setIsSendDecisionModalOpen={setIsSendDecisionModalOpen}
                setIsUploadDecisionAttachmentModalOpen={setIsUploadDecisionAttachmentModalOpen}
                setIsDecisionAttachmentViewModalOpen={setIsDecisionAttachmentViewModalOpen}
                setReleased={setReleased}
                isLoading={isLoading}
                hasInvestigationReport={hasInvestigationReport}
              />
            </td>
          </tr>
        );
      });
    } else {
      return (
        <tr>
          <td colSpan={7}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>Please click create to add incident report.</h4>
          </td>
        </tr>
      );
    }
  };
  return (
    <>
      {isRedirectingToDocumentGenerator && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80">
          <svg
            aria-hidden="true"
            className="inline w-16 h-16 mb-4 text-gray-200 animate-spin fill-yellow-400"
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
          <span className="text-yellow-600 font-semibold text-xl">Redirecting to document generator...</span>
        </div>
      )}
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/manage' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Manage</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Address Employee Issue</h2>
          <div className={classNames('mt-6 flex flex-col lg:flex-row items-left gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='flex-none flex flex-col lg:flex-row items-left gap-2'>
              <div className='relative'>
                <CustomDatePicker
                  id='from-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
                  selected={itemsFilter.from}
                  pickerOnChange={(date: any) => {
                    if (itemsFilter) setItemsFilter({ ...itemsFilter, from: date });
                  }}
                  inputOnChange={(value: any) => {
                    setItemsFilter({
                      ...itemsFilter,
                      from: value?.target?.value === '' ? null : value,
                    });
                  }}
                />
              </div>
              <p>to</p>
              <div className='relative'>
                <CustomDatePicker
                  id='to-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
                  selected={itemsFilter.to}
                  pickerOnChange={(date: any) => {
                    if (itemsFilter) setItemsFilter({ ...itemsFilter, to: date });
                    if (!itemsFilter) setItemsFilter(date);
                  }}
                  inputOnChange={(value: any) => {
                    setItemsFilter({
                      ...itemsFilter,
                      to: value?.target?.value === '' ? null : value,
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
                  data-tooltip-content='Search for Employee Name'
                  data-tooltip-place='bottom'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  onChange={(e) => setSearchText(e.target.value)}
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
            <div className='flex-1 flex justify-start lg:justify-end'>
              <button
                className='bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow enabled:hover:shadow-md enabled:focus:shadow-none enabled:focus:opacity-80 disabled:opacity-50'
                onClick={() => setIsIncidentReportModalOpen(true)}
                disabled={!cachedProfile?.state?.data?.create_employee_issue}
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
                        Date
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Name
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Issue NTE
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Investigate
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Send Decision
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
                </table>
                <hr />
                <Pagination
                  pagination={pagination}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onPageSizeChange={pageSizeChange}
                  onPageChange={paginationChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <IncidentReportModal
        employeeIssueItems={employeeIssueItems}
        departmentItems={departmentItems}
        employeeItems={employeeItems}
        positionItems={positionItems}
        setEmployeeIssueItems={setEmployeeIssueItems}
        isOpen={isIncidentReportModalOpen}
        setIsOpen={setIsIncidentReportModalOpen}
        refetch={refetch}
      />
      <SendNTEModal
        isOpen={isSendNTEModalOpen}
        setIsOpen={setIsSendNTEModalOpen}
        employeeIssueItems={employeeIssueItems}
        setEmployeeIssueItems={setEmployeeIssueItems}
        refetch={refetch}
      />
      <InvestigationModal
        employeeIssueItems={employeeIssueItems}
        setEmployeeIssueItems={setEmployeeIssueItems}
        isOpen={isInvestigateModalOpen}
        setIsOpen={setIsInvestigateModalOpen}
      />
      <SendDecisionModal
        isOpen={isSendDecisionModalOpen}
        setIsOpen={setIsSendDecisionModalOpen}
        employeeIssueItems={employeeIssueItems}
        setEmployeeIssueItems={setEmployeeIssueItems}
        refetch={refetch}
      />
      {isInvestigationReportDetailsModalOpen && (
        <InvestigationReportDetailsModal
          isOpen={isInvestigationReportDetailsModalOpen}
          setIsOpen={setInvestigationReportDetailsModalOpen}
        />
      )}
      {isUploadEmployeeIssueAttachmentModalOpen && (
        <UploadEmployeeIssueAttachmentModal
          isOpen={isUploadEmployeeIssueAttachmentModalOpen}
          setIsOpen={setIsUploadEmployeeIssueAttachmentModalOpen}
        />
      )}
      {isNTEAttachmentViewModalOpen && (
        <NTEAttachmentViewModal isOpen={isNTEAttachmentViewModalOpen} setIsOpen={setNTEAttachmentViewModalOpen} />
      )}
      {isUploadDecisionAttachmentModalOpen && (
        <UploadDecisionAttachmentModal
          isOpen={isUploadDecisionAttachmentModalOpen}
          setIsOpen={setIsUploadDecisionAttachmentModalOpen}
        />
      )}
      {isDecisionAttachmentViewModalOpen && (
        <DecisionAttachmentViewModal
          isOpen={isDecisionAttachmentViewModalOpen}
          setIsOpen={setIsDecisionAttachmentViewModalOpen}
        />
      )}

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Content;
