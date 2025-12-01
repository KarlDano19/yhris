'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';
import SeederButton from '@/components/SeederButton';

import LoadingSpinner from '@/components/LoadingSpinner';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import Pagination from '@/components/Pagination';
import useGetEmployeeIssueItems from './hooks/useGetEmployeeIssueItems';
import usePatchEmployeeIssueItems from './hooks/usePatchEmployeeIssueItems';
import useRegenerateNTEPDF from './hooks/useRegenerateNTEPDF';
import UploadEmployeeIssueAttachmentModal from './modals/UploadNTEAttachmentModal';
import NTEAttachmentViewModal from './modals/NTEAttachmentViewModal';
import UploadDecisionAttachmentModal from './modals/UploadDecisionAttachment';
import DecisionAttachmentViewModal from './modals/DecisionSummaryViewModal';
import IncidentReportModal from './modals/IncidentReportModal';
import EditIncidentReportModal from './modals/EditIncidentReportModal';
import UpdateStatusModal from './modals/UpdateStatusModal';
import InvestigationReportDetailsModal from './modals/InvestigationReportDetailsModal';
import SendEmailModal from '@/components/SendEmailModal';
import NTEAttachmentSection from './components/NTEAttachmentSection';
import { useDeleteNTEAttachment } from './hooks/useDeleteNTEAttachment';
import useGetEmployeeIssueDetails from './hooks/useGetEmployeeIssueDetails';
import SendNTE from './SendNTE';
import Investigation from './Investigation';
import InvestigationModal from './modals/InvestigationModal';
import SendDecision from './SendDecision';
import useSeedEmployeeIssues from './hooks/useSeedEmployeeIssues';
import useUnseedEmployeeIssues from './hooks/useUnseedEmployeeIssues';

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
import { formatDateToLocal } from '@/helpers/date';

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [employeeIssueItems, setEmployeeIssueItems] = useState<any>([]);
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
  const [pdfAttachment, setPdfAttachment] = useState<string | null>(null);
  const { mutate, isLoading } = usePatchEmployeeIssueItems();
  const { mutate: deleteNTEAttachment, isLoading: isDeleting } = useDeleteNTEAttachment();
  const { mutate: regenerateNTE, isLoading: isRegenerating } = useRegenerateNTEPDF();
  const seedEmployeeIssuesMutation = useSeedEmployeeIssues();
  const unseedEmployeeIssuesMutation = useUnseedEmployeeIssues();
  const { data: employeeIssueDetails } = useGetEmployeeIssueDetails(isSendNTEModalOpen?.id || null);
  const { data: decisionEmployeeIssueDetails } = useGetEmployeeIssueDetails(isSendDecisionModalOpen?.id || null);
  const {
    data: dataEmployeeIssues,
    isLoading: isGetEmployeeIssuesLoading,
    refetch,
  } = useGetEmployeeIssueItems({
    ...appliedFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });
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

  // Handle PDF attachment from employee issue details
  useEffect(() => {
    if (employeeIssueDetails && isSendNTEModalOpen) {
      if (employeeIssueDetails.nte_attachment) {
        setPdfAttachment(employeeIssueDetails.nte_attachment);
      } else {
        setPdfAttachment(null);
      }
    }
  }, [employeeIssueDetails, isSendNTEModalOpen]);

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
      employeeIssueItemsCopy[itemIndex].incidentReceivedDate = formatDateToLocal(currentDate.toISOString());
    }
    if (emailType === 'decision') {
      employeeIssueItemsCopy[itemIndex].isDecisionReceived = true;
      employeeIssueItemsCopy[itemIndex].decisionReceivedDate = formatDateToLocal(currentDate.toISOString());
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
    if (dataEmployeeIssues) {
      let items = [];
      let totalPages = 1;
      let totalRecords = 0;

      // Handle paginated response structure
      if (dataEmployeeIssues.records) {
        items = dataEmployeeIssues.records.map((employeeIssue: any) => {
          employeeIssue.incidentDate = formatDateToLocal(employeeIssue.incident_date);
          employeeIssue['isNTESent'] = employeeIssue.is_nte_sent;
          employeeIssue['isNTEReceived'] = employeeIssue.is_nte_received;
          employeeIssue['incidentReceivedDate'] = formatDateToLocal(employeeIssue.incident_received_date);
          employeeIssue['isInvestigated'] = employeeIssue.investigate ? true : false;
          employeeIssue['investigatedDate'] = employeeIssue.investigate
            ? formatDateToLocal(employeeIssue.investigate.date_of_investigation)
            : '';
          employeeIssue['isDecisionSent'] = employeeIssue.is_decision_sent;
          employeeIssue['isDecisionReceived'] = employeeIssue.is_decision_received;
          employeeIssue['decisionReceivedDate'] = formatDateToLocal(employeeIssue.decision_received_date);
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
          employeeIssue.incidentDate = formatDateToLocal(employeeIssue.incident_date);
          employeeIssue['isNTESent'] = employeeIssue.is_nte_sent;
          employeeIssue['isNTEReceived'] = employeeIssue.is_nte_received;
          employeeIssue['incidentReceivedDate'] = formatDateToLocal(employeeIssue.incident_received_date);
          employeeIssue['isInvestigated'] = employeeIssue.investigate ? true : false;
          employeeIssue['investigatedDate'] = employeeIssue.investigate
            ? formatDateToLocal(employeeIssue.investigate.date_of_investigation)
            : '';
          employeeIssue['isDecisionSent'] = employeeIssue.is_decision_sent;
          employeeIssue['isDecisionReceived'] = employeeIssue.is_decision_received;
          employeeIssue['decisionReceivedDate'] = formatDateToLocal(employeeIssue.decision_received_date);
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
  }, [dataEmployeeIssues, pageSize]);

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

  const handleSeedEmployeeIssues = async (count: number) => {
    try {
      const result = await seedEmployeeIssuesMutation.mutateAsync({ count });
      toast.custom(() => <CustomToast message={result.message} type='success' />, { duration: 3000 });
      if (refetch) {
        await refetch();
      }
    } catch (error) {
      const errorMessage = typeof error === 'string'
        ? error
        : error instanceof Error
          ? error.message
          : 'Failed to seed employee issues';
      toast.custom(() => <CustomToast message={errorMessage} type='error' />, { duration: 5000 });
      throw error;
    }
  };

  const handleUnseedEmployeeIssues = async () => {
    try {
      const result = await unseedEmployeeIssuesMutation.mutateAsync();
      toast.custom(() => <CustomToast message={result.message} type='success' />, { duration: 3000 });
      if (refetch) {
        await refetch();
      }
    } catch (error) {
      const errorMessage = typeof error === 'string'
        ? error
        : error instanceof Error
          ? error.message
          : 'Failed to unseed employee issues';
      toast.custom(() => <CustomToast message={errorMessage} type='error' />, { duration: 5000 });
      throw error;
    }
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

  const handleRegenerateNTE = (issueId: number) => {
    const issue = employeeIssueItems.find((item: any) => item.id === issueId);
    if (issue) {
      regenerateNTE({ id: issueId }, {
        onSuccess: (data: any) => {
          toast.custom(() => <CustomToast message={data.message || 'NTE PDF regenerated successfully'} type='success' />, { duration: 5000 });
          setMoreMenuOpen({}); // Close the menu
          if (refetch) {
            refetch();
          }
        },
        onError: (err: any) => {
          let errorMessage = 'Failed to regenerate NTE PDF';
          
          if (typeof err === 'string') {
            errorMessage = err;
          } else if (err?.message) {
            errorMessage = err.message;
          } else if (err?.response?.data?.message) {
            errorMessage = err.response.data.message;
          }
          
          toast.custom(() => <CustomToast message={errorMessage} type='error' />, {
            duration: 7000,
          });
          setMoreMenuOpen({}); // Close the menu
        },
      });
    }
  };

  // NTE-specific handlers
  const handleViewAttachment = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDeleteAttachment = () => {
    if (isSendNTEModalOpen?.id) {
      deleteNTEAttachment(isSendNTEModalOpen.id, {
        onSuccess: (data: any) => {
          setPdfAttachment(null);
          toast.custom(() => <CustomToast message={data.message || 'Attachment deleted successfully'} type='success' />, { duration: 3000 });
          setIsSendNTEModalOpen(null);
          if (refetch) {
            refetch();
          }
        },
        onError: (err: any) => {
          let errorMessage = 'Failed to delete attachment';
          
          if (typeof err === 'string') {
            errorMessage = err;
          } else if (err?.message) {
            errorMessage = err.message;
          } else if (err?.response?.data?.message) {
            errorMessage = err.response.data.message;
          }
          
          toast.custom(() => <CustomToast message={errorMessage} type='error' />, {
            duration: 5000,
          });
        },
      });
    }
  };

  const handleNTESubmit = (data: any) => {
    if (isSendNTEModalOpen && isSendNTEModalOpen.id) {
      const payload = {
        id: isSendNTEModalOpen.id.toString(),
        actionType: 'sending',
        emailType: 'nte',
        nte_subject: data.subject,
        nte_to: JSON.stringify(data.email),
        nte_cc: JSON.stringify(data.cc),
        nte_bcc: JSON.stringify(data.bcc),
        nte_message: data.message,
        issueNTEForm: {
          template: data.template,
          subject: data.subject,
          to: data.email,
          cc: data.cc,
          bcc: data.bcc,
          message: data.message,
          attachment: pdfAttachment || null
        },
        sendDecisionForm: {
          template: '',
          subject: '',
          to: [],
          cc: [],
          bcc: [],
          message: '',
          attachment: null
        },
        dateReceived: null,
        decision_subject: '',
        decision_to: '',
        decision_cc: '',
        decision_bcc: '',
        decision_message: ''
      };
      
      mutate(payload, {
        onSuccess: (data: any) => {
          setIsSendNTEModalOpen(null);
          setPdfAttachment(null);
          toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
          if (refetch) {
            refetch();
          }
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, {
            duration: 7000,
          });
        },
      });
    }
  };

  const handleDecisionSubmit = (data: any) => {
    if (isSendDecisionModalOpen && isSendDecisionModalOpen.id) {
      const payload = {
        id: isSendDecisionModalOpen.id.toString(),
        actionType: 'sending',
        emailType: 'decision',
        decision_subject: data.subject,
        decision_to: JSON.stringify(data.email),
        decision_cc: JSON.stringify(data.cc),
        decision_bcc: JSON.stringify(data.bcc),
        decision_message: data.message,
        issueNTEForm: {
          template: '',
          subject: '',
          to: [],
          cc: [],
          bcc: [],
          message: '',
          attachment: null
        },
        sendDecisionForm: {
          template: data.template,
          subject: data.subject,
          to: data.email,
          cc: data.cc,
          bcc: data.bcc,
          message: data.message,
          attachment: null
        },
        dateReceived: null,
        nte_subject: '',
        nte_to: '',
        nte_cc: '',
        nte_bcc: '',
        nte_message: ''
      };
      
      mutate(payload, {
        onSuccess: (data: any) => {
          setIsSendDecisionModalOpen(null);
          toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
          if (refetch) {
            refetch();
          }
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, {
            duration: 7000,
          });
        },
      });
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
                isInvestigated={item.isInvestigated}
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
                employeeIssueDetails={item}
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
                        <div className='py-1 text-left flex flex-col gap-2'>
                            <SmartButton
                              id="edit-employee-issue-btn"
                              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${item.status === 'pending' ? 'border-b' : ''}`}
                              onClick={() => handleEdit(item.id)}
                            >
                              {/* Hide Edit Report when NTE attachment exists and status is not pending, or when user doesn't have edit rights */}
                              {item.status === 'pending' && !item.nte_attachment ? 'Edit Report' : 'View Report'}
                            </SmartButton>
                            {item.status === 'pending' && (
                              <SmartButton
                                id="update-employee-issue-status-btn"
                                className='px-4 py-2 hover:bg-gray-100 cursor-pointer border-b'
                                onClick={() => handleUpdateStatus(item.id)}
                              >
                                Update Status
                              </SmartButton>
                            )}
                            {/* Show regenerate button if issue has response or decision was sent */}
                            {(item.is_responded || item.isDecisionSent) && (
                              <SmartButton
                                id="regenerate-nte-pdf-btn"
                                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${isRegenerating ? 'opacity-50 pointer-events-none' : ''}`}
                                onClick={() => handleRegenerateNTE(item.id)}
                                disabled={isRegenerating}
                              >
                                {isRegenerating ? (
                                  <span className="flex items-center gap-2">
                                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 rounded-full border-t-transparent"></div>
                                    Regenerating...
                                  </span>
                                ) : (
                                  'Regenerate NTE PDF'
                                )}
                              </SmartButton>
                            )}

                        </div>
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
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 pb-56 md:pb-0 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <Link href='/manage' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Manage</h4>
          </Link>
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Address Employee Issue</h2>
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
                      from: value?.target?.value === '' ? null : value,
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
                  data-tooltip-content='Search for: Ref No. / Name / Prepared by'
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
            <div className='flex-1 flex justify-start lg:justify-end items-center gap-2'>
              <SeederButton
                onSeed={handleSeedEmployeeIssues}
                onUnseed={handleUnseedEmployeeIssues}
                isLoading={seedEmployeeIssuesMutation.isLoading}
                isUnseeding={unseedEmployeeIssuesMutation.isLoading}
                maxCount={1000}
                defaultCount={5}
              />
              <SmartButton
                id="create-employee-issue-btn"
                className='bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow enabled:hover:shadow-md enabled:focus:shadow-none enabled:focus:opacity-80 disabled:opacity-50'
                onClick={() => setIsIncidentReportModalOpen(true)}
              >
                CREATE
              </SmartButton>
            </div>
          </div>
          
          {/* Status Filter Tabs */}
          <div className="mt-8">
            <div className="flex flex-wrap justify-center md:justify-start md:pl-4 lg:pl-10 mb-5 gap-2">
              <div
                onClick={() => handleStatusFilter('all')}
                className={`cursor-pointer px-3 sm:px-4 py-2 rounded-md transition-all duration-200 text-center ${
                  appliedFilter.status === 'all'
                    ? 'bg-white text-savoy-blue border-2 border-savoy-blue shadow-sm'
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
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
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
      <IncidentReportModal
        isOpen={isIncidentReportModalOpen}
        setIsOpen={setIsIncidentReportModalOpen}
        refetch={refetch}
      />
      <EditIncidentReportModal
        isOpen={isEditIncidentReportModalOpen}
        setIsOpen={setIsEditIncidentReportModalOpen}
        refetch={refetch}
        selectedIssue={selectedIssue}
      />
      {isUpdateStatusModalOpen && (
        <UpdateStatusModal
          employeeIssueItems={employeeIssueItems}
          setEmployeeIssueItems={setEmployeeIssueItems}
          isOpen={isUpdateStatusModalOpen}
          setIsOpen={setIsUpdateStatusModalOpen}
          refetch={refetch}
          selectedIssue={selectedIssue}
        />
      )}
      {isSendNTEModalOpen && (
        <SendEmailModal
          title="Send NTE"
          isOpen={!!isSendNTEModalOpen}
          onClose={() => setIsSendNTEModalOpen(null)}
          onSubmit={handleNTESubmit}
          defaultRecipients={employeeIssueDetails?.email ? [employeeIssueDetails.email] : []}
          showAttachment={true}
          customAttachmentSection={
            <NTEAttachmentSection
              pdfAttachment={pdfAttachment}
              isDeleting={isDeleting}
              canDelete={!employeeIssueDetails?.is_nte_sent}
              onViewAttachment={handleViewAttachment}
              onDeleteAttachment={handleDeleteAttachment}
            />
          }
          submitButtonText="Send & Mark as Sent"
          isLoading={isLoading}
          prePopulatedData={employeeIssueDetails ? {
            subject: employeeIssueDetails.nte_subject,
            message: employeeIssueDetails.nte_message,
            to: employeeIssueDetails.nte_to ? JSON.parse(employeeIssueDetails.nte_to) : [],
            cc: employeeIssueDetails.nte_cc ? JSON.parse(employeeIssueDetails.nte_cc) : [],
            bcc: employeeIssueDetails.nte_bcc ? JSON.parse(employeeIssueDetails.nte_bcc) : []
          } : undefined}
        />
      )}
      <InvestigationModal
        employeeIssueItems={employeeIssueItems}
        setEmployeeIssueItems={setEmployeeIssueItems}
        isOpen={isInvestigateModalOpen}
        setIsOpen={setIsInvestigateModalOpen}
      />
      {isSendDecisionModalOpen && (
        <SendEmailModal
          title="Send Decision"
          isOpen={!!isSendDecisionModalOpen}
          onClose={() => setIsSendDecisionModalOpen(null)}
          onSubmit={handleDecisionSubmit}
          defaultRecipients={decisionEmployeeIssueDetails?.email ? [decisionEmployeeIssueDetails.email] : []}
          showAttachment={true}
          customAttachmentSection={
            <NTEAttachmentSection
              pdfAttachment={decisionEmployeeIssueDetails?.nte_attachment || null}
              isDeleting={false}
              canDelete={false}
              onViewAttachment={handleViewAttachment}
              onDeleteAttachment={() => {}} // Empty function since delete is disabled
            />
          }
          submitButtonText="Send"
          isLoading={isLoading}
          prePopulatedData={decisionEmployeeIssueDetails ? {
            subject: decisionEmployeeIssueDetails.decision_subject,
            message: decisionEmployeeIssueDetails.decision_message,
            to: decisionEmployeeIssueDetails.decision_to ? JSON.parse(decisionEmployeeIssueDetails.decision_to) : [],
            cc: decisionEmployeeIssueDetails.decision_cc ? JSON.parse(decisionEmployeeIssueDetails.decision_cc) : [],
            bcc: decisionEmployeeIssueDetails.decision_bcc ? JSON.parse(decisionEmployeeIssueDetails.decision_bcc) : []
          } : undefined}
        />
      )}
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