'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import classNames from '@/helpers/classNames';
import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import CustomDatePicker from '@/components/CustomDatePicker';
import RightClickMenu from '@/components/RightClickMenu';
import Pagination from '@/components/Pagination';
import SetJob from './SetJob';
import JobPreview from './JobPreview';
import JobPreviewModal from './modals/JobPreviewModal';
import SetJobInactiveModal from './modals/SetJobInactiveModal';
import useGetJobPostItems from './hooks/useGetJobPostItems';
import UpdateJobModal from './modals/UpdateJobModal';
import DeleteJobModal from './modals/DeleteModal';

import useUpdateJobPostStatus from './hooks/useUpdateJobPostStatus';
import useUpdateJobSalaryStatus from './hooks/useUpdateJobSalaryStatus';
import useUpdateJobRolesStatus from './hooks/useUpdateJobRolesStatus';
import useUpdateJobRemarkStatus from './hooks/useUpdateJobRemarkStatus';
import useUpdateJobBenefitStatus from './hooks/useUpdateJobBenefitStatus';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Facebook, Indeed, LinkedIn, Instagram, Twitter } from '@/svg/SocialMedia';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import MoreIconWithBorder from '@/svg/MoreIconWithBorder';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';

import { T_JobPreviewModal } from '@/types/globals';
import { useQueryClient } from '@tanstack/react-query';

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type ComponentMap = {
  [key: string]: React.ElementType;
};

type T_ModalData = {
  id: number | null;
  open: boolean;
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
        jobPost['postIn'] = jobPost['shared_to'].split(',');
        jobPost['isActive'] = jobPost['is_active'];
        // Use the exact same property names as in the API response
        // This ensures the toggle works correctly
        jobPost['is_show_salary'] = jobPost['is_show_salary'];
        jobPost['is_show_remarks'] = jobPost['is_show_remarks'];
        jobPost['is_show_benefits'] = jobPost['is_show_benefits'];
        jobPost['is_show_roles'] = jobPost['is_show_roles'];
        jobPost['company_logo'] = jobPost['company_logo'];
        jobPost['created_at'] = Intl.DateTimeFormat('en-US').format(new Date(jobPost['created_at']));
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
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              jobPost.isActive ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            {jobPost.hireCount}
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              jobPost.isActive ? 'text-gray-500' : 'text-red-500'
            }`}
          >
            {jobPost.workSetup}
          </td>
          <td className='flex gap-2 justify-center whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
              <div className='flex space-x-2'>
                <button 
                  onClick={() => setIsEditModalOpen({ id: jobPost.id, open: true })}
                  disabled={!cachedProfile?.state?.data?.edit_job}
                >
                  <EditIcon />
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen({ id: jobPost.id, open: true })}
                  disabled={!cachedProfile?.state?.data?.edit_job}
                >
                  <DeleteIcon />
                </button>
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
          <td colSpan={8}>
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
    <div>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/post-job' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Post Job</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Job Posting History</h2>
          <div className='mt-6 flex flex-col lg:flex-row items-left gap-4'>
            <div className='flex-none flex flex-col lg:flex-row items-left md:items-center gap-2'>
              <div className='relative'>
                <CustomDatePicker
                  id='from-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
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
              <p>to</p>
              <div className='relative'>
                <CustomDatePicker
                  id='to-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
                  selected={pendingFilter.to}
                  pickerOnChange={(date: any) => {
                    setPendingFilter({ ...pendingFilter, to: date });
                  }}
                  inputOnChange={(value: any) => {
                    setPendingFilter({ ...pendingFilter, to: value });
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
                  data-tooltip-content='Search for Job: Title, Type, Schedule'
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
          </div>
          
          {/* Status Filter Tabs */}
          <div className="mt-8">
            <div className="flex flex-wrap justify-center md:justify-start md:pl-4 lg:pl-10 mb-5 gap-2">
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
          </div>

          <div className='mt-8 flow-root'>
            <div 
              className='-mx-4 -my-2 overflow-x-auto md:overflow-visible sm:-mx-6 lg:-mx-8'
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#2d3e58 #f1f1f1'
              }}
            >
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
                        Job No.
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date Created
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Job Title
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
      {isDeleteModalOpen?.open && (
        <DeleteJobModal refetch={refetch} isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} />
      )}
      <Tooltip id='search-tooltip' />
    </div>
  );
};

export default Content;
