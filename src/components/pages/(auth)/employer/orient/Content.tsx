'use client';

import React, { useEffect, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import CustomDatePicker from '@/components/CustomDatePicker';
import Pagination from '@/components/Pagination';
import classNames from '@/helpers/classNames';
import { formatDateToLocal } from '@/helpers/date';
import SendContract from './SendContract';
import Orient from './Orient';
import IntroduceToTeam from './IntroduceToTeam';
import EnrollToPayroll from './EnrollToPayroll';
import OrientOptionModal from './modals/OrientOptionModal';
import SendEmailModal from '@/components/SendEmailModal';
import NoticeModal from './modals/NoticeModal';
import Filter, { FilterGroup, FilterValues } from '@/components/common/Filter';
import useGetApplicantOrient from './hooks/useGetApplicantOrient';
import { useFilterPersistence } from '@/components/hooks/useFilterPersistence';
import useUpdateApplicantOrient from './hooks/useUpdateApplicantOrient';
import useEnrollEmployeeToYP from '@/components/hooks/useEnrollEmployeeToYP';
import { handleEmailSending, updateOrientItems } from './functions/emailHandlers';
import useSyncEmployees from '@/components/hooks/useSyncEmployees';
import LocationDepartment from './LocationDepartment';
import LocationDepartmentModal from './modals/LocationDepartmentModal';
import EnrollRedirectModal from './modals/EnrollRedirectModal';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const params = useParams();
  const router = useRouter();
  const [orientItems, setOrientItems] = useState<any>([]);
  const [selectedOrientId, setSelectedOrientId] = useState('');
  const [itemsFilter, setItemsFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });
  const [searchText, setSearchText] = useState('');
  const [appliedFilter, setAppliedFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    totalPages: number;
    totalRecords: number;
  }>({
    totalPages: 1,
    totalRecords: 0,
  });

  // Define filter groups for the Filter component
  const filterGroups: FilterGroup[] = [
    {
      id: 'enrolled',
      title: 'Enrollment Status',
      options: [
        { label: 'Not Enrolled', value: 'not_enrolled' },
        { label: 'Enrolled', value: 'enrolled' },
      ],
      multiSelect: true,
      allowEmpty: false,
    },
  ];

  const [filters, setFilters] = useFilterPersistence<FilterValues>('orient', {
    enrolled: ['not_enrolled'],
  });
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const {
    data: applicationOrient,
    refetch,
    isLoading: isGetOrientLoading,
  } = useGetApplicantOrient(Number(params.position), {
    ...appliedFilter,
    pageSize,
    currentPage,
    enrolled: filters.enrolled?.join(','), // Pass enrollment filter to backend
  });
  const { mutate, isLoading } = useUpdateApplicantOrient();
  const { mutate: enrollToYP, isLoading: isEnrolling } = useEnrollEmployeeToYP();
  const { mutate: syncEmployees } = useSyncEmployees();
  const [loginType, setLoginType] = useState<string | null>(null);
  const [isSendContractModalOpen, setIsSendContractModalOpen] = useState(false);
  const [isOrientOptionModalOpen, setIsOrientOptionModalOpen] = useState(false);
  const [isSuccessSendContractModalOpen, setIsSuccessSendContractModalOpen] = useState(false);
  const [isDoloNewHire, setIsDoloNewHire] = useState(false);
  const [isIntegrateToDolo, setIntegrateToDolo] = useState(false);
  const [isLoggedInDolo, setIsLoggedInDolo] = useState(false);
  const [isLearningMaterials, setIsLearningMaterials] = useState(false);
  const [selectedLearningMaterials, setSelectedLearningMaterials] = useState<string | null>(null);
  const [isSendOrientLink, setIsSendOrientLink] = useState(false);
  const [isOrientLinkEmail, setIsOrientLinkEmail] = useState(false);
  const [orientLinkEmail, setOrientLinkEmail] = useState<string | null>(null);
  const [newHireOriented, setNewHireOriented] = useState(false);
  const [isIntroducedModalOpen, setIsIntroducedModalOpen] = useState(false);
  const [isSignInPayrollModalOpen, setIsSignInPayrollModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const cachedUserDetails = queryClient.getQueryCache().find(['userDetailsCache']) as { state: { data: any } | undefined };
  const [isLocationDepartmentModalOpen, setIsLocationDepartmentModalOpen] = useState(false);
  const [isLocationDepartmentWarningModalOpen, setIsLocationDepartmentWarningModalOpen] = useState(false);
  const [isEnrollRedirectModalOpen, setIsEnrollRedirectModalOpen] = useState(false);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setIsFilterLoading(true);
    // The useGetApplicantOrient hook will automatically refetch when filters.enrolled changes
  };

  useEffect(() => {
    if (cachedUserDetails?.state?.data) {
      setLoginType(cachedUserDetails.state.data.login_type);
    }
  }, [cachedUserDetails]);

  // Handle filter loading state
  useEffect(() => {
    if (applicationOrient && isFilterLoading) {
      setIsFilterLoading(false);
    }
  }, [applicationOrient, isFilterLoading]);

  useEffect(() => {
    if (applicationOrient) {
      let items = [];
      let totalPages = 1;
      let totalRecords = 0;
      // Handle paginated response structure
      if (applicationOrient.records) {
        items = applicationOrient.records.map((item: any) => {
          item['created_at'] = formatDateToLocal(item.created_at);
          item['isContractSent'] = item.is_contract_sent;
          item['isContractReceived'] = item.is_contract_received;
          item['contractReceivedDate'] = formatDateToLocal(item.contract_received_date);
          item['isIntroduced'] = item.is_introduction_sent;
          item['isIntroductionReceived'] = item.is_introduction_received;
          item['introductionReceivedDate'] = formatDateToLocal(item.introduction_received_date);
          item['isOriented'] = item.is_orientation_completed;
          item['introduceTeam'] = {
            to: '',
            template: 'Test',
            email: '',
            cc: '',
            bcc: '',
          };
          item['sendContract'] = {
            to: '',
            template: 'Test',
            email: '',
            cc: '',
            bcc: '',
          };
          item['isEnrolled'] = item.is_enrolled;
          item['isLocationDepartmentAssigned'] = item.is_location_department_assigned;
          return item;
        });
        totalPages = applicationOrient.total_pages || 1;
        totalRecords = applicationOrient.total_records || items.length;
      } else if (Array.isArray(applicationOrient)) {
        items = applicationOrient.map((item: any) => {
          item['created_at'] = formatDateToLocal(item.created_at);
          item['isContractSent'] = item.is_contract_sent;
          item['isContractReceived'] = item.is_contract_received;
          item['contractReceivedDate'] = formatDateToLocal(item.contract_received_date);
          item['isIntroduced'] = item.is_introduction_sent;
          item['isIntroductionReceived'] = item.is_introduction_received;
          item['introductionReceivedDate'] = formatDateToLocal(item.introduction_received_date);
          item['isOriented'] = item.is_orientation_completed;
          item['introduceTeam'] = {
            to: '',
            template: 'Test',
            email: '',
            cc: '',
            bcc: '',
          };
          item['sendContract'] = {
            to: '',
            template: 'Test',
            email: '',
            cc: '',
            bcc: '',
          };
          item['isEnrolled'] = item.is_enrolled;
          item['isLocationDepartmentAssigned'] = item.is_location_department_assigned;
          return item;
        });
        totalRecords = items.length;
        totalPages = Math.ceil(totalRecords / pageSize);
      }
      setOrientItems(items);
      setPagination({
        totalPages,
        totalRecords,
      });
    }
  }, [applicationOrient, pageSize]);

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const setReceived = (id: string, emailType: string) => {
    const itemIndex = orientItems.findIndex((item: any) => item.id === id);
    const orientItemCopy = JSON.parse(JSON.stringify(orientItems));
    const currentDate = new Date();
    orientItemCopy[itemIndex].id = id;
    orientItemCopy[itemIndex].actionType = 'received';
    orientItemCopy[itemIndex].emailType = emailType;
    orientItemCopy[itemIndex].dateReceived = currentDate;
    if (emailType === 'contract') {
      orientItemCopy[itemIndex].isContractReceived = true;
      orientItemCopy[itemIndex].contractReceivedDate = formatDateToLocal(currentDate.toISOString());
    }
    if (emailType === 'introduce') {
      orientItemCopy[itemIndex].isIntroductionReceived = true;
      orientItemCopy[itemIndex].introductionReceivedDate = formatDateToLocal(currentDate.toISOString());
    }
    const successMessage = emailType === 'contract' ? 'Sent contract mark as received.' : 'Introduction marked as received.';
    const callbackReq = {
      onSuccess: (data: any) => {
        setOrientItems([...orientItemCopy]);
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
    mutate(orientItemCopy[itemIndex], callbackReq);
  };

  const setEnrolled = (id: any, isLocationDepartmentAssigned: boolean) => {
    if (!isLocationDepartmentAssigned) {
      setSelectedOrientId(id); // Set the selected ID for the assignment modal
      setIsLocationDepartmentWarningModalOpen(true);
      return;
    }

    const itemIndex = orientItems.findIndex((item: any) => item.id === id);
    const orientItemCopy = JSON.parse(JSON.stringify(orientItems));
    
    // Set the enrolling ID to track which item is being enrolled
    setEnrollingId(String(id));
    
    const updateOrientationStatus = () => {
      orientItemCopy[itemIndex].id = id;
      orientItemCopy[itemIndex].actionType = 'enrolled';
      orientItemCopy[itemIndex].isEnrolled = true;
      
      mutate(orientItemCopy[itemIndex], {
        onSuccess: (data: any) => {
          setOrientItems([...orientItemCopy]);
          setEnrollingId(null); // Clear enrolling state on success
          setIsEnrollRedirectModalOpen(true);
          // Clear employee cache when applicant is enrolled (employee becomes available for other operations)
          queryClient.invalidateQueries(['employeePaginatedSelectCache']);
          toast.custom(() => <CustomToast message={'Applicant successfully enrolled.'} type='success' />, {
            duration: 5000,
          });
        },
        onError: (err: any) => {
          setEnrollingId(null); // Clear enrolling state on error
          toast.custom(() => <CustomToast message={err} type='error' />, {
            duration: 7000,
          });
        },
      });
    };

    if (loginType !== 'password') {
      // First sync employees if not password login type
      syncEmployees(undefined, {
        onSuccess: () => {
          // Then enroll in payroll system
          enrollToYP({
            id,
            data: {
              first_name: orientItemCopy[itemIndex].firstname,
              middle_name: orientItemCopy[itemIndex].middlename,
              last_name: orientItemCopy[itemIndex].lastname,
              email: orientItemCopy[itemIndex].email,
              birthdate: orientItemCopy[itemIndex].birth_date,
              address: orientItemCopy[itemIndex].address,
              gender: orientItemCopy[itemIndex].gender,
              department: orientItemCopy[itemIndex].department_id,
              employment_status: orientItemCopy[itemIndex].employment_status_id,
              location: orientItemCopy[itemIndex].location_name,
              position: orientItemCopy[itemIndex].position_id,
              mobile: orientItemCopy[itemIndex].mobile,
              job_posting_id: Number(params.position),
            }
          }, {
            onSuccess: () => {
              updateOrientationStatus();
            },
            onError: (err: any) => {
              setEnrollingId(null); // Clear enrolling state on error
              toast.custom(() => <CustomToast message={err} type='error' />, {
                duration: 7000,
              });
            }
          });
        },
        onError: (err: any) => {
          setEnrollingId(null); // Clear enrolling state on error
          toast.custom(() => <CustomToast message={err} type='error' />, {
            duration: 7000,
          });
        }
      });
    } else {
      // Skip sync employees and enrollment if password login type
      updateOrientationStatus();
    }
  };


  const setOriented = () => {
    const itemIndex = orientItems.findIndex((item: any) => item.id === selectedOrientId);
    const orientItemCopy = JSON.parse(JSON.stringify(orientItems));
    orientItemCopy[itemIndex].actionType = 'completed';
    orientItemCopy[itemIndex].isOriented = true;
    const callbackReq = {
      onSuccess: (data: any) => {
        setOrientItems(orientItemCopy);
        toast.custom(() => <CustomToast message={'Applicant successfully orient.'} type='success' />, {
          duration: 5000,
        });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate(orientItemCopy[itemIndex], callbackReq);
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
    setAppliedFilter({
      from: itemsFilter.from,
      to: itemsFilter.to,
      search: searchText,
    });
    setCurrentPage(1);
  };

  const renderRows = () => {
    if (isGetOrientLoading || isFilterLoading) {
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
    if (filters.enrolled && filters.enrolled.length === 0) {
      return (
        <tr>
          <td colSpan={8}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>No filter options selected.</h4>
          </td>
        </tr>
      );
    }
    
    if (orientItems && orientItems.length > 0) {
      return orientItems.map((item: any, index: number) => (
        <tr key={index}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='flex justify-center'>{item.created_at}</div>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='flex gap-2 justify-center'>
              <span>{item?.firstname + ' ' + item?.lastname}</span>{' '}
            </div>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <SendContract
              isContractSent={item.isContractSent}
              isContractReceived={item.isContractReceived}
              contractReceivedDate={item.contractReceivedDate}
              setIsSendContractModalOpen={(e) => {
                setSelectedOrientId(item.id);
                setIsSendContractModalOpen(e);
              }}
              setReceived={() => {
                setReceived(item.id, 'contract');
              }}
              isLoading={isLoading}
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <Orient
              isOriented={item.isOriented}
              setIsOrientFirstModalOpen={(e) => {
                setSelectedOrientId(item.id);
                setIsOrientOptionModalOpen(e);
              }}
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='flex justify-center'>
              <LocationDepartment
                isAssigned={item.isLocationDepartmentAssigned}
                setIsLocationDepartmentModalOpen={(e) => {
                  setSelectedOrientId(item.id);
                  setIsLocationDepartmentModalOpen(e);
                }}
              />
            </div>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='flex justify-center'>
              <IntroduceToTeam
                isIntroduced={item.isIntroduced}
                isIntroductionReceived={item.isIntroductionReceived}
                introductionReceivedDate={item.introductionReceivedDate}
                setIsIntroducedModalOpen={(e) => {
                  setSelectedOrientId(item.id);
                  setIsIntroducedModalOpen(e);
                }}
                setReceived={() => {
                  setReceived(item.id, 'introduce');
                }}
                isLoading={isLoading}
              />
            </div>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='flex justify-center'>
              <EnrollToPayroll
                id={String(item.id)}
                isEnrolled={item.isEnrolled}
                setEnrolled={() => {
                  setEnrolled(item.id, item.isLocationDepartmentAssigned);
                }}
                isLoading={enrollingId === String(item.id)}
                isLocationDepartmentAssigned={item.isLocationDepartmentAssigned}
              />
            </div>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={8}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
            <h4 className='text-center text-gray-300 text-sm'>Please click create to add separtion of employee.</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 pb-56 md:pb-0 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <Link href='/onboarding' className='flex-none flex gap-3 items-center hover:bg-gray-200 p-2 rounded'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Positions</h4>
          </Link>
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Onboarding</h2>
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
                  data-tooltip-content='Search for: Applicant Name'
                  data-tooltip-place='bottom'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  value={searchText}
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
            <div className='flex-1'></div>
            <div className='w-full lg:w-auto flex justify-end lg:justify-start self-end lg:self-auto'>
              <Filter
                filterGroups={filterGroups}
                defaultValues={filters}
                resetValues={{ enrolled: ['not_enrolled'] }}
                onFilterChange={handleFilterChange}
                buttonId="orient-filter-btn"
              />
            </div>
          </div>
          <div className={classNames('mt-8 flow-root', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                <table
                  className={classNames(
                    'min-w-full divide-y divide-gray-300 text-center',
                    orientItems.length === 0 && 'mb-6'
                  )}
                >
                  <thead>
                    <tr>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Name
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Send Contract
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Orient
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Location, Department & Employment Status
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Introduce to the team
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Enroll to system
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
      {isSendContractModalOpen && (
        <SendEmailModal
          title="Send Contract"
          isOpen={isSendContractModalOpen}
          onClose={() => setIsSendContractModalOpen(false)}
          onSubmit={(data) => {
            const updatedItem = handleEmailSending(data, 'contract', orientItems, selectedOrientId);
            mutate(updatedItem, {
              onSuccess: () => {
                setOrientItems(updateOrientItems(orientItems, updatedItem, selectedOrientId));
                setIsSendContractModalOpen(false);
                setIsSuccessSendContractModalOpen(true);
                toast.custom(() => <CustomToast message={'Successfully sent contract email.'} type='success' />, {
                  duration: 5000,
                });
              },
              onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type='error' />, {
                  duration: 7000,
                });
              },
            });
          }}
          defaultRecipients={selectedOrientId ? [orientItems.find((item: any) => item.id === selectedOrientId)?.email].filter(Boolean) : []}
          showDragDropAttachment={true}
          allowMultipleAttachments={true}
          submitButtonText="Send Contract"
        />
      )}
      {isOrientOptionModalOpen && (
        <OrientOptionModal
          selectedOrientId={selectedOrientId}
          orientItems={orientItems}
          setOrientItems={setOrientItems}
          setIsOpen={setIsOrientOptionModalOpen}
          isOpen={isOrientOptionModalOpen}
          setIsNewHireOrientedOpen={setNewHireOriented}
        />
      )}
      <NoticeModal isOpen={isDoloNewHire} setIsOpen={setIsDoloNewHire}>
        <h5 className='text-xl font-bold text-indigo-dye text-center pt-4'>
          Do you have an account in YAHSHUA Dolo to orient the New Hire?
        </h5>
        <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:justify-between'>
          <button
            type='button'
            className='flex-1 sm:ml-10 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-white bg-savoy-blue shadow-sm py-3 px-6 rounded-md transition-all'
            onClick={() => {
              setIsDoloNewHire(false);
              setIntegrateToDolo(true);
            }}
          >
            YES, I HAVE.
          </button>
          <button
            type='submit'
            className='flex-1 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-savoy-blue  shadow-sm border border-savoy-blue py-3 px-6 rounded-lg transition-all mt-3 sm:mt-0'
            onClick={() => {
              setIsDoloNewHire(false);
            }}
          >
            NO, I DON{"'"}T.
          </button>
        </div>
      </NoticeModal>
      <NoticeModal isOpen={isIntegrateToDolo} setIsOpen={setIntegrateToDolo}>
        <h5 className='text-xl font-bold text-indigo-dye text-center pt-4'>
          Would you like YAHSHUA HRIS to be integrated with YAHSHUA Dolo?
        </h5>
        <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:justify-between'>
          <button
            type='button'
            className='flex-1 sm:ml-10 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-white bg-savoy-blue shadow-sm py-3 px-6 rounded-md transition-all'
            onClick={() => {
              setIntegrateToDolo(false);
              setIsLoggedInDolo(true);
            }}
          >
            YES
          </button>
          <button
            type='submit'
            className='flex-1 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-savoy-blue  shadow-sm border border-savoy-blue py-3 px-6 rounded-lg transition-all mt-3 sm:mt-0'
            onClick={() => {
              setIntegrateToDolo(false);
            }}
          >
            NO
          </button>
        </div>
      </NoticeModal>
      <NoticeModal isOpen={isLoggedInDolo} setIsOpen={setIsLoggedInDolo}>
        <h5 className='text-xl font-bold text-indigo-dye text-center pt-4'>
          It appears that you are not logged in to YAHSHUA Dolo.
          <br />
          <br />
          Please log in to YAHSHUA Dolo.
        </h5>
        <button
          type='button'
          className='text-lg text-center block w-full font-bold leading-6 text-white bg-savoy-blue shadow-sm p-3 rounded-md transition-all'
          onClick={() => {
            setIsLoggedInDolo(false);
            setIsLearningMaterials(true);
          }}
        >
          LOG IN TO YAHSHUA DOLO
        </button>
      </NoticeModal>
      <NoticeModal isOpen={isLearningMaterials} setIsOpen={setIsLearningMaterials}>
        <h5 className='text-xl font-bold text-indigo-dye text-center pt-4'>
          Awesome! Please select from the following learning materials to orient the New Hire:
        </h5>
        <div className={`flex flex-col space-y-2 pl-8 pt-4 pb-6`}>
          <label className='inline-flex items-center mr-4'>
            <input
              type='radio'
              className='form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900'
              value='text'
              name='radioGroup'
              onClick={() => setSelectedLearningMaterials('New Hire Orientation')}
            />
            <span className='ml-2 text-sm font-medium leading-6 text-gray-900'>New Hire Orientation</span>
          </label>
          <label className='inline-flex items-center mr-4'>
            <input
              type='radio'
              className='form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900'
              value='text'
              name='radioGroup'
              onClick={() => setSelectedLearningMaterials('Communication Skills - Email Basics')}
            />
            <span className='ml-2 text-sm font-medium leading-6 text-gray-900'>
              Communication Skills - Email Basics
            </span>
          </label>
          <label className='inline-flex items-center mr-4'>
            <input
              type='radio'
              className='form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900'
              value='text'
              name='radioGroup'
              onClick={() => setSelectedLearningMaterials('Remote Work Readiness')}
            />
            <span className='ml-2 text-sm font-medium leading-6 text-gray-900'>Remote Work Readiness</span>
          </label>
        </div>
        <button
          type='button'
          className='text-lg text-center block w-full font-bold leading-6 text-white bg-savoy-blue shadow-sm p-3 rounded-md transition-all'
          onClick={() => {
            if (selectedLearningMaterials) {
              setIsLearningMaterials(false);
              setIsSendOrientLink(true);
            }
          }}
        >
          CONTINUE
        </button>
      </NoticeModal>
      <NoticeModal isOpen={isSendOrientLink} setIsOpen={setIsSendOrientLink}>
        <h5 className='text-xl font-bold text-indigo-dye text-center pt-4'>
          Would you like send the orientation link to the New Hire&apos;s registered email or send to his/her new company
          email?
        </h5>
        <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:justify-between'>
          <button
            type='button'
            className='flex-1 sm:ml-10 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-white bg-savoy-blue shadow-sm py-3 px-6 rounded-md transition-all'
            onClick={() => {
              setIsSendOrientLink(false);
              setIsOrientLinkEmail(true);
            }}
          >
            YES
          </button>
          <button
            type='submit'
            className='flex-1 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-savoy-blue  shadow-sm border border-savoy-blue py-3 px-6 rounded-lg transition-all mt-3 sm:mt-0'
            onClick={() => {
              setIsSendOrientLink(false);
            }}
          >
            NO
          </button>
        </div>
      </NoticeModal>
      <NoticeModal isOpen={isOrientLinkEmail} setIsOpen={setIsOrientLinkEmail}>
        <h5 className='text-xl font-bold text-indigo-dye text-center pt-4'>
          Enter New Hire email to send the orientation link.
        </h5>
        <div className='my-8'>
          <input
            type='email'
            id='email'
            placeholder='Enter email...'
            onChange={(e) => setOrientLinkEmail(e.target.value)}
            className='block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
          />
        </div>
        <button
          type='button'
          className='text-lg text-center block w-full font-bold leading-6 text-white bg-savoy-blue shadow-sm p-3 rounded-md transition-all'
          onClick={() => {
            if (orientLinkEmail) {
              setIsOrientLinkEmail(false);
              toast.custom(() => <CustomToast message="You have successfully sent orientation link to the New Hire." type="success" />, {
                duration: 5000,
              });
              const orientItemCopy = JSON.parse(JSON.stringify(orientItems));
              orientItemCopy[0].isOrientationSent = true;
              setOrientItems(orientItemCopy);
            }
          }}
        >
          CONTINUE
        </button>
      </NoticeModal>
      <NoticeModal isOpen={newHireOriented} setIsOpen={setNewHireOriented}>
        <h5 className='text-xl font-bold text-indigo-dye text-center pt-4'>Have you already ORIENTED the NEW HIRE?</h5>
        <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:justify-between'>
          <button
            type='button'
            className='flex-1 sm:ml-10 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-white bg-savoy-blue shadow-sm py-3 px-6 rounded-md transition-all'
            onClick={() => {
              setNewHireOriented(false);
              setOriented();
            }}
          >
            YES, I HAVE.
          </button>
          <button
            type='submit'
            className='flex-1 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-savoy-blue  shadow-sm border border-savoy-blue py-3 px-6 rounded-lg transition-all mt-3 sm:mt-0'
            onClick={() => {
              setNewHireOriented(false);
            }}
          >
            NO, I HAVEN&apos;T.
          </button>
        </div>
      </NoticeModal>
      {isIntroducedModalOpen && (
        <SendEmailModal
          title="Introduce to the team"
          isOpen={isIntroducedModalOpen}
          onClose={() => setIsIntroducedModalOpen(false)}
          onSubmit={(data) => {
            const updatedItem = handleEmailSending(data, 'introduce', orientItems, selectedOrientId);
            mutate(updatedItem, {
              onSuccess: () => {
                setOrientItems(updateOrientItems(orientItems, updatedItem, selectedOrientId));
                setIsIntroducedModalOpen(false);
                toast.custom(() => <CustomToast message="You have successfully sent an email." type="success" />, {
                  duration: 5000,
                });
              },
              onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type='error' />, {
                  duration: 7000,
                });
              },
            });
          }}
          defaultRecipients={selectedOrientId ? [orientItems.find((item: any) => item.id === selectedOrientId)?.email].filter(Boolean) : []}
          showDragDropAttachment={true}
          allowMultipleAttachments={true}
          submitButtonText="Send Introduction"
        />
      )}
      <NoticeModal isOpen={isSignInPayrollModalOpen} setIsOpen={setIsSignInPayrollModalOpen}>
        <h5 className='text-xl font-bold text-indigo-dye text-center pt-4'>
          It appears that you are not signed in to YAHSHUA.
          <br />
          <br />
          Payroll Please sign in to YAHSHUA Payroll.
        </h5>
        <button
          type='button'
          className='text-lg text-center block w-full font-bold leading-6 text-white bg-savoy-blue shadow-sm p-3 rounded-md transition-all'
        >
          SIGN IN TO YAHSHUA PAYROLL
        </button>
      </NoticeModal>
      {isEnrollRedirectModalOpen && (
        <>
          <EnrollRedirectModal
            isOpen={isEnrollRedirectModalOpen}
            setIsOpen={setIsEnrollRedirectModalOpen}
            jobPostingId={String(params.position)}
          />
        </>
      )}
      {isLocationDepartmentModalOpen && (
        <LocationDepartmentModal
          selectedOrientId={selectedOrientId}
          orientItems={orientItems}
          setOrientItems={setOrientItems}
          setIsOpen={setIsLocationDepartmentModalOpen}
          isOpen={isLocationDepartmentModalOpen}
        />
      )}
      {/* Updated warning modal for employment status, location/department assignment */}
      <NoticeModal isOpen={isLocationDepartmentWarningModalOpen} setIsOpen={setIsLocationDepartmentWarningModalOpen}>
        <h5 className='text-xl font-bold text-indigo-dye text-center pt-4'>
          Please assign <span className='text-red-600 font-bold'>EMPLOYMENT STATUS, LOCATION AND DEPARTMENT</span> first.
          <br />
          <br />
          You need to complete this step before enrolling the applicant.
        </h5>
        <div className='mt-5 sm:mt-4 sm:flex sm:flex-col sm:gap-3'>
          <button
            type='button'
            className='text-lg text-center block w-full font-bold leading-6 text-white bg-savoy-blue shadow-sm p-3 rounded-md transition-all'
            onClick={() => {
              setIsLocationDepartmentWarningModalOpen(false);
              setIsLocationDepartmentModalOpen(true);
            }}
          >
            ASSIGN
          </button>
          <button
            type='button'
            className='text-lg text-center block w-full font-bold leading-6 text-savoy-blue shadow-sm border border-savoy-blue py-3 px-6 rounded-lg transition-all'
            onClick={() => {
              setIsLocationDepartmentWarningModalOpen(false);
            }}
          >
            CANCEL
          </button>
        </div>
      </NoticeModal>
      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Content;