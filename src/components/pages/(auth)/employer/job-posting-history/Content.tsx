'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import classNames from '@/helpers/classNames';
import CustomToast from '@/components/CustomToast';
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
  });
  const [appliedFilter, setAppliedFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
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
  const { mutate } = useUpdateJobPostStatus();
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
      mutate(data, callbackReq);
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

    mutate(data, callbackReq);
  };

  const handleShowRoles = (jobId: any, isShowRoles: boolean) => {
    let data: any = {};
    data['jobId'] = jobId;
    data['is_show_roles'] = !isShowRoles;
    const successMessage = isShowRoles ? 'Successfully hide roles.' : 'Successfully show roles.';
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
    mutate(data, callbackReq);
  };

  const handleShowSalary = (jobId: any, isShowSalary: boolean) => {
    let data: any = {};
    data['jobId'] = jobId;
    data['is_show_salary'] = !isShowSalary;
    const successMessage = isShowSalary ? 'Successfully hide salary.' : 'Successfully show salary.';
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
    mutate(data, callbackReq);
  };

  const handleShowNotes = (jobId: any, isShowNotes: boolean) => {
    let data: any = {};
    data['jobId'] = jobId;
    data['is_show_remarks'] = !isShowNotes;
    const successMessage = isShowNotes ? 'Successfully hide notes.' : 'Successfully show notes.';
    const callbackReq = {
      onSuccess: () => {
        refetch();
        toast.custom(() => <CustomToast message={successMessage} type='success' />, {
          duration: 5000,
        });
      },
    };
    mutate(data, callbackReq);
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
        jobPost['schedule'] = jobPost['job_schedule'];
        jobPost['hireCount'] = jobPost['required_slot'];
        jobPost['postIn'] = jobPost['shared_to'].split(',');
        jobPost['isActive'] = jobPost['is_active'];
        jobPost['isShowSalary'] = jobPost['is_show_salary'];
        jobPost['isShowNotes'] = jobPost['is_show_remarks'];
        jobPost['isShowRoles'] = jobPost['is_show_roles'];
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
                <button onClick={() => setMoreMenuOpen((prev) => ({ ...prev, [jobPost.id]: !prev[jobPost.id] }))}>
                  <MoreIconWithBorder />
                </button>
              </div>
              {moreMenuOpen[jobPost.id] && (
                <div className='absolute bg-white border rounded shadow-lg mt-2'>
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
                      {jobPost.is_active ? 'Set as Inactive' : 'Set as Active'}
                    </li>
                    <li
                      className='px-4 py-2 hover:bg-gray-100 cursor-pointer border-b'
                      onClick={() => handleShowRoles(jobPost.id, jobPost.is_show_roles)}
                    >
                      {jobPost.is_show_roles ? 'Hide Roles' : 'Show Roles'}
                    </li>
                    <li
                      className='px-4 py-2 hover:bg-gray-100 cursor-pointer border-b'
                      onClick={() => handleShowSalary(jobPost.id, jobPost.is_show_salary)}
                    >
                      {jobPost.is_show_salary ? 'Hide Salary' : 'Show Salary'}
                    </li>
                    <li
                      className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                      onClick={() => handleShowNotes(jobPost.id, jobPost.is_show_remarks)}
                    >
                      {jobPost.is_show_remarks ? 'Hide Notes/Remarks' : 'Show Notes/Remarks'}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={7}>
            <h4 className='text-center text-gray-300 text-sm my-4'>There{`'`}s no data yet.</h4>
          </td>
        </tr>
      );
    }
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
            <div className='flex-none flex flex-col lg:flex-row items-center gap-2'>
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
          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 h-[75vh]'>
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
                        Actions
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
