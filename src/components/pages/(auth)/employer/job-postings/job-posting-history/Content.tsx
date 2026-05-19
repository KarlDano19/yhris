'use client';

import React, { Fragment, useEffect, useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';

import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import { Menu, Transition } from '@headlessui/react';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import BackButton from '@/components/BackButton';
import classNames from '@/helpers/classNames';
import { formatDateToLocal } from '@/helpers/date';
import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import CustomDatePicker from '@/components/CustomDatePicker';
import RightClickMenu from '@/components/RightClickMenu';
import Pagination from '@/components/Pagination';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import ProgressModal from '@/components/ProgressModal';
import SeederButton from '@/components/SeederButton';
import ConfirmModal from '@/components/ConfirmModal';
import SetJob from './SetJob';
import JobPreviewModal from './modals/JobPreviewModal';
import SetJobInactiveModal from './modals/SetJobInactiveModal';
import useGetJobPostItems from './hooks/get/useGetJobPostItems';
import UpdateJobModal from './modals/UpdateJobModal';
import useBulkDeleteJobPostings from './hooks/delete/useBulkDeleteJobPostings';
import useDeleteJobPost from './hooks/delete/useDeleteJobPost';
import useDuplicateJobPosting from './hooks/useDuplicateJobPosting';

import useGetJobDraftsItems from './hooks/get/useGetJobDraftsItems';

import useUpdateJobPostStatus from './hooks/update/useUpdateJobPostStatus';
import useUpdateJobSalaryStatus from './hooks/update/useUpdateJobSalaryStatus';
import useUpdateJobRolesStatus from './hooks/update/useUpdateJobRolesStatus';
import useUpdateJobRemarkStatus from './hooks/update/useUpdateJobRemarkStatus';
import useUpdateJobBenefitStatus from './hooks/update/useUpdateJobBenefitStatus';

import { MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { Facebook, Indeed, LinkedIn, Instagram, Twitter } from '@/svg/SocialMedia';
import { ChevronRightIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import MoreIconWithBorder from '@/svg/MoreIconWithBorder';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import DuplicateIcon from '@/svg/DuplicateIcon';
import AssignUsersModal from './modals/AssignUsersModal';
import ConfirmSocialShareModal from '../modals/ConfirmSocialShareModal';

import { T_JobPreviewModal } from '@/types/globals';
import {
  T_JobPostingTable,
  T_ToggleJobPostStatusPayload,
  T_ToggleJobSalaryPayload,
  T_ToggleJobRolesPayload,
  T_ToggleJobRemarkPayload,
  T_ToggleJobBenefitPayload,
  T_JobPostingDraft,
} from '@/types/job_posting';

import { draftStorage } from '@/helpers/draftStorage';
import { useQueryClient } from '@tanstack/react-query';

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type ComponentMap = {
  [key: string]: React.ElementType;
};

interface T_ModalData extends DeleteModalData {
  id: number | null;
}

type T_BulkDeleteModalData = DeleteModalData & {
  selectedCount: number;
};


const Content = () => {
  const router = useRouter();
  const [draftCurrentPage, setDraftCurrentPage] = useState(1);
  const [draftPageSize, setDraftPageSize] = useState(10);
  const [draftPagination, setDraftPagination] = useState<PaginationProps>({ totalPages: 1, totalRecords: 0 });

  const { data: draftsTableData, isLoading: isDraftsTableLoading } = useGetJobDraftsItems({
    currentPage: draftCurrentPage,
    pageSize: draftPageSize,
  });

  const draftRecords = useMemo(() => {
    const backendRecords: T_JobPostingDraft[] = draftsTableData?.records || [];
    if (draftCurrentPage === 1) {
      const localDraft = draftStorage.load();
      if (localDraft && localDraft.data && Object.keys(localDraft.data).length > 0) {
        return [
          {
            id: 0,
            draft_data: localDraft.data,
            source: 'browser_close',
            job_title: localDraft.data.job_title || 'Untitled Job',
            position: localDraft.data.position || null,
            uploaded_job_description: null,
            uploaded_custom_poster: null,
            created_at: localDraft.timestamp ? new Date(localDraft.timestamp).toISOString() : new Date().toISOString(),
            updated_at: localDraft.timestamp ? new Date(localDraft.timestamp).toISOString() : new Date().toISOString(),
          } as T_JobPostingDraft,
          ...backendRecords,
        ];
      }
    }
    return backendRecords;
  }, [draftsTableData, draftCurrentPage]);

  const componentMap: ComponentMap = {
    Facebook,
    Indeed,
    LinkedIn,
    Instagram,
    Twitter,
    // Add other components here if needed
  };
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedJobId, setSelectedJobId] = useState<any>();
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuOptions, setContextMenuOptions] = useState<any>([]);
  const [jobPostHistoryItems, setJobPostHistoryItems] = useState<T_JobPostingTable[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState<T_ModalData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<T_ModalData | null>(null);
  const [assignUsersModal, setAssignUsersModal] = useState<T_ModalData | null>(null);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [duplicateJobPostingId, setDuplicateJobPostingId] = useState<number | null>(null);
  
  // Bulk delete states
  const [selectedJobPostings, setSelectedJobPostings] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteConfirmModalOpen, setIsBulkDeleteConfirmModalOpen] = useState<T_BulkDeleteModalData | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);

  const [pendingFilter, setPendingFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
    status: 'all', // all, active, inactive
  });
  const [appliedFilter, setAppliedFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
    status: 'all', // all, active, inactive
  });
  const [isJobPreviewOpen, setIsJobPreviewOpen] = useState<T_JobPreviewModal | null>(null);
  const [isSetJobInactiveModalOpen, setIsSetJobInactiveModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPages: 1,
    totalRecords: 0,
  });
  const {
    data: dataJobPost,
    isLoading: isGetJobPostLoading,
    refetch,
  } = useGetJobPostItems({
    ...appliedFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });
  const { mutate: mutateStatus } = useUpdateJobPostStatus();
  const { mutate: mutateSalary } = useUpdateJobSalaryStatus();
  const { mutate: mutateRoles } = useUpdateJobRolesStatus();
  const { mutate: mutateRemark } = useUpdateJobRemarkStatus();
  const { mutate: mutateBenefit } = useUpdateJobBenefitStatus();
  const bulkDeleteMutation = useBulkDeleteJobPostings();
  const { mutate: deleteJobPost, isLoading: isDeleteLoading } = useDeleteJobPost();
  const { mutate: duplicateJobPosting, isLoading: isDuplicateJobPostingLoading } = useDuplicateJobPosting();
  
  const [showShareOptions, setShowShareOptions] = useState<{ [key: number]: boolean }>({});
  const menuButtonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['userRightsCache']) as { state: { data: any } | undefined };
  const [isSearching, setIsSearching] = useState(false);

  // Menu key to force close dropdowns on scroll
  const [menuKey, setMenuKey] = useState(0);

  // Social share modal state
  const [socialType, setSocialType] = useState<string | null>(null);
  const [socialOgUrl, setOgUrl] = useState<string>('');
  const [isSocialShareModalOpen, setIsSocialShareModalOpen] = useState(false);
  const [isSocialShareModalClosed, setIsSocialShareModalClosed] = useState(false);
  const isSocialShareModalClosedRef = useRef(isSocialShareModalClosed);

  useEffect(() => {
    isSocialShareModalClosedRef.current = isSocialShareModalClosed;
  }, [isSocialShareModalClosed]);

  const openConfirmSocialShareModal = (social: string, og_url: string) => {
    setOgUrl(og_url);

    const openModalAndWait = async (social: string) => {
      return new Promise<void>((resolve) => {
        setSocialType(social);
        setIsSocialShareModalOpen(true);
        const interval = setInterval(() => {
          if (isSocialShareModalClosedRef.current) {
            clearInterval(interval);
            setIsSocialShareModalClosed(false);
            setIsSocialShareModalOpen(false);
            resolve();
          }
        }, 100);
      });
    };

    const splitSocial = social.split(',');
    const processSocialShares = async () => {
      // Add a small delay to ensure UpdateJobModal has fully closed
      await new Promise(resolve => setTimeout(resolve, 300));

      for (const social of splitSocial) {
        await openModalAndWait(social);
      }
    };

    processSocialShares();
  };

  const socialMediaShareModal = () => {
    // Add timestamp to force LinkedIn/Facebook to re-scrape updated job metadata (bypass cache)
    const urlWithTimestamp = `${socialOgUrl}${socialOgUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
    const encoded_url = encodeURIComponent(urlWithTimestamp);
    if (socialType === 'Facebook') {
      const og_url = `${encoded_url}%26source%3Dfacebook`;
      shareFb(og_url);
      return;
    }
    if (socialType === 'LinkedIn') {
      const og_url = `${encoded_url}%26source%3Dlinkedin`;
      shareLinkedIn(og_url);
      return;
    }
  };

  const handleRightClick = (event: any, jobPost: any) => {
    event.preventDefault();

    let menuOptions: any = {};

    let rightClickItemLabel = 'Set as Inactive';
    let successMessage = 'Successfully set job as inactive.';
    if (!jobPost['is_active']) {
      rightClickItemLabel = 'Set as Active';
      successMessage = 'Successfully set job as active.';
    }

    menuOptions['label'] = rightClickItemLabel;
    menuOptions['action'] = (jobId: any) => {
      const data: T_ToggleJobPostStatusPayload = {
        jobId: jobId,
        is_active: !jobPost['is_active'],
      };
      const callbackReq = {
        onSuccess: () => {
          refetch();
          toast.custom(() => <CustomToast message={successMessage} type='success' />, {
            duration: 5000,
          });
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, {
            duration: 7000,
          });
        },
      };
      mutateStatus(data, callbackReq);
    };

    setContextMenuOptions([menuOptions]);
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setShowContextMenu(true);
    setSelectedJobId(jobPost.id);
  };

  const handleSetAsInactive = (jobId: any, isActive: boolean) => {
    const data: T_ToggleJobPostStatusPayload = {
      jobId: jobId,
      is_active: !isActive,
    };
    const successMessage = isActive ? 'Successfully set job as inactive.' : 'Successfully set job as active.';

    const callbackReq = {
      onSuccess: () => {
        refetch();
        toast.custom(() => <CustomToast message={successMessage} type='success' />, {
          duration: 5000,
        });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };

    mutateStatus(data, callbackReq);
  };

  const handleShowRoles = (jobId: any, isShowRoles: boolean) => {
    const data: T_ToggleJobRolesPayload = {
      jobId: jobId,
      is_show_roles: !isShowRoles,
    };
    const successMessage = isShowRoles ? 'Successfully HIDE ROLES.' : 'Successfully SHOW ROLES.';
    const callbackReq = {
      onSuccess: () => {
        refetch();
        toast.custom(() => <CustomToast message={successMessage} type='success' />, {
          duration: 5000,
        });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutateRoles(data, callbackReq);
  };

  const handleShowSalary = (jobId: any, isShowSalary: boolean) => {
    const data: T_ToggleJobSalaryPayload = {
      jobId: jobId,
      is_show_salary: !isShowSalary,
    };
    const successMessage = isShowSalary ? 'Successfully HIDE SALARY.' : 'Successfully SHOW SALARY.';
    const callbackReq = {
      onSuccess: () => {
        refetch();
        toast.custom(() => <CustomToast message={successMessage} type='success' />, {
          duration: 5000,
        });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutateSalary(data, callbackReq);
  };

  const handleShowNotes = (jobId: any, isShowNotes: boolean) => {
    const data: T_ToggleJobRemarkPayload = {
      jobId: jobId,
      is_show_remarks: !isShowNotes,
    };
    const successMessage = isShowNotes ? 'Successfully HIDE NOTES & REMARKS.' : 'Successfully SHOW NOTES & REMARKS.';
    const callbackReq = {
      onSuccess: () => {
        refetch();
        toast.custom(() => <CustomToast message={successMessage} type='success' />, {
          duration: 5000,
        });
      },
    };
    mutateRemark(data, callbackReq);
  };

  const handleShowBenefits = (jobId: any, isShowBenefits: boolean) => {
    const data: T_ToggleJobBenefitPayload = {
      jobId: jobId,
      is_show_benefits: !isShowBenefits,
    };
    const successMessage = isShowBenefits ? 'Successfully HIDE BENEFITS.' : 'Successfully SHOW BENEFITS.';
    const callbackReq = {
      onSuccess: () => {
        refetch();
        toast.custom(() => <CustomToast message={successMessage} type='success' />, {
          duration: 5000,
        });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 5000,
        });
      },
    };
    mutateBenefit(data, callbackReq);
  };

  const handleCloseContextMenu = () => {
    setShowContextMenu(false);
  };

  useEffect(() => {
    if (dataJobPost && !isGetJobPostLoading) {
      setJobPostHistoryItems(dataJobPost.records as T_JobPostingTable[]);
      setPagination({
        totalPages: dataJobPost.total_pages,
        totalRecords: dataJobPost.total_records,
      });
    }
  }, [dataJobPost]);

  useEffect(() => {
    if (draftsTableData?.records) {
      setDraftPagination({
        totalPages: draftsTableData.total_pages,
        totalRecords: draftsTableData.total_records,
      });
    }
  }, [draftsTableData]);


  // Close share options when changing pages
  useEffect(() => {
    setShowShareOptions({});
  }, [currentPage]);

  // Close dropdown menus on scroll by dispatching a click event
  useEffect(() => {
    const handleScroll = () => {
      // Dispatch a click event on body to close any open Headless UI menus
      document.body.click();
      setShowShareOptions({});
      // Increment menu key to force re-render and close any open menus
      setMenuKey(prev => prev + 1);
    };

    window.addEventListener('scroll', handleScroll, true); // Use capture to catch all scroll events
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  // Calculate dropdown position synchronously based on button position
  const getDropdownPosition = (jobId: number) => {
    const button = menuButtonRefs.current[jobId];
    if (button) {
      const rect = button.getBoundingClientRect();

      return {
        top: rect.bottom + 4,
        left: rect.right - 192, // 192px = w-48 (12rem), align to right edge
      };
    }
    return { top: -9999, left: -9999 }; // Off-screen if button not found
  };

  // Update select all state when job postings change
  useEffect(() => {
    if (jobPostHistoryItems) {
      const allJobPostingIds = new Set(jobPostHistoryItems.map((j: T_JobPostingTable) => j.id));
      const allSelected = allJobPostingIds.size > 0 && 
        Array.from(allJobPostingIds).every((id: any) => selectedJobPostings.has(id));
      setSelectAll(allSelected);
    }
  }, [selectedJobPostings, jobPostHistoryItems]);

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const draftPaginationChange = (event: any) => {
    setDraftCurrentPage(event.selected + 1);
  };

  const draftPageSizeChange = (value: number) => {
    setDraftCurrentPage(1);
    setDraftPageSize(value);
  };

  const socialMediaShare = (social: string, og_url: string) => {
    // Add timestamp to force LinkedIn/Facebook to re-scrape metadata (bypass cache)
    const urlWithTimestamp = `${og_url}${og_url.includes('?') ? '&' : '?'}t=${Date.now()}`;
    const encoded_url = encodeURIComponent(urlWithTimestamp);
    if (social === 'Facebook') {
      og_url = `${encoded_url}%26source%3Dfacebook`;
      shareFb(og_url);
      return;
    }
    if (social === 'LinkedIn') {
      og_url = `${encoded_url}%26source%3Dlinkedin`;
      shareLinkedIn(og_url);
      return;
    }
  };

  const shareFb = (og_url: string) => {
    const FBSharer = `https://www.facebook.com/sharer/sharer.php?u=${og_url}`;
    window.open(FBSharer);
  };

  const shareLinkedIn = (og_url: string) => {
    const LinkedInSharer = `https://www.linkedin.com/shareArticle?mini=true&url=${og_url}`;
    window.open(LinkedInSharer);
  };

  const handleSearch = () => {
    const dateFrom = Date.parse(pendingFilter.from);
    const dateTo = Date.parse(pendingFilter.to);
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
    setAppliedFilter({ ...pendingFilter });
  };

  useEffect(() => {
    if (!isGetJobPostLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isGetJobPostLoading, isSearching]);

  // Handle individual job posting selection
  const handleJobPostingSelect = (jobPostingId: number) => {
    setSelectedJobPostings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobPostingId)) {
        newSet.delete(jobPostingId);
      } else {
        newSet.add(jobPostingId);
      }
      return newSet;
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (!jobPostHistoryItems) return;
    
    if (selectAll) {
      setSelectedJobPostings(new Set());
    } else {
      const allIds = jobPostHistoryItems.map((j: T_JobPostingTable) => j.id);
      setSelectedJobPostings(new Set(allIds));
    }
  };

  // Handle bulk delete - opens confirmation modal
  const handleBulkDelete = () => {
    if (selectedJobPostings.size === 0) return;
    setBulkDeleteCount(selectedJobPostings.size);
    setIsBulkDeleteConfirmModalOpen({
      open: true,
      selectedCount: selectedJobPostings.size,
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
      const jobPostingIds = Array.from(selectedJobPostings);
      await bulkDeleteMutation.mutateAsync(jobPostingIds);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete job postings';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
      setIsBulkDeleteModalOpen(false);
    }
  };

  // Handle success after deletion completes
  const handleBulkDeleteSuccess = () => {
    toast.custom(() => <CustomToast message={`${bulkDeleteCount} job posting(s) deleted successfully.`} type="success" />, { duration: 3000 });
    setSelectedJobPostings(new Set());
    setSelectAll(false);
    setBulkDeleteCount(0);
    refetch();
  };

  // Handle duplicate job posting
  const openDuplicateModal = (jobPost: any) => {
    setDuplicateJobPostingId(jobPost.id);
    setIsDuplicateModalOpen(true);
  };

  const handleDuplicateConfirm = () => {
    if (!duplicateJobPostingId) return;

    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message || 'Job posting duplicated successfully'} type='success' />, { duration: 4000 });
        setIsDuplicateModalOpen(false);
        setDuplicateJobPostingId(null);
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err || 'Failed to duplicate job posting'} type='error' />, { duration: 4000 });
      },
    };
    duplicateJobPosting(duplicateJobPostingId, callbackReq);
  };

  const renderRows = () => {
    if (isSearching || isGetJobPostLoading) {
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
    if (jobPostHistoryItems && jobPostHistoryItems.length > 0) {
      return jobPostHistoryItems.map((jobPost: T_JobPostingTable) => (
        <tr
          onContextMenu={(event) => {
            handleRightClick(event, jobPost);
          }}
          key={jobPost.id}
          className='text-center'
        >
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <input
              type="checkbox"
              checked={selectedJobPostings.has(jobPost.id)}
              onChange={() => handleJobPostingSelect(jobPost.id)}
              className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue"
            />
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              jobPost.is_active ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            {jobPost.id}
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              jobPost.is_active ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            {formatDateToLocal(jobPost.created_at)}
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              jobPost.is_active ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            <SetJob
              id={jobPost.id}
              jobTitle={jobPost.job_title}
              setIsJobPreviewOpen={setIsJobPreviewOpen}
            />
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              jobPost.is_active ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            {jobPost.position || 'N/A'}
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              jobPost.is_active ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            {jobPost.job_type}
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              jobPost.is_active ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            {jobPost.job_schedule}
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm ${
              jobPost.is_active ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            <div className="flex flex-col items-center gap-0.5">
              <span className={`font-semibold ${jobPost.is_fully_staffed ? 'text-green-600' : 'text-gray-700'}`}>
                {jobPost.slots_display}
              </span>
              {jobPost.is_fully_staffed && (
                <span 
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                  data-tooltip-id="fully-staffed-tooltip"
                  data-tooltip-content="All positions filled"
                >
                  ✓ Full
                </span>
              )}
              {!jobPost.is_fully_staffed && jobPost.remaining_slots > 0 && (
                <span className="text-xs text-amber-600">
                  {jobPost.remaining_slots} remaining
                </span>
              )}
            </div>
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              jobPost.is_active ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            {jobPost.work_setup}
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center ${
              jobPost.is_active ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            {jobPost.assignments_count || 0} users
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500' style={{ overflow: 'visible' }}>
            <div className='flex justify-center items-center space-x-2 relative'>
                <SmartButton 
                  id="edit-job-btn"
                  onClick={() => setIsEditModalOpen({ id: jobPost.id, open: true })}
                  data-tooltip-id="edit-tooltip"
                  data-tooltip-content="Edit Job"
                >
                  <EditIcon />
                </SmartButton>
                <SmartButton 
                  id="duplicate-job-btn"
                  onClick={() => openDuplicateModal(jobPost)}
                  data-tooltip-id="duplicate-tooltip"
                  data-tooltip-content="Duplicate Job"
                  className="p-[7px] bg-white border border-gray-300 rounded-md"
                >
                  <DuplicateIcon />
                </SmartButton>
                <SmartButton 
                  id="delete-job-btn"
                  onClick={() => setIsDeleteModalOpen({ id: jobPost.id, open: true })}
                  data-tooltip-id="delete-tooltip"
                  data-tooltip-content="Delete Job"
                  disabled={selectedJobPostings.size > 1}
                  className={selectedJobPostings.size > 1 ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  <DeleteIcon />
                </SmartButton>
                <SmartButton 
                  id="assign-job-btn"
                  onClick={() => setAssignUsersModal({ 
                    id: jobPost.id, 
                    open: true 
                  })}
                  data-tooltip-id="assign-tooltip"
                  data-tooltip-content="Assign to Users"
                  className="text-blue-600 hover:text-blue-800 p-1 disabled:opacity-50"
                >
                  <UserGroupIcon className="h-10 w-10 text-blue-600 p-2 bg-white border border-blue-600 rounded-md" />
                </SmartButton>
                <Menu as="div" key={menuKey} className="relative more-menu-container inline-block text-left">
                  {({ open }) => {
                    const position = open ? getDropdownPosition(jobPost.id) : { top: -9999, left: -9999 };
                    return (
                    <>
                      <Menu.Button
                        ref={(el: HTMLButtonElement | null) => { menuButtonRefs.current[jobPost.id] = el; }}
                        className="flex items-center"
                      >
                        <MoreIconWithBorder />
                      </Menu.Button>
                      {typeof document !== 'undefined' && createPortal(
                        <Transition
                          as={Fragment}
                          show={open}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                          beforeLeave={() => setShowShareOptions((prev) => ({ ...prev, [jobPost.id]: false }))}
                        >
                          <Menu.Items
                            static
                            className="fixed z-[9999] w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-[calc(100vh-16px)] overflow-y-auto"
                            style={{
                              top: position.top,
                              left: position.left,
                            }}
                          >
                            <div className="py-1 text-left">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setShowShareOptions((prev) => ({ ...prev, [jobPost.id]: !prev[jobPost.id] }));
                                    }}
                                    className={`${active ? 'bg-gray-100' : ''} block w-full px-4 py-2 text-left text-sm border-b`}
                                  >
                                    Share Post To <ChevronRightIcon className='inline h-4 w-4' />
                                  </button>
                                )}
                              </Menu.Item>
                              {showShareOptions[jobPost.id] && (
                                <div className='pl-4 flex flex-wrap'>
                                  {jobPost.shared_to.split(',').map((social: any) => {
                                    const DynamicComponent = componentMap[social];
                                    return (
                                      <span
                                        key={social}
                                        className='px-2 py-1 hover:bg-gray-100 cursor-pointer'
                                        onClick={() => socialMediaShare(social, jobPost.og_url!)}
                                      >
                                        <DynamicComponent />
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    onClick={() => handleSetAsInactive(jobPost.id, jobPost.is_active)}
                                    className={`${active ? 'bg-gray-100' : ''} block w-full px-4 py-2 text-left text-sm border-b ${!jobPost.is_active ? 'text-red-500' : ''}`}
                                  >
                                    {jobPost.is_active ? 'Set as Inactive' : 'Set as Active'}
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    onClick={() => handleShowRoles(jobPost.id, jobPost.is_show_roles)}
                                    className={`${active ? 'bg-gray-100' : ''} block w-full px-4 py-2 text-left text-sm border-b ${!jobPost.is_show_roles ? 'text-red-500' : ''}`}
                                  >
                                    {jobPost.is_show_roles ? 'Hide Roles' : 'Show Roles'}
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    onClick={() => handleShowSalary(jobPost.id, jobPost.is_show_salary)}
                                    className={`${active ? 'bg-gray-100' : ''} block w-full px-4 py-2 text-left text-sm border-b ${!jobPost.is_show_salary ? 'text-red-500' : ''}`}
                                  >
                                    {jobPost.is_show_salary ? 'Hide Salary' : 'Show Salary'}
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    onClick={() => handleShowBenefits(jobPost.id, jobPost.is_show_benefits)}
                                    className={`${active ? 'bg-gray-100' : ''} block w-full px-4 py-2 text-left text-sm border-b ${!jobPost.is_show_benefits ? 'text-red-500' : ''}`}
                                  >
                                    {jobPost.is_show_benefits ? 'Hide Benefits' : 'Show Benefits'}
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    onClick={() => handleShowNotes(jobPost.id, jobPost.is_show_remarks)}
                                    className={`${active ? 'bg-gray-100' : ''} block w-full px-4 py-2 text-left text-sm ${!jobPost.is_show_remarks ? 'text-red-500' : ''}`}
                                  >
                                    {jobPost.is_show_remarks ? 'Hide Notes/Remarks' : 'Show Notes/Remarks'}
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>,
                        document.body
                      )}
                    </>
                    );
                  }}
                </Menu>
            </div>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={100}>
            <div className='flex justify-center items-center py-4'>
              <p className='text-gray-300 text-sm'>There&apos;s no data found.</p>
            </div>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <BackButton label="Dashboard" href="/post-job" />
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <div className='flex items-center justify-between mb-0'>
            <h2 className='text-xl font-bold text-indigo-dye'>Job Posting History</h2>
            <div className='hidden lg:block -mb-4'>
              <SeederButton
                viewType="job_posting"
                maxCount={1000}
                defaultCount={5}
                onSeedSuccess={() => { setSelectedJobPostings(new Set()); setSelectAll(false); setShowShareOptions({}); refetch(); }}
                onUnseedSuccess={() => { setSelectedJobPostings(new Set()); setSelectAll(false); setShowShareOptions({}); refetch(); }}
              />
            </div>
          </div>
        </div>

        {/* Content Section with flex-1 */}
        <div className='px-2 md:px-8 lg:px-4 mt-6 flex-1'>
          <div className='flex flex-col lg:flex-row items-left gap-4'>
            <div className='flex-none flex flex-col md:flex-row items-left md:items-center gap-2 flex-wrap md:flex-nowrap'>
              <div className='relative flex-1 md:flex-none min-w-[140px] md:min-w-0'>
                <CustomDatePicker
                  id='from-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className='appearance-none block w-full rounded-md py-1.5 px-3 md:pl-3 md:pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 md:placeholder:text-black text-sm leading-6'
                  selected={pendingFilter.from}
                  pickerOnChange={(date: any) => {
                    setPendingFilter({ ...pendingFilter, from: date });
                  }}
                  inputOnChange={(value: any) => {
                    setPendingFilter({ ...pendingFilter, from: value });
                  }}
                />
              </div>
              <p className='text-gray-600 text-sm md:text-base self-center'>to</p>
              <div className='relative flex-1 md:flex-none min-w-[140px] md:min-w-0'>
                <CustomDatePicker
                  id='to-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className='appearance-none block w-full rounded-md py-1.5 px-3 md:pl-3 md:pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 md:placeholder:text-black text-sm leading-6'
                  selected={pendingFilter.to}
                  pickerOnChange={(date: any) => {
                    setPendingFilter({ ...pendingFilter, to: date });
                  }}
                  inputOnChange={(value: any) => {
                    setPendingFilter({
                      ...pendingFilter,
                      to: value,
                    });
                  }}
                  minDate={pendingFilter.from}
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
                  data-tooltip-content='Search for Job: Title, Postion, Type, Schedule, Work Setup'
                  data-tooltip-place='bottom'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  value={pendingFilter.search}
                  onChange={(e) => {
                    setPendingFilter({ ...pendingFilter, search: e.target.value });
                  }}
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
            <div className='flex-1 flex justify-start lg:justify-end gap-3 flex-wrap items-center'>
              <div className='lg:hidden'>
                <SeederButton
                  viewType="job_posting"
                  maxCount={1000}
                  defaultCount={5}
                  onSeedSuccess={() => { setSelectedJobPostings(new Set()); setSelectAll(false); setShowShareOptions({}); refetch(); }}
                  onUnseedSuccess={() => { setSelectedJobPostings(new Set()); setSelectAll(false); setShowShareOptions({}); refetch(); }}
                />
              </div>
            </div>
          </div>
          
          {/* Status Filter Tabs and Bulk Actions */}
          <div className="mt-8">
            <div className="flex flex-wrap justify-between items-center gap-2">
              {/* Status Filter Tabs - Left Side */}
              <div className="flex flex-wrap justify-center md:justify-start md:pl-4 lg:pl-10 gap-2">
                <div
                  onClick={() => {
                    setPendingFilter({ ...pendingFilter, status: 'all' });
                    setAppliedFilter({ ...appliedFilter, status: 'all' });
                  }}
                  className={`cursor-pointer px-3 sm:px-4 py-2 rounded-md transition-all duration-200 text-center ${
                    appliedFilter.status === 'all'
                      ? 'bg-white text-sky-600 border-2 border-sky-600 shadow-sm'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  All Jobs
                </div>
                <div
                  onClick={() => {
                    setPendingFilter({ ...pendingFilter, status: 'active' });
                    setAppliedFilter({ ...appliedFilter, status: 'active' });
                  }}
                  className={`cursor-pointer px-3 sm:px-4 py-2 rounded-md transition-all duration-200 text-center ${
                    appliedFilter.status === 'active'
                      ? 'bg-white text-green-600 border-2 border-green-600 shadow-sm'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  Active
                </div>
                <div
                  onClick={() => {
                    setPendingFilter({ ...pendingFilter, status: 'inactive' });
                    setAppliedFilter({ ...appliedFilter, status: 'inactive' });
                  }}
                  className={`cursor-pointer px-3 sm:px-4 py-2 rounded-md transition-all duration-200 text-center ${
                    appliedFilter.status === 'inactive'
                      ? 'bg-white text-red-600 border-2 border-red-600 shadow-sm'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  Inactive
                </div>
                <div
                  onClick={() => {
                    setPendingFilter({ ...pendingFilter, status: 'drafts' });
                    setAppliedFilter({ ...appliedFilter, status: 'drafts' });
                  }}
                  className={`cursor-pointer px-3 sm:px-4 py-2 rounded-md transition-all duration-200 text-center flex items-center gap-2 ${
                    appliedFilter.status === 'drafts'
                      ? 'bg-white text-yellow-600 border-2 border-yellow-500 shadow-sm'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  Drafts
                </div>
              </div>

              {/* Bulk Actions - Right Side */}
              {selectedJobPostings.size > 1 && (
                <div className="flex items-center gap-3 md:pr-4 lg:pr-10">
                  <SmartButton
                    id="delete-job-btn"
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
                    {selectedJobPostings.size} selected
                  </span>
                </div>
              )}
            </div>
          </div>

          {appliedFilter.status === 'drafts' ? (
            <div className='mt-8'>
              {isDraftsTableLoading ? (
                <div className='flex justify-center py-12'>
                  <LoadingSpinner />
                </div>
              ) : draftRecords.length === 0 ? (
                <div className='text-center py-16 text-gray-400'>
                  <p className='text-base font-medium'>No drafts found.</p>
                  <p className='text-sm mt-1'>Drafts appear here when you save a job posting as a draft.</p>
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-300 text-center'>
                    <thead>
                      <tr>
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                          Job Title
                        </th>
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                          Last Saved
                        </th>
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>
                      {draftRecords.map((draft) => (
                        <tr key={draft.id === 0 ? 'local' : draft.id}>
                          <td className='px-3 py-4 text-sm text-gray-900'>
                            <div className='font-medium'>
                              {draft.job_title || 'Untitled Job'}
                            </div>
                            {draft.id === 0 && (
                              <span className='inline-block mt-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5'>
                                Local (not synced)
                              </span>
                            )}
                          </td>
                          <td className='px-3 py-4 text-sm text-gray-500'>
                            {formatDateToLocal(draft.updated_at)}
                          </td>
                          <td className='px-3 py-4'>
                            <button
                              onClick={() => router.push(`/post-job?resumeDraftId=${draft.id}`)}
                              className='inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-savoy-blue rounded-md hover:bg-savoy-blue/90 transition-colors'
                            >
                              <PencilSquareIcon className='w-4 h-4' />
                              Resume
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className='mt-8 flow-root'>
              <div className='overflow-x-auto'>
                <table
                  className={classNames(
                    'min-w-full divide-y divide-gray-300 text-center',
                    jobPostHistoryItems.length === 0 && 'mb-6'
                  )}
                >
                  <thead>
                    <tr>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          disabled={!jobPostHistoryItems || jobPostHistoryItems.length === 0}
                          className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue disabled:opacity-50"
                        />
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Job No.
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date Created
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Job Title
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Position
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Job Type
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Job Schedule
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        No. of Hires Needed
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Work Setup
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Assigned Users
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
                </table>
              </div>
              <hr />
            </div>
          )}
        </div>

        {/* Sticky Pagination */}
        <div className="px-2 md:px-8 lg:px-4 mt-8 mb-36 md:sticky md:bottom-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t">
          {appliedFilter.status === 'drafts' ? (
            <Pagination
              pagination={draftPagination}
              currentPage={draftCurrentPage}
              pageSize={draftPageSize}
              onPageSizeChange={draftPageSizeChange}
              onPageChange={draftPaginationChange}
            />
          ) : (
            <Pagination
              pagination={pagination}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageSizeChange={pageSizeChange}
              onPageChange={paginationChange}
            />
          )}
        </div>
      </div>
      <JobPreviewModal
        id={isJobPreviewOpen?.id ? isJobPreviewOpen?.id : null}
        jobPostHistoryItems={jobPostHistoryItems}
        isOpen={isJobPreviewOpen}
        setIsOpen={setIsJobPreviewOpen}
      />
      <SetJobInactiveModal isOpen={isSetJobInactiveModalOpen} setIsOpen={setIsSetJobInactiveModalOpen} />
      {showContextMenu && (
        <RightClickMenu
          options={contextMenuOptions}
          position={contextMenuPosition}
          onClose={handleCloseContextMenu}
          isOpen={showContextMenu}
          setShowContextMenu={setShowContextMenu}
          selectedJobId={selectedJobId}
        />
      )}
      {isEditModalOpen?.open && (
        <UpdateJobModal
          refetch={refetch}
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          openConfirmSocialShareModal={openConfirmSocialShareModal}
        />
      )}

      {isSocialShareModalOpen && (
        <ConfirmSocialShareModal
          onSubmit={socialMediaShareModal}
          socialType={socialType}
          isOpen={isSocialShareModalOpen}
          setIsOpen={setIsSocialShareModalOpen}
          setIsSocialShareModalClosed={setIsSocialShareModalClosed}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal<T_ModalData>
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          onConfirm={() => {
            const callbackReq = {
              onSuccess: (data: any) => {
                toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
                setIsDeleteModalOpen(null);
                refetch();
              },
              onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
              },
            };
            deleteJobPost(isDeleteModalOpen.id, callbackReq);
          }}
          isLoading={isDeleteLoading}
        />
      )}
      {assignUsersModal && assignUsersModal.id && (
        <AssignUsersModal
          isOpen={assignUsersModal}
          setIsOpen={setAssignUsersModal}
          onAssignmentComplete={() => {
            refetch(); // Refresh the job postings list
          }}
        />
      )}
      
      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteConfirmModalOpen?.open && (
        <DeleteModal<T_BulkDeleteModalData>
          isOpen={isBulkDeleteConfirmModalOpen}
          setIsOpen={setIsBulkDeleteConfirmModalOpen}
          onConfirm={confirmBulkDeleteWarning}
          isLoading={false}
          customText={`${bulkDeleteCount} job posting${bulkDeleteCount > 1 ? 's' : ''}`}
        />
      )}

      {/* Bulk Delete Progress Modal */}
      {isBulkDeleteModalOpen && (
        <ProgressModal
          isOpen={isBulkDeleteModalOpen}
          setIsOpen={setIsBulkDeleteModalOpen}
          onConfirm={confirmBulkDelete}
          title={`Deleting ${bulkDeleteCount} job posting${bulkDeleteCount > 1 ? 's' : ''}...`}
          isProcessing={bulkDeleteMutation.isLoading}
          onSuccess={handleBulkDeleteSuccess}
        />
      )}

      {/* Duplicate Confirmation Modal */}
      {isDuplicateModalOpen && (
        <ConfirmModal
          message="Are you sure you want to duplicate this job posting?"
          isOpen={isDuplicateModalOpen}
          setIsOpen={setIsDuplicateModalOpen}
          confirmAction={handleDuplicateConfirm}
          isLoading={isDuplicateJobPostingLoading}
        />
      )}

      <Tooltip id='search-tooltip' />
      <Tooltip id="edit-tooltip" />
      <Tooltip id="delete-tooltip" />
      <Tooltip id="duplicate-tooltip" />
      <Tooltip id="assign-tooltip" />
      <Tooltip id="fully-staffed-tooltip" />
    </>
  );
};

export default Content;