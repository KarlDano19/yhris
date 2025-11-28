'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';

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
import JobPreview from './JobPreview';
import JobPreviewModal from './modals/JobPreviewModal';
import SetJobInactiveModal from './modals/SetJobInactiveModal';
import useGetJobPostItems from './hooks/useGetJobPostItems';
import UpdateJobModal from './modals/UpdateJobModal';
import useBulkDeleteJobPostings from './hooks/useBulkDeleteJobPostings';
import useDeleteJobPost from './hooks/useDeleteJobPost';
import useSeedJobPostings from './hooks/useSeedJobPostings';
import useUnseedJobPostings from './hooks/useUnseedJobPostings';
import useDuplicateJobPosting from './hooks/useDuplicateJobPosting';

import useUpdateJobPostStatus from './hooks/useUpdateJobPostStatus';
import useUpdateJobSalaryStatus from './hooks/useUpdateJobSalaryStatus';
import useUpdateJobRolesStatus from './hooks/useUpdateJobRolesStatus';
import useUpdateJobRemarkStatus from './hooks/useUpdateJobRemarkStatus';
import useUpdateJobBenefitStatus from './hooks/useUpdateJobBenefitStatus';

import { ArrowLeftIcon, MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { Facebook, Indeed, LinkedIn, Instagram, Twitter } from '@/svg/SocialMedia';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import MoreIconWithBorder from '@/svg/MoreIconWithBorder';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import DuplicateIcon from '@/svg/DuplicateIcon';
import AssignUsersModal from './modals/AssignUsersModal';

import { T_JobPreviewModal } from '@/types/globals';
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
  const [jobPostHistoryItems, setJobPostHistoryItems] = useState<any>([]);
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
  const seedJobPostingsMutation = useSeedJobPostings();
  const unseedJobPostingsMutation = useUnseedJobPostings();
  const { mutate: duplicateJobPosting, isLoading: isDuplicateJobPostingLoading } = useDuplicateJobPosting();
  
  const [moreMenuOpen, setMoreMenuOpen] = useState<{ [key: number]: boolean }>({});
  const [showShareOptions, setShowShareOptions] = useState<{ [key: number]: boolean }>({});
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['userRightsCache']) as { state: { data: any } | undefined };
  const [isSearching, setIsSearching] = useState(false);

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
      let data: any = {};
      data['jobId'] = jobId;
      data['is_active'] = !jobPost['is_active'];
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
    let data: any = {};
    data['jobId'] = jobId;
    data['is_active'] = !isActive;
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
    let data: any = {};
    data['jobId'] = jobId;
    data['is_show_roles'] = !isShowRoles;
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
    let data: any = {};
    data['jobId'] = jobId;
    data['is_show_salary'] = !isShowSalary;
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
    let data: any = {};
    data['jobId'] = jobId;
    data['is_show_remarks'] = !isShowNotes;
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
    let data: any = {};
    data['jobId'] = jobId;
    data['is_show_benefits'] = !isShowBenefits;
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
    refetch();
  }, []);

  useEffect(() => {
    if (dataJobPost && !isGetJobPostLoading) {
      dataJobPost.records.map((jobPost: any) => {
        jobPost['jobTitle'] = jobPost['job_title'];
        jobPost['jobType'] = jobPost['job_type'];
        jobPost['jobDescription'] = jobPost['job_description'];
        jobPost['placeAdvertise'] = jobPost['advertise_to'];
        jobPost['workSetup'] = jobPost['work_setup'];
        jobPost['schedule'] = jobPost['job_schedule'];
        jobPost['hireCount'] = jobPost['required_slot'];
        // Add dynamic slot fields
        jobPost['hiredCount'] = jobPost['hired_count'];
        jobPost['remainingSlots'] = jobPost['remaining_slots'];
        jobPost['slotsDisplay'] = jobPost['slots_display'];
        jobPost['isFullyStaffed'] = jobPost['is_fully_staffed'];
        jobPost['postIn'] = jobPost['shared_to'].split(',');
        jobPost['isActive'] = jobPost['is_active'];
        jobPost['position_name'] = jobPost['position_name'] || 'N/A'; // Add this line
        // Use the exact same property names as in the API response
        // This ensures the toggle works correctly
        jobPost['is_show_salary'] = jobPost['is_show_salary'];
        jobPost['is_show_remarks'] = jobPost['is_show_remarks'];
        jobPost['is_show_benefits'] = jobPost['is_show_benefits'];
        jobPost['is_show_roles'] = jobPost['is_show_roles'];
        jobPost['company_logo'] = jobPost['company_logo'];
        jobPost['created_at'] = formatDateToLocal(jobPost['created_at']);
      });
      setJobPostHistoryItems(dataJobPost.records);
      setPagination({
        totalPages: dataJobPost.total_pages,
        totalRecords: dataJobPost.total_records,
      });
    }
  }, [dataJobPost]);

  useEffect(() => {
    refetch();
  }, [currentPage, pageSize]);

  // Add click outside handler to close menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (Object.keys(moreMenuOpen).some(id => moreMenuOpen[parseInt(id)])) {
        const target = event.target as HTMLElement;
        if (!target.closest('.more-menu-container')) {
          setMoreMenuOpen({});
          setShowShareOptions({});
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
    setShowShareOptions({});
  }, [currentPage]);

  // Update select all state when job postings change
  useEffect(() => {
    if (jobPostHistoryItems) {
      const allJobPostingIds = new Set(jobPostHistoryItems.map((j: any) => j.id));
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

  const socialMediaShare = (social: string, og_url: string) => {
    const encoded_url = encodeURIComponent(og_url);
    if (social === 'Facebook') {
      og_url = `${encoded_url}%3Fsource%3Dfacebook`;
      shareFb(og_url);
      return;
    }
    if (social === 'LinkedIn') {
      og_url = `${encoded_url}`;
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
      const allIds = jobPostHistoryItems.map((j: any) => j.id);
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

  const handleSeedJobPostings = async (count: number) => {
    try {
      const result = await seedJobPostingsMutation.mutateAsync({ count });
      toast.custom(() => <CustomToast message={result.message} type='success' />, { duration: 3000 });
      setSelectedJobPostings(new Set());
      setSelectAll(false);
      setMoreMenuOpen({});
      setShowShareOptions({});
      refetch();
    } catch (error) {
      const errorMessage = typeof error === 'string'
        ? error
        : error instanceof Error
          ? error.message
          : 'Failed to seed job postings';
      toast.custom(() => <CustomToast message={errorMessage} type='error' />, { duration: 5000 });
      throw error;
    }
  };

  const handleUnseedJobPostings = async () => {
    try {
      const result = await unseedJobPostingsMutation.mutateAsync();
      toast.custom(() => <CustomToast message={result.message} type='success' />, { duration: 3000 });
      setSelectedJobPostings(new Set());
      setSelectAll(false);
      setMoreMenuOpen({});
      setShowShareOptions({});
      refetch();
    } catch (error) {
      const errorMessage = typeof error === 'string'
        ? error
        : error instanceof Error
          ? error.message
          : 'Failed to unseed job postings';
      toast.custom(() => <CustomToast message={errorMessage} type='error' />, { duration: 5000 });
      throw error;
    }
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
      return jobPostHistoryItems.map((jobPost: any) => (
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
              jobPost.isActive ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            <JobPreview id={jobPost.id} jobNumber={jobPost.id} setIsJobPreviewOpen={setIsJobPreviewOpen} />
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              jobPost.isActive ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            {jobPost.created_at}
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              jobPost.isActive ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            <SetJob
              item={jobPost}
              id={jobPost.id}
              jobTitle={jobPost.jobTitle}
              setIsSetJobInactiveModalOpen={setIsSetJobInactiveModalOpen}
              setIsJobPreviewOpen={setIsJobPreviewOpen}
            />
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              jobPost.isActive ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            {jobPost.position || 'N/A'}
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              jobPost.isActive ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            {jobPost.jobType}
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              jobPost.isActive ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            {jobPost.schedule}
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm ${
              jobPost.isActive ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <span className={`font-semibold ${jobPost.isFullyStaffed ? 'text-green-600' : 'text-gray-700'}`}>
                {jobPost.slotsDisplay}
              </span>
              {jobPost.isFullyStaffed && (
                <span 
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                  data-tooltip-id="fully-staffed-tooltip"
                  data-tooltip-content="All positions filled"
                >
                  ✓ Full
                </span>
              )}
              {!jobPost.isFullyStaffed && jobPost.remainingSlots > 0 && (
                <span className="text-xs text-amber-600">
                  {jobPost.remainingSlots} remaining
                </span>
              )}
            </div>
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              jobPost.isActive ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            {jobPost.workSetup}
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center ${
              jobPost.isActive ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            {jobPost.assignments_count || 0} users
          </td>
          <td className='flex gap-2 justify-center whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
              <div className='flex space-x-2'>
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
                <div className="relative more-menu-container pt-1">
                  <button onClick={() => handleMoreMenuClick(jobPost.id)}>
                    <MoreIconWithBorder />
                  </button>
                  {moreMenuOpen[jobPost.id] && (
                    <div className='absolute bg-white border rounded shadow-lg mt-2 z-50 right-0' style={{ minWidth: '180px', top: '100%' }}>
                      <ul className='py-1 text-left'>
                        <li
                          className='px-4 py-2 hover:bg-gray-100 cursor-pointer border-b'
                          onClick={() => setShowShareOptions((prev) => ({ ...prev, [jobPost.id]: !prev[jobPost.id] }))}
                        >
                          Share Post To <ChevronRightIcon className='inline h-4 w-4' />
                        </li>
                        {showShareOptions[jobPost.id] && (
                          <div className='pl-4'>
                            {jobPost.postIn.map((social: any) => {
                              const DynamicComponent = componentMap[social];
                              return (
                                <span
                                  key={social}
                                  className='px-2 py-1 hover:bg-gray-100 cursor-pointer'
                                  onClick={() => socialMediaShare(social, jobPost.og_url)}
                                >
                                  <DynamicComponent />
                                </span>
                              );
                            })}
                          </div>
                        )}
                        <li
                          className='px-4 py-2 hover:bg-gray-100 cursor-pointer border-b'
                          onClick={() => handleSetAsInactive(jobPost.id, jobPost.is_active)}
                        >
                          <span className={!jobPost.is_active ? 'text-red-500' : ''}>
                          {jobPost.is_active ? 'Set as Inactive' : 'Set as Active'}
                          </span>

                        </li>
                        <li
                          className='px-4 py-2 hover:bg-gray-100 cursor-pointer border-b'
                          onClick={() => handleShowRoles(jobPost.id, jobPost.is_show_roles)}
                        >
                          <span className={!jobPost.is_show_roles ? 'text-red-500' : ''}>
                            {jobPost.is_show_roles ? 'Hide Roles' : 'Show Roles'}
                          </span>
                        </li>
                        <li
                          className='px-4 py-2 hover:bg-gray-100 cursor-pointer border-b'
                          onClick={() => handleShowSalary(jobPost.id, jobPost.is_show_salary)}
                        >
                          <span className={!jobPost.is_show_salary ? 'text-red-500' : ''}>
                            {jobPost.is_show_salary ? 'Hide Salary' : 'Show Salary'}
                          </span>
                        </li>
                        <li
                          className='px-4 py-2 hover:bg-gray-100 cursor-pointer border-b'
                          onClick={() => handleShowBenefits(jobPost.id, jobPost.is_show_benefits)}
                        >
                          <span className={!jobPost.is_show_benefits ? 'text-red-500' : ''}>
                            {jobPost.is_show_benefits ? 'Hide Benefits' : 'Show Benefits'}
                          </span>
                        </li>
                        <li
                          className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                          onClick={() => handleShowNotes(jobPost.id, jobPost.is_show_remarks)}
                        >
                          <span className={!jobPost.is_show_remarks ? 'text-red-500' : ''}>
                            {jobPost.is_show_remarks ? 'Hide Notes/Remarks' : 'Show Notes/Remarks'}
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={10}>
            <h4 className='text-center text-gray-300 text-sm my-4'>There{`'`}s no data yet.</h4>
          </td>
        </tr>
      );
    }
  };

  const handleMoreMenuClick = (jobId: number) => {
    // Close all other menus first
    const newMoreMenuOpen: { [key: number]: boolean } = {};
    
    // Toggle the clicked menu
    newMoreMenuOpen[jobId] = !moreMenuOpen[jobId];
    
    // Also reset share options when closing menus
    if (!newMoreMenuOpen[jobId]) {
      setShowShareOptions((prev) => ({
        ...prev,
        [jobId]: false
      }));
    }
    
    setMoreMenuOpen(newMoreMenuOpen);
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <Link href='/post-job' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Post Job</h4>
          </Link>
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Job Posting History</h2>
        </div>

        {/* Content Section with flex-1 */}
        <div className='px-2 md:px-8 lg:px-4 mt-6 flex-1'>
          <div className='flex flex-col lg:flex-row items-left gap-4'>
            {/* Desktop Layout */}
            <div className='hidden md:flex flex-none flex-col lg:flex-row items-left md:items-center gap-2'>
              <div className='relative'>
                <CustomDatePicker
                  id='from-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-full rounded-md py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
                  selected={pendingFilter.from}
                  pickerOnChange={(date: any) => {
                    setPendingFilter({ ...pendingFilter, from: date });
                  }}
                  inputOnChange={(value: any) => {
                    setPendingFilter({ ...pendingFilter, from: value });
                  }}
                />
              </div>
              <p className='text-gray-600'>to</p>
              <div className='relative'>
                <CustomDatePicker
                  id='to-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-full rounded-md py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
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

            {/* Mobile Layout */}
            <div className='md:hidden flex-none flex flex-col items-left gap-2'>
              <div className='flex justify-start items-center gap-2 flex-wrap'>
                <div className='relative flex-1 min-w-[140px]'>
                  <CustomDatePicker
                    id='from-datepicker-mobile'
                    placeholder={'From Date'}
                    className='appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm leading-6'
                    selected={pendingFilter.from}
                    pickerOnChange={(date: any) => {
                      setPendingFilter({ ...pendingFilter, from: date });
                    }}
                    inputOnChange={(value: any) => {
                      setPendingFilter({ ...pendingFilter, from: value });
                    }}
                  />
                </div>
                <p className='text-gray-600 text-sm'>to</p>
                <div className='relative flex-1 min-w-[140px]'>
                  <CustomDatePicker
                    id='to-datepicker-mobile'
                    placeholder={'To Date'}
                    className='appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm leading-6'
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
            <div className='flex items-center gap-3 lg:ml-auto'>
              <SeederButton
                onSeed={handleSeedJobPostings}
                onUnseed={handleUnseedJobPostings}
                isLoading={seedJobPostingsMutation.isLoading}
                isUnseeding={unseedJobPostingsMutation.isLoading}
                maxCount={1000}
                defaultCount={5}
              />
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

          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
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
      {isEditModalOpen?.open && <UpdateJobModal refetch={refetch} isOpen={isEditModalOpen} setIsOpen={setIsEditModalOpen} />}
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