'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import LoadingSpinner from '@/components/LoadingSpinner';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import Pagination from '@/components/Pagination';
import useGetEmployeeItems from '@/components/hooks/useGetEmployeeItems';
import useGetEmployeeIssueItems from './hooks/useGetEmployeeIssueItems';
import usePatchEmployeeIssueItems from './hooks/usePatchEmployeeIssueItems';
import UploadEmployeeIssueAttachmentModal from './modals/UploadNTEAttachmentModal';
import NTEAttachmentViewModal from './modals/NTEAttachmentViewModal';
import UploadDecisionAttachmentModal from './modals/UploadDecisionAttachment';
import DecisionAttachmentViewModal from './modals/DecisionSummaryViewModal';
import IncidentReportModal from './modals/IncidentReportModal';
import EditIncidentReportModal from './modals/EditIncidentReportModal';
import UpdateStatusModal from './modals/UpdateStatusModal';
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
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import MoreIconWithBorder from '@/svg/MoreIconWithBorder';

import classNames from '@/helpers/classNames';

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [employeeIssueItems, setEmployeeIssueItems] = useState<any>([]);
  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const [itemsFilter, setItemsFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
    status: 'all', // all, pending, approved, disapproved
  });
  const [appliedFilter, setAppliedFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
    status: 'all', // all, pending, approved, disapproved
    status_sort: 'asc', // asc, desc, null - default to asc to show pending first
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
  const [isEditIncidentReportModalOpen, setIsEditIncidentReportModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
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
  const [moreMenuOpen, setMoreMenuOpen] = useState<{ [key: number]: boolean }>({});
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState<any>(null);
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
  const { data: dataEmployee, isLoading: isEmployeeLoading } = useGetEmployeeItems();
  const queryClient = useQueryClient();
  const cachedUserRights = queryClient.getQueryCache().find(['userRightsCache']) as { state: { data: any } | undefined };
  const [isSearching, setIsSearching] = useState(false);
  const [isRedirectingToDocumentGenerator, setIsRedirectingToDocumentGenerator] = useState(false);
  const [statusSortOrder, setStatusSortOrder] = useState<'asc' | 'desc' | null>('asc');
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
    if (dataEmployee && !isEmployeeLoading) {
      // Handle different response structures
      let employeeData = dataEmployee;
      if (dataEmployee.records && Array.isArray(dataEmployee.records)) {
        employeeData = dataEmployee.records;
      } else if (Array.isArray(dataEmployee)) {
        employeeData = dataEmployee;
      }
      
      setEmployeeItems(employeeData);
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
          
          // Map employee data for edit functionality
          employeeIssue['employee_id'] = employeeIssue.employee_id || employeeIssue.employee?.id;
          employeeIssue['employee_name'] = employeeIssue.name || `${employeeIssue.employee?.firstname || ''} ${employeeIssue.employee?.lastname || ''}`.trim();
          employeeIssue['employee_position'] = employeeIssue.position || employeeIssue.employee?.position;
          employeeIssue['employee_department'] = employeeIssue.department || employeeIssue.employee?.department;
          employeeIssue['incident_place'] = employeeIssue.place_of_incident || employeeIssue.incident_place;
          
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
          
          // Map employee data for edit functionality
          employeeIssue['employee_id'] = employeeIssue.employee_id || employeeIssue.employee?.id;
          employeeIssue['employee_name'] = employeeIssue.name || `${employeeIssue.employee?.firstname || ''} ${employeeIssue.employee?.lastname || ''}`.trim();
          employeeIssue['employee_position'] = employeeIssue.position || employeeIssue.employee?.position;
          employeeIssue['employee_department'] = employeeIssue.department || employeeIssue.employee?.department;
          employeeIssue['incident_place'] = employeeIssue.place_of_incident || employeeIssue.incident_place;
          
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
  }, [dataEmployeeIssues, dataEmployee, pageSize, isEmployeeLoading]);

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

  const handleStatusFilter = (status: string) => {
    setItemsFilter({ ...itemsFilter, status });
    setAppliedFilter({ ...appliedFilter, status, status_sort: null });
    setStatusSortOrder(null); // Reset sort order when changing status filter
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleStatusSort = () => {
    let newSortOrder: 'asc' | 'desc' | null = null;
    
    if (statusSortOrder === null) {
      newSortOrder = 'asc';
    } else if (statusSortOrder === 'asc') {
      newSortOrder = 'desc';
    } else {
      newSortOrder = null;
    }
    
    setStatusSortOrder(newSortOrder);
    
    // Update the applied filter with the new sort order
    setAppliedFilter({ ...appliedFilter, status_sort: newSortOrder });
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  useEffect(() => {
    if (!isGetEmployeeIssuesLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isGetEmployeeIssuesLoading, isSearching]);

  // Add click outside handler to close menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (Object.keys(moreMenuOpen).some(id => moreMenuOpen[parseInt(id)])) {
        const target = event.target as HTMLElement;
        if (!target.closest('.more-menu-container')) {
          setMoreMenuOpen({});
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [moreMenuOpen]);

  // Close all menus when changing pages
  useEffect(() => {
    setMoreMenuOpen({});
  }, [currentPage]);


  const handleEdit = (issueId: number) => {
    const issue = employeeIssueItems.find((item: any) => item.id === issueId);
    if (issue) {
      setSelectedIssue(issue);
      setIsEditIncidentReportModalOpen(true);
      setMoreMenuOpen({}); // Close the menu
    }
  };

  const handleMoreMenuClick = (issueId: number) => {
    // Close all other menus first
    const newMoreMenuOpen: { [key: number]: boolean } = {};
    
    // Toggle the clicked menu
    newMoreMenuOpen[issueId] = !moreMenuOpen[issueId];
    
    setMoreMenuOpen(newMoreMenuOpen);
  };

  const handleUpdateStatus = (issueId: number) => {
    const issue = employeeIssueItems.find((item: any) => item.id === issueId);
    if (issue) {
      setSelectedIssue(issue);
      setIsUpdateStatusModalOpen({ id: issueId, open: true });
      setMoreMenuOpen({}); // Close the menu
    }
  };


  const renderRows = () => {
    if (isSearching || isGetEmployeeIssuesLoading) {
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
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 font-mono'>
              {item.nte_id || 'NTE-000'}
            </td>
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.incidentDate}</td>
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
              <span>{item.name}</span>
            </td>
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-middle'>
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
                userRights={cachedUserRights?.state?.data}
              />
            </td>
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-middle'>
              <Investigation
                id={item.id}
                investigatedDate={item.investigatedDate}
                isInvestigated={item.isInvestigated}
                setIsInvestigateModalOpen={setIsInvestigateModalOpen}
                setInvestigationReportDetailsModalOpen={setInvestigationReportDetailsModalOpen}
                isResponded={item.is_responded === true}
                userRights={cachedUserRights?.state?.data}
              />
            </td>
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-middle'>
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
                userRights={cachedUserRights?.state?.data}
              />
            </td>
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
              <span>{item.prepared_by || '—'}</span>
            </td>
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
              <span className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-pre-line text-center ${
                item.status === 'approved' 
                  ? 'bg-green-100 text-green-700' 
                  : item.status === 'disapproved'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-yellow-100 text-orange-600'
              }`}>
                {item.status === 'approved' ? 'Approved' : 
                 item.status === 'disapproved' ? 'Disapproved' : 'Pending'}
              </span>
            </td>
            <td className='flex gap-2 justify-center whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
              <div className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
                <div className='flex space-x-2'>
                  <div className="relative more-menu-container pt-1">
                    <button onClick={() => handleMoreMenuClick(item.id)}>
                      <MoreIconWithBorder />
                    </button>
                    {moreMenuOpen[item.id] && (
                      <div className='absolute bg-white border rounded shadow-lg mt-2 z-50 right-0' style={{ minWidth: '180px', top: '100%' }}>
                        <ul className='py-1 text-left'>
                          <li
                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${item.status === 'pending' && cachedUserRights?.state?.data?.update_employee_issue_status ? 'border-b' : ''}`}
                            onClick={() => handleEdit(item.id)}
                          >
                            {/* Hide Edit Report when NTE attachment exists and status is not pending, or when user doesn't have edit rights */}
                            {cachedUserRights?.state?.data?.edit_employee_issue && item.status === 'pending' && !item.nte_attachment ? 'Edit Report' : 'View Report'}
                          </li>
                          {item.status === 'pending' && cachedUserRights?.state?.data?.update_employee_issue_status && (
                            <li
                              className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                              onClick={() => handleUpdateStatus(item.id)}
                            >
                              Update Status
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </td>
          </tr>
        );
      });
    } else {
      return (
        <tr>
          <td colSpan={9}>
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
          <LoadingSpinner size="xl" color="yellow" className="mb-4" />
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
                disabled={!cachedUserRights?.state?.data?.create_employee_issue}
              >
                CREATE
              </button>
            </div>
          </div>
          
          {/* Status Filter Tabs */}
          <div className="mt-8">
            <div className="flex flex-wrap justify-center md:justify-start md:pl-4 lg:pl-10 mb-5 gap-2">
              <div
                onClick={() => handleStatusFilter('all')}
                className={`cursor-pointer px-3 sm:px-4 py-2 rounded-md transition-all duration-200 text-center ${
                  appliedFilter.status === 'all'
                    ? 'bg-white text-sky-600 border-2 border-sky-600 shadow-sm'
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                All Issues
              </div>
              <div
                onClick={() => handleStatusFilter('approved')}
                className={`cursor-pointer px-3 sm:px-4 py-2 rounded-md transition-all duration-200 text-center ${
                  appliedFilter.status === 'approved'
                    ? 'bg-white text-green-600 border-2 border-green-600 shadow-sm'
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                Approved
              </div>
              <div
                onClick={() => handleStatusFilter('disapproved')}
                className={`cursor-pointer px-3 sm:px-4 py-2 rounded-md transition-all duration-200 text-center ${
                  appliedFilter.status === 'disapproved'
                    ? 'bg-white text-red-600 border-2 border-red-600 shadow-sm'
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                Disapproved
              </div>
            </div>
          </div>

          <div className={classNames('mt-8 flow-root', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='-mx-4 -my-2 overflow-x-auto md:overflow-visible sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-300 text-center'>
                  <thead>
                    <tr>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Reference No.
                      </th>
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
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Prepared by
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 text-center'>
                        <button
                          onClick={handleStatusSort}
                          className='flex items-center justify-center gap-1 hover:text-gray-700 transition-colors mx-auto'
                        >
                          Status
                          <div className='flex flex-col'>
                            <ChevronUpIcon 
                              className={`h-3 w-3 ${statusSortOrder === 'asc' ? 'text-gray-900' : 'text-gray-400'}`} 
                            />
                            <ChevronDownIcon 
                              className={`h-3 w-3 ${statusSortOrder === 'desc' ? 'text-gray-900' : 'text-gray-400'}`} 
                            />
                          </div>
                        </button>
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
              pagination={pagination}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageSizeChange={pageSizeChange}
              onPageChange={paginationChange}
            />
          </div>
        </div>
      </div>
      <IncidentReportModal
        employeeIssueItems={employeeIssueItems}
        employeeItems={employeeItems}
        setEmployeeIssueItems={setEmployeeIssueItems}
        isOpen={isIncidentReportModalOpen}
        setIsOpen={setIsIncidentReportModalOpen}
        refetch={refetch}
      />
      <EditIncidentReportModal
        employeeIssueItems={employeeIssueItems}
        employeeItems={employeeItems}
        setEmployeeIssueItems={setEmployeeIssueItems}
        isOpen={isEditIncidentReportModalOpen}
        setIsOpen={setIsEditIncidentReportModalOpen}
        refetch={refetch}
        selectedIssue={selectedIssue}
        cachedUserRights={cachedUserRights}
      />
      {isUpdateStatusModalOpen && (
        <UpdateStatusModal
          employeeIssueItems={employeeIssueItems}
          setEmployeeIssueItems={setEmployeeIssueItems}
          isOpen={isUpdateStatusModalOpen}
          setIsOpen={setIsUpdateStatusModalOpen}
          refetch={refetch}
          selectedIssue={selectedIssue}
          cachedUserRights={cachedUserRights}
        />
      )}
      <SendNTEModal
        isOpen={isSendNTEModalOpen}
        setIsOpen={setIsSendNTEModalOpen}
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
