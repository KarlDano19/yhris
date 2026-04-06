'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';

import Link from 'next/link';

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
import SendEmailModal from '@/components/SendEmailModal';
import { handleEmailSending, handleLetterSending, updateSeparationItems, LetterData } from './functions/emailHandlers';
import useGetSeparationItems from './hooks/useGetSeparationItems';
import useDeleteSeparation from './hooks/useDeleteSeparation';
import usePatchSeparation from './hooks/usePatchSeparation';
import useBulkDeleteSeparations from './hooks/useBulkDeleteSeparations';
import SeparationLetter from './SeparationLetter';
import SignDocuments from './SignDocuments';
import LastPay from './LastPay';
import Quitclaim from './Quitclaim';
import SeparationLetterAttachmentSection from './components/SeparationLetterAttachmentSection';
import Filter, { FilterGroup, FilterValues } from '@/components/common/Filter';
import { useFilterPersistence } from '@/components/hooks/useFilterPersistence';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import DeleteIcon from '@/svg/DeleteIcon';

import {
  T_DocumentsModal,
  T_LastPayModal,
  T_LetterModal,
  T_QuitclaimModal,
  T_DeleteSepartionModal,
} from '@/types/globals';

import classNames from '@/helpers/classNames';
import { formatDateToLocal } from '@/helpers/date';

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const queryClient = useQueryClient();
  const [separationItems, setSeparationItems] = useState<any>([]);
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
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    totalRecords: number;
    totalPages: number;
  }>({
    totalPages: 1,
    totalRecords: 0,
  });
  
  // Filter state with persistence (Unfinished checked by default)
  const [filters, setFilters] = useFilterPersistence<FilterValues>('employee-separation', {
    status: ['unfinished'],
  });
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isAddSeparationModalOpen, setIsAddSeparationModalOpen] = useState(false);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState<T_LetterModal | null>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState<T_DocumentsModal | null>(null);
  const [isLastPayModalOpen, setIsLastPayModalOpen] = useState<T_LastPayModal | null>(null);
  const [isQuitclaimModalOpen, setIsQuitclaimModalOpen] = useState<T_QuitclaimModal | null>(null);
  const [isDeleteSepartionModalOpen, setIsDeleteSepartionModalOpen] = useState<T_DeleteSepartionModal | null>(null);
  
  // Bulk delete states
  const [selectedSeparations, setSelectedSeparations] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteConfirmModalOpen, setIsBulkDeleteConfirmModalOpen] = useState<DeleteModalData | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);
  
  // Individual loading states for each received button
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});

  // Menu key to force close dropdowns on scroll
  const [menuKey, setMenuKey] = useState(0);

  const { mutate, isLoading } = usePatchSeparation();
  const { mutate: deleteSeparation, isLoading: isDeleteSeparationLoading } = useDeleteSeparation();
  const bulkDeleteMutation = useBulkDeleteSeparations();
  
  const { data: dataSeparation, isLoading: isGetSeparationLoading, refetch } = useGetSeparationItems({
    ...appliedFilter,
    pageSize: pageSize,
    currentPage: currentPage,
    status: filters.status?.join(','),
  });
  const [isSearching, setIsSearching] = useState(false);

  // Define filter groups for the Filter component
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

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setIsFilterLoading(true);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle filter loading state
  useEffect(() => {
    if (dataSeparation && isFilterLoading) {
      setIsFilterLoading(false);
    }
  }, [dataSeparation, isFilterLoading]);

  // Close dropdown menus on scroll by dispatching a click event
  useEffect(() => {
    const handleScroll = () => {
      // Dispatch a click event on body to close any open Headless UI menus
      document.body.click();
      // Increment menu key to force re-render and close any open menus
      setMenuKey(prev => prev + 1);
    };

    window.addEventListener('scroll', handleScroll, true); // Use capture to catch all scroll events
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
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
    const callbackReq = {
      onSuccess: (data: any) => {
        setSeparationItems([...separationItemsCopy]);
        setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });

        // Clear employee cache when quit claim is received (final step in separation)
        if (emailType === 'quit claim') {
          queryClient.invalidateQueries(['employeePaginatedSelectCache']);
        }
      },
      onError: (err: any) => {
        setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate(separationItemsCopy[itemIndex], callbackReq);
  };

  // Handler for Letter email submission  
  const handleLetterSubmit = (data: any) => {
    if (isLetterModalOpen && isLetterModalOpen.id) {
      const updatedItem = handleLetterSending(data, separationItems, isLetterModalOpen.id, isLetterModalOpen.type);
      
      mutate(updatedItem, {
        onSuccess: (data: any) => {
          const updatedSeparationItems = updateSeparationItems(separationItems, updatedItem, isLetterModalOpen.id);
          setSeparationItems(updatedSeparationItems);
          setIsLetterModalOpen(null);
          toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
          refetch();
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, {
            duration: 7000,
          });
        },
      });
    }
  };

  // Handler for Sign Documents email submission
  const handleSignDocumentsSubmit = (data: any) => {
    if (isDocumentModalOpen && isDocumentModalOpen.id) {
      const updatedItem = handleEmailSending(data, 'sign documents', separationItems, isDocumentModalOpen.id);
      
      mutate(updatedItem, {
        onSuccess: (data: any) => {
          setIsDocumentModalOpen(null);
          toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
          refetch();
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, {
            duration: 7000,
          });
        },
      });
    }
  };

  // Handler for Last Pay email submission
  const handleLastPaySubmit = (data: any) => {
    if (isLastPayModalOpen && isLastPayModalOpen.id) {
      const updatedItem = handleEmailSending(data, 'last pay', separationItems, isLastPayModalOpen.id);

      mutate(updatedItem, {
        onSuccess: (responseData: any) => {
          // Refetch to get updated data including saved attachments from backend
          refetch();
          setIsLastPayModalOpen(null);
          toast.custom(() => <CustomToast message={responseData.message} type='success' />, { duration: 5000 });
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, {
            duration: 7000,
          });
        },
      });
    }
  };

  // Handler for Quitclaim email submission
  const handleQuitclaimSubmit = (data: any) => {
    if (isQuitclaimModalOpen && isQuitclaimModalOpen.id) {
      const updatedItem = handleEmailSending(data, 'quit claim', separationItems, isQuitclaimModalOpen.id);

      mutate(updatedItem, {
        onSuccess: (responseData: any) => {
          // Refetch to get updated data including saved attachments from backend
          refetch();
          setIsQuitclaimModalOpen(null);
          toast.custom(() => <CustomToast message={responseData.message} type='success' />, { duration: 5000 });
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, {
            duration: 7000,
          });
        },
      });
    }
  };

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const handleSearch = () => {
    const dateFrom = Date.parse(itemsFilter.from);
    const dateTo = Date.parse(itemsFilter.to);
    if (dateFrom && !dateTo) {
      return toast.custom(() => <CustomToast message='Invalid date to.' type='error' />, { duration: 5000 });
    }
    if (!dateFrom && dateTo) {
      return toast.custom(() => <CustomToast message='Invalid date from.' type='error' />, { duration: 5000 });
    }
    if (dateFrom && dateTo && dateFrom > dateTo) {
      return toast.custom(
        () => <CustomToast message='You have entered an invalid date range. Please select again.' type='error' />,
        { duration: 5000 }
      );
    }
    setCurrentPage(1);
    setIsSearching(true);
    setAppliedFilter({
      ...itemsFilter,
      search: searchText
    });
  };

  useEffect(() => {
    if (!isGetSeparationLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isGetSeparationLoading, isSearching]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (dataSeparation) {
      let items = [];
      let totalPages = 1;
      let totalRecords = 0;

      // Handle paginated response structure
      if (dataSeparation.records) {
        items = dataSeparation.records.map((separation: any) => {
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
          separation['documents_attachment'] = separation.documents_attachment;  // Backward compatibility
          separation['document_attachments'] = separation.document_attachments || [];  // Multiple attachments
          separation['isLastPayReleased'] = separation.is_last_pay_released;
          separation['last_pay_attachment'] = separation.last_pay_attachment;
          separation['last_pay_attachments'] = separation.last_pay_attachments || [];
          separation['isQuitclaimSigned'] = separation.is_quit_claim_signed;
          separation['isQuitclaimReceived'] = separation.is_quit_claim_received;
          separation['quitclaimReceivedDate'] = formatDateToLocal(separation.quit_claim_received_date);
          separation['quit_claim_attachment'] = separation.quit_claim_attachment;
          separation['quitclaim_attachments'] = separation.quitclaim_attachments || [];
          separation['separationLetter'] = {
            subject: '',
            to: '',
            message: '',
            cc: [],
            bcc: [],
          };
          separation['acceptanceLetter'] = {
            subject: '',
            to: '',
            message: '',
            cc: [],
            bcc: [],
          };
          separation['signDocuments'] = {
            template: '',
            subject: '',
            to: '',
            message: '',
            cc: [],
            bcc: [],
          };
          separation['lastPay'] = {
            template: '',
            subject: '',
            to: '',
            message: '',
            cc: [],
            bcc: [],
          };
          separation['quitClaim'] = {
            template: '',
            subject: '',
            to: '',
            message: '',
            cc: [],
            bcc: [],
          };
          return separation;
        });
        totalPages = dataSeparation.total_pages || 1;
        totalRecords = dataSeparation.total_records || items.length;
      } 
      // Handle array response structure (no pagination from backend)
      else if (Array.isArray(dataSeparation)) {
        items = dataSeparation.map((separation: any) => {
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
          separation['documents_attachment'] = separation.documents_attachment;  // Backward compatibility
          separation['document_attachments'] = separation.document_attachments || [];  // Multiple attachments
          separation['isLastPayReleased'] = separation.is_last_pay_released;
          separation['last_pay_attachment'] = separation.last_pay_attachment;
          separation['last_pay_attachments'] = separation.last_pay_attachments || [];
          separation['isQuitclaimSigned'] = separation.is_quit_claim_signed;
          separation['isQuitclaimReceived'] = separation.is_quit_claim_received;
          separation['quitclaimReceivedDate'] = formatDateToLocal(separation.quit_claim_received_date);
          separation['quit_claim_attachment'] = separation.quit_claim_attachment;
          separation['quitclaim_attachments'] = separation.quitclaim_attachments || [];
          separation['separationLetter'] = {
            subject: '',
            to: '',
            message: '',
            cc: [],
            bcc: [],
          };
          separation['acceptanceLetter'] = {
            subject: '',
            to: '',
            message: '',
            cc: [],
            bcc: [],
          };
          separation['signDocuments'] = {
            template: '',
            subject: '',
            to: '',
            message: '',
            cc: [],
            bcc: [],
          };
          separation['lastPay'] = {
            template: '',
            subject: '',
            to: '',
            message: '',
            cc: [],
            bcc: [],
          };
          separation['quitClaim'] = {
            template: '',
            subject: '',
            to: '',
            message: '',
            cc: [],
            bcc: [],
          };
          return separation;
        });
        
        // Calculate pagination locally if backend doesn't support it
        totalRecords = items.length;
        totalPages = Math.ceil(totalRecords / pageSize);
      }

      setSeparationItems(items);
      setPagination({
        totalPages,
        totalRecords
      });
    }
  }, [dataSeparation, pageSize]);

  // Memoize selected letter item and prePopulatedData to avoid passing
  // a new object reference on each parent re-render (prevents modal from
  // resetting when parent re-renders, e.g., on scroll).
  const selectedLetter = useMemo(() => {
    return isLetterModalOpen?.id ? separationItems.find((item: any) => item.id === isLetterModalOpen.id) : null;
  }, [separationItems, isLetterModalOpen?.id]);

  const memoPrePopulatedData = useMemo(() => {
    if (!isLetterModalOpen) return undefined;
    const name = selectedLetter?.name || 'Employee';
    // Prefer saved separation_subject/message/to if present
    const subject = selectedLetter?.separation_subject && selectedLetter.separation_subject.trim() !== ''
      ? selectedLetter.separation_subject
      : `Letter of ${isLetterModalOpen.type} - ${name}`;
    const message = selectedLetter?.separation_message && selectedLetter.separation_message.trim() !== ''
      ? selectedLetter.separation_message
      : `<p>Dear ${name},</p><p>Please find attached your Letter of ${isLetterModalOpen.type}.</p><p>Best regards,<br>HR Department</p>`;
    // separation_to may be stored as JSON string or plain email
    let toEmails: string[] = [];
    if (selectedLetter?.separation_to) {
      try {
        const parsed = JSON.parse(selectedLetter.separation_to);
        toEmails = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        toEmails = selectedLetter.separation_to ? [selectedLetter.separation_to] : [];
      }
    } else {
      toEmails = selectedLetter?.email ? [selectedLetter.email] : [];
    }

    return {
      subject,
      message,
      to: toEmails,
      cc: selectedLetter?.separation_cc ? (() => {
        try { const p = JSON.parse(selectedLetter.separation_cc); return Array.isArray(p) ? p : [p]; } catch { return [selectedLetter.separation_cc]; }
      })() : [],
      bcc: selectedLetter?.separation_bcc ? (() => {
        try { const p = JSON.parse(selectedLetter.separation_bcc); return Array.isArray(p) ? p : [p]; } catch { return [selectedLetter.separation_bcc]; }
      })() : []
    };
  }, [isLetterModalOpen, selectedLetter]);

  // Memoize default recipients
  const useMemoDefaultRecipients = (modalId?: string | number) =>
    useMemo(() => {
      if (!modalId) return [];
      const it = separationItems.find((s: any) => s.id === modalId);
      return it?.email ? [it.email] : [];
    }, [separationItems, modalId]);

  const memoDefaultRecipientsDocument = useMemoDefaultRecipients(isDocumentModalOpen?.id);
  const memoDefaultRecipientsLastPay = useMemoDefaultRecipients(isLastPayModalOpen?.id);
  const memoDefaultRecipientsQuitclaim = useMemoDefaultRecipients(isQuitclaimModalOpen?.id);

  const memoDefaultRecipients = useMemo(() => {
    if (!isLetterModalOpen?.id) return [];
    const item = separationItems.find((item: any) => item.id === isLetterModalOpen.id);
    if (!item) return [];
    // Prefer saved separation_to if present
    if (item.separation_to) {
      try {
        const parsed = JSON.parse(item.separation_to);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return item.separation_to ? [item.separation_to] : (item.email ? [item.email] : []);
      }
    }
    return item.email ? [item.email] : [];
  }, [separationItems, isLetterModalOpen?.id]);

  // Update select all state when separations change
  useEffect(() => {
    if (separationItems) {
      const allSeparationIds = new Set(separationItems.map((s: any) => s.id));
      const allSelected = allSeparationIds.size > 0 && 
        Array.from(allSeparationIds).every((id: any) => selectedSeparations.has(id));
      setSelectAll(allSelected);
    }
  }, [selectedSeparations, separationItems]);

  // Handle individual separation selection
  const handleSeparationSelect = (separationId: number) => {
    setSelectedSeparations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(separationId)) {
        newSet.delete(separationId);
      } else {
        newSet.add(separationId);
      }
      return newSet;
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (!separationItems) return;
    
    if (selectAll) {
      setSelectedSeparations(new Set());
    } else {
      const allIds = separationItems.map((s: any) => s.id);
      setSelectedSeparations(new Set(allIds));
    }
  };

  // Handle bulk delete - opens confirmation modal
  const handleBulkDelete = () => {
    if (selectedSeparations.size === 0) return;
    setBulkDeleteCount(selectedSeparations.size);
    setIsBulkDeleteConfirmModalOpen({
      open: true,
    });
  };

  // Confirm the warning and open progress modal
  const confirmBulkDeleteWarning = () => {
    setIsBulkDeleteConfirmModalOpen(null);
    setIsBulkDeleteModalOpen(true);
  };

  // Perform the actual deletion (called by ProgressModal)
  const confirmBulkDelete = async () => {
    try {
      const separationIds = Array.from(selectedSeparations);
      await bulkDeleteMutation.mutateAsync(separationIds);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete separations';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
      setIsBulkDeleteModalOpen(false);
    }
  };

  // Handle success after deletion completes
  const handleBulkDeleteSuccess = () => {
    toast.custom(() => <CustomToast message={`${bulkDeleteCount} separation(s) deleted successfully.`} type="success" />, { duration: 3000 });
    // Clear employee select cache so the employees become searchable again
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
            <div className='py-5'>
              <LoadingSpinner size="lg" color="yellow" />
            </div>
          </td>
        </tr>
      );
    }
    
    // Check if no filter options are selected - show no data
    if (filters.status && filters.status.length === 0) {
      return (
        <tr>
          <td colSpan={9}>
            <div className='py-4'>
              <h4 className='text-center text-gray-300 text-sm'>No filter options selected.</h4>
            </div>
          </td>
        </tr>
      );
    }
    if (separationItems && separationItems.length > 0) {
      return separationItems.map((item: any) => (
        <tr key={item.id}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <input
              type="checkbox"
              checked={selectedSeparations.has(item.id)}
              onChange={() => handleSeparationSelect(item.id)}
              className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue"
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.separationDate}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='flex gap-2'>
              <span>{item.name}</span>
            </div>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.reasonForLeaving}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top'>
            <SeparationLetter
              id={item.id}
              isLetterSent={item.isLetterSent}
              isLetterReceived={item.isLetterReceived}
              letterReceivedDate={item.letterReceivedDate}
              letterAttachment={item.letter_attachment}
              letterAttachments={item.letter_attachments}
              setIsLetterModalOpen={setIsLetterModalOpen}
              setReceived={setReceived}
              isLoading={loadingStates[`${item.id}-letters`] || false}
              refetch={refetch}
              employerName={item.employer_name}
              effectiveDate={item.effective_date || item.date_of_separation}
              menuKey={menuKey}
              isQuitclaimSigned={item.isQuitclaimSigned}
              isQuitclaimReceived={item.isQuitclaimReceived}
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top'>
            <SignDocuments
              id={item.id}
              isDocumentsSent={item.isDocumentsSent}
              isDocumentsReceived={item.isDocumentsReceived}
              documentReceivedDate={item.documentReceivedDate}
              documentsAttachment={item.documents_attachment}  // Backward compatibility
              documentAttachments={item.document_attachments || []}  // Multiple attachments
              setIsDocumentModalOpen={setIsDocumentModalOpen}
              setReceived={setReceived}
              isLoading={loadingStates[`${item.id}-sign documents`] || false}
              isLetterReceived={item.isLetterReceived}
              isQuitclaimSigned={item.isQuitclaimSigned}
              isQuitclaimReceived={item.isQuitclaimReceived}
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top'>
            <LastPay
              id={item.id}
              isLastPayReleased={item.isLastPayReleased}
              quitclaimReceivedDate={item.quitclaimReceivedDate}
              lastPayAttachment={item.last_pay_attachment}
              lastPayAttachments={item.last_pay_attachments}
              setIsLastPayModalOpen={setIsLastPayModalOpen}
              isDocumentsReceived={item.isDocumentsReceived}
              isQuitclaimSigned={item.isQuitclaimSigned}
              isQuitclaimReceived={item.isQuitclaimReceived}
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top'>
            <Quitclaim
              id={item.id}
              isQuitclaimSigned={item.isQuitclaimSigned}
              isQuitclaimReceived={item.isQuitclaimReceived}
              quitclaimReceivedDate={item.quitclaimReceivedDate}
              quitclaimAttachment={item.quit_claim_attachment}
              quitclaimAttachments={item.quitclaim_attachments}
              setIsQuitclaimModalOpen={setIsQuitclaimModalOpen}
              setReceived={setReceived}
              isLoading={loadingStates[`${item.id}-quit claim`] || false}
              isLastPayReleased={item.isLastPayReleased}
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top'>
            <div className='flex justify-center space-x-2'>
              <SmartButton 
                id="edit-separation-btn"
                onClick={() => setIsDeleteSepartionModalOpen({ open: true, id: item.id, name: item.name })}
                disabled={selectedSeparations.size > 1}
                className={selectedSeparations.size > 1 ? 'opacity-50 cursor-not-allowed' : ''}
              >
                <DeleteIcon />
              </SmartButton>
            </div>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={9}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>{`There's no data yet.`}</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>
              Please click create to add separation of employee.
            </h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <Link href='/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Dashboard</h4>
          </Link>
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Employee Resignation/Separation</h2>
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
                  data-tooltip-id='search-tooltip'
                  data-tooltip-content='Search for: Employee Name / Reason of Leaving'
                  data-tooltip-place='bottom'
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
                <button
                  className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
                  onClick={handleSearch}
                >
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
          
          {/* Bulk Actions - Below Date Filters */}
          {selectedSeparations.size > 1 && (
            <div className="mt-4 ">
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
                  ) : (
                    'Delete Selected'
                  )}
                </SmartButton>
                <span className="text-sm text-gray-700 font-medium">
                  {selectedSeparations.size} selected
                </span>
              </div>
            </div>
          )}

          <div className={classNames('mt-8 flow-root', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='overflow-x-auto'>
              <table className={classNames(
                'min-w-full divide-y divide-gray-300 text-center',
                separationItems.length === 0 && 'mb-6'
              )}>
                <thead>
                  <tr>
                    <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        disabled={!separationItems || separationItems.length === 0}
                        className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue disabled:opacity-50"
                      />
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                      Date of Resignation/Separation
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                      Name
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                      Reason of Leaving
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                      Letter of Documentation
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                      Sign Documents
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                      Last Pay
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                      Quitclaim
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
              </table>
            </div>
            <hr />
          </div>
        </div>
        
        {/* Sticky Pagination */}
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
      <AddSeparationModal 
        isOpen={isAddSeparationModalOpen} 
        setIsOpen={setIsAddSeparationModalOpen} 
        refetch={refetch} 
      />
      {isLetterModalOpen && (
        <SendEmailModal
          title={`Letter of ${isLetterModalOpen.type}`}
          isOpen={!!isLetterModalOpen}
          onClose={() => setIsLetterModalOpen(null)}
          onSubmit={handleLetterSubmit}
          defaultRecipients={memoDefaultRecipients}
          showDragDropAttachment={true}
          allowMultipleAttachments={true}
          showAttachment={true}
          customAttachmentSection={
            <SeparationLetterAttachmentSection
              pdfAttachment={isLetterModalOpen?.id ? separationItems.find((item: any) => item.id === isLetterModalOpen.id)?.letter_attachment : null}
              letterType={isLetterModalOpen.type as 'Acceptance' | 'Separation'}
              onViewAttachment={(url: string) => window.open(url, '_blank')}
              canShowPreview={true}
            />
          }
          submitButtonText="Send Letter"
          isLoading={isLoading}
          prePopulatedData={memoPrePopulatedData}
        />
      )}
      {isDocumentModalOpen && (
        <SendEmailModal
          title="Sign Documents"
          isOpen={!!isDocumentModalOpen}
          onClose={() => setIsDocumentModalOpen(null)}
          onSubmit={handleSignDocumentsSubmit}
          defaultRecipients={memoDefaultRecipientsDocument}
          showDragDropAttachment={true}
          allowMultipleAttachments={true}
          submitButtonText="Send"
          isLoading={isLoading}
        />
      )}
      {isLastPayModalOpen && (
        <SendEmailModal
          title="Send Last Pay"
          isOpen={!!isLastPayModalOpen}
          onClose={() => setIsLastPayModalOpen(null)}
          onSubmit={handleLastPaySubmit}
          defaultRecipients={memoDefaultRecipientsLastPay}
          showDragDropAttachment={true}
          allowMultipleAttachments={true}
          submitButtonText="Send"
          isLoading={isLoading}
        />
      )}
      {isQuitclaimModalOpen && (
        <SendEmailModal
          title="Send Quitclaim"
          isOpen={!!isQuitclaimModalOpen}
          onClose={() => setIsQuitclaimModalOpen(null)}
          onSubmit={handleQuitclaimSubmit}
          defaultRecipients={memoDefaultRecipientsQuitclaim}
          showDragDropAttachment={true}
          allowMultipleAttachments={true}
          submitButtonText="Send"
          isLoading={isLoading}
        />
      )}
      {isDeleteSepartionModalOpen && (
        <DeleteModal
          isOpen={isDeleteSepartionModalOpen}
          setIsOpen={setIsDeleteSepartionModalOpen}
          onConfirm={() => {
            const callbackReq = {
              onSuccess: (data: any) => {
                toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
                // Clear employee select cache so the employee becomes searchable again
                queryClient.invalidateQueries(['employeePaginatedSelectCache']);
                setIsDeleteSepartionModalOpen(null);
                refetch();
              },
              onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
              },
            };
            deleteSeparation(isDeleteSepartionModalOpen.id, callbackReq);
          }}
          isLoading={isDeleteSeparationLoading}
        />
      )}
      
      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteConfirmModalOpen?.open && (
        <DeleteModal
          isOpen={isBulkDeleteConfirmModalOpen}
          setIsOpen={setIsBulkDeleteConfirmModalOpen}
          onConfirm={confirmBulkDeleteWarning}
          isLoading={false}
          customText={`${bulkDeleteCount} separation${bulkDeleteCount > 1 ? 's' : ''}`}
        />
      )}

      {/* Bulk Delete Progress Modal */}
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

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Content;
