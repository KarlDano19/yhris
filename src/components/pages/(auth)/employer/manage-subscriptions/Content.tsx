'use client';

import React, { useState, useEffect } from 'react';

import Link from 'next/link';

import toast from 'react-hot-toast';

import LoadingSpinner from '@/components/LoadingSpinner';
import CustomToast from '@/components/CustomToast';
import CustomDatePicker from '@/components/CustomDatePicker';
import classNames from '@/helpers/classNames';
import formatPrice from '@/helpers/currencyFormat';
import updateSession from '@/helpers/updateSession';
import ReceiptViewModal from './modal/ReceiptViewModal';
import PurchaseStatusCard from './PurchaseStatusCard';
import useGetSubscriptions from './hooks/useGetSubscriptions';
import useGetReceiptDetail from './hooks/useGetReceiptDetail';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [activePlans, setActivePlans] = useState<any>({});
  const [isReceiptViewModalOpen, setIsReceiptViewModalOpen] = useState<boolean | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<any>([]);
  const [selectedReferenceId, setSelectedReferenceId] = useState<any>('');
  const [currentTab, setCurrentTab] = useState('');
  const [itemsFilter, setItemsFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });
  const { data, isLoading, refetch } = useGetSubscriptions(itemsFilter);
  const {
    data: receiptDetailData,
    isLoading: isReceiptDetailLoading,
    refetch: receiptDetailRefetch,
  } = useGetReceiptDetail(selectedReferenceId);

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = 'active-plans';
    }
    setCurrentTab(window.location.hash);
  }, []);

  useEffect(() => {
    if (data && Object.keys(data).length !== 0 && !isLoading) {
      setTransactionHistory(data.transaction_history);
      setActivePlans(data.active_plan);
      if (!hasActiveSubscription && data.active_plan.is_used && !data.active_plan.is_ended) {
        updateSession({ hasActiveSubscription: true });
      }
    }
  }, [data]);

  useEffect(() => {
    if (selectedReferenceId) {
      receiptDetailRefetch();
    }
  }, [selectedReferenceId]);

  useEffect(() => {
    if (receiptDetailData && Object.keys(receiptDetailData).length && !isReceiptDetailLoading) {
      setIsReceiptViewModalOpen(true);
    }
  }, [receiptDetailData, isReceiptDetailLoading]);

  const lockInPeriod = () => {
    let periodicity = 'Monthly';
    if (activePlans.periodicity_duration) {
      periodicity = `${activePlans.periodicity_duration} year`;
      if (activePlans.periodicity_duration > 1) {
        periodicity = `${activePlans.periodicity_duration} years`;
      }
    }
    return periodicity;
  };

  const checkIfDateIsValid = () => {
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
    refetch();
  };

  const renderTransactionHistory = () => {
    if (isLoading) {
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
    if (transactionHistory.length === 0) {
      return (
        <tr>
          <td colSpan={8}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
          </td>
        </tr>
      );
    }
    return transactionHistory.map((transaction: any, index: any) => {
      return (
        <tr key={index}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{transaction.reference_id}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{transaction.plan}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{transaction.start_date}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{transaction.end_date}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{transaction.status}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{transaction.payment}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{formatPrice(transaction.amount)}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            {transaction.status === 'Paid' && (
              <button
                onClick={() => {
                  if (selectedReferenceId && selectedReferenceId == transaction.reference_id) {
                    setIsReceiptViewModalOpen(true);
                  } else {
                    setSelectedReferenceId(transaction.reference_id);
                  }
                }}
              >
                <div className='flex justify-center rounded-md py-1 text-center border-2 w-[3rem]'>
                  <img src={`/assets/receipt.png`} alt='receipt' />
                </div>
              </button>
            )}
            {transaction.status !== 'Paid' && (
              <div className='flex justify-center rounded-md py-1 opacity-50 text-center border-2'>
                <img src={`/assets/receipt.png`} alt='receipt' />
              </div>
            )}
          </td>
        </tr>
      );
    });
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative mb-24'>
        <div className='flex p-4'>
          <Link href='/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Dashboard</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Subscriptions</h2>
          <nav className='flex relative justify-start mx-auto my-6' aria-label='Tabs'>
            <li
              className={classNames(
                'cursor-pointer w-[12rem] text-center py-3 font-semibold list-none flex flex-col items-center',
                currentTab === '#active-plans'
                  ? 'text-[#2d4faf] border-b-2 border-b-[#355FD0] hover:text-[#3a66e0] hoverfocus:border-b-[#3a66e0]'
                  : 'text-gray-500'
              )}
              onClick={() => {
                window.location.hash = 'active-plans';
                setCurrentTab('#active-plans');
              }}
            >
              Active Plans
            </li>
            <li
              className={classNames(
                'cursor-pointer w-[12rem] text-center py-3 font-semibold list-none flex flex-col items-center',
                currentTab === '#transactions-history'
                  ? 'text-[#2d4faf] border-b-2 border-b-[#355FD0] hover:text-[#3a66e0] hoverfocus:border-b-[#3a66e0]'
                  : 'text-gray-500'
              )}
              onClick={() => {
                window.location.hash = 'transactions-history';
                setCurrentTab('#transactions-history');
              }}
            >
              Transactions
            </li>
          </nav>
          {currentTab === '#active-plans' && (
            <>
              {!isLoading && Object.keys(activePlans).length !== 0 && (
                <div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-4'>Current Plan</h3>
                  <div className='flex flex-col lg:flex-row gap-4 lg:gap-10 mb-10'>
                    <div className='flex py-6 px-6 lg:px-12 border-2 rounded-[2rem] w-full lg:w-[30rem]'>
                      <div>
                        <img className='h-[70px] mr-2' src={`/assets/bulb.png`} alt='bulb' />
                      </div>
                      <div className='ml-4'>
                        <span className='mb-[0.5rem] font-bold'>{activePlans.plan}</span>
                        <p>
                          Number of Employees: {activePlans.number_of_employees}
                          <br />
                          Lock-in Period: {lockInPeriod()}
                        </p>
                      </div>
                    </div>
                    {activePlans.is_used && (
                      <div className='flex py-6 px-6 lg:px-12 border-2 rounded-[2rem] items-center w-full lg:w-[30rem]'>
                        <div>
                          <img className='h-[70px]' src={`/assets/restart.png`} alt='restart' />
                        </div>
                        <div className='ml-4'>
                          <p>Renew at</p>
                          <span className='mb-[0.5rem] font-bold'>{activePlans.end_date}</span>
                        </div>
                      </div>
                    )}
                    {!activePlans.is_used && <PurchaseStatusCard refetch={refetch} plan={activePlans} />}
                  </div>
                  <div className='mb-8'>
                    <h3 className='text-xl font-semibold text-gray-900 mb-4'>Plan Privileges</h3>
                    <p className='text-gray-600 mb-6'>
                      Your current plan includes the following features and capabilities:
                    </p>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
                    {(activePlans.plan_features || []).map((feature: any, index: any) => {
                      return (
                        <div
                          key={index}
                          className='group relative bg-white border-2 border-gray-200 rounded-2xl p-6 text-center hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1'
                        >
                          {/* Background gradient for visual appeal */}
                          <div className='absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                          {/* Icon container with better styling */}
                          <div className='relative mb-4 flex justify-center'>
                            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300'>
                              <svg
                                className='w-6 h-6 text-green-600'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                                aria-hidden='true'
                              >
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                              </svg>
                            </div>
                          </div>

                          {/* Feature text with better typography */}
                          <div className='relative'>
                            <h4 className='text-sm font-semibold text-gray-900 leading-tight'>
                              {feature.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </h4>
                          </div>

                          {/* Optional: Add a subtle indicator */}
                          <div className='absolute top-3 right-3 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Empty state when no features */}
                  {(!activePlans.plan_features || activePlans.plan_features.length === 0) && (
                    <div className='text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300'>
                      <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                          />
                        </svg>
                      </div>
                      <h4 className='text-lg font-medium text-gray-900 mb-2'>No features available</h4>
                      <p className='text-gray-500'>Your plan features will appear here once configured.</p>
                    </div>
                  )}
                </div>
              )}
              {!isLoading && Object.keys(activePlans).length === 0 && (
                <div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-4'>Current Plan</h3>
                  <div className='flex flex-col lg:flex-row gap-4 lg:gap-10 mb-10'>
                    <div className='flex w-full lg:w-[30rem] p-0.5 bg-gray-400 rounded-[30px]'>
                      <div className='bg-white py-4 px-6 rounded-[29px] border-2 border-gray-200 w-full flex items-center'>
                        <div>
                          <img className='h-[70px] mr-2' src={`/assets/featured_seasonal_and_gifts.png`} alt='gift' />
                        </div>
                        <div className='ml-4 mt-2'>
                          <span className='mb-[0.5rem] font-bold text-2xl'>Free Plan</span>
                          <p>Your plans is free forever</p>
                        </div>
                      </div>
                    </div>
                    <div
                      className='flex w-full lg:w-[30rem] p-0.5 bg-gradient-to-r from-[#FA7417] to-[#FABE23] rounded-[30px] hover:cursor-pointer'
                      onClick={() => {
                        window.location.href = '/landing-page/pricing';
                      }}
                    >
                      <div className='bg-white p-4 rounded-[29px] border-2 border-gray-200 w-full flex items-center'>
                        <div>
                          <img className='h-[70px] mr-2' src={`/assets/diamond_shine.png`} alt='gift' />
                        </div>
                        <div className='ml-4 mt-2'>
                          <span className='mb-[0.5rem] font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#FA7417] to-[#FABE23]'>
                            Premium Plan
                          </span>
                          <p>Enjoy your complete HR solution now.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='mb-8'>
                    <h3 className='text-xl font-semibold text-gray-900 mb-4'>Plan Privileges</h3>
                    <p className='text-gray-600 mb-6'>
                      Your current plan includes the following features and capabilities:
                    </p>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
                    {(activePlans.plan_features || []).map((feature: any, index: any) => {
                      return (
                        <div
                          key={index}
                          className='group relative bg-white border-2 border-gray-200 rounded-2xl p-6 text-center hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1'
                        >
                          {/* Background gradient for visual appeal */}
                          <div className='absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                          {/* Icon container with better styling */}
                          <div className='relative mb-4 flex justify-center'>
                            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300'>
                              <svg
                                className='w-6 h-6 text-green-600'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                                aria-hidden='true'
                              >
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                              </svg>
                            </div>
                          </div>

                          {/* Feature text with better typography */}
                          <div className='relative'>
                            <h4 className='text-sm font-semibold text-gray-900 leading-tight'>
                              {feature.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </h4>
                          </div>

                          {/* Optional: Add a subtle indicator */}
                          <div className='absolute top-3 right-3 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Empty state when no features */}
                  {(!activePlans.plan_features || activePlans.plan_features.length === 0) && (
                    <>
                      <div className='flex gap-4'>
                        <div className='border-2 border-gray-200 rounded-2xl p-6 px-12 text-center w-52'>
                          <div className='relative mb-4 flex justify-center'>
                            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300'>
                              <svg
                                className='w-6 h-6 text-green-600'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                                aria-hidden='true'
                              >
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                              </svg>
                            </div>
                          </div>
                          <div className='mt-2'>
                            <h4 className='text-sm font-semibold text-gray-900 leading-tight'>Post a Job Module</h4>
                          </div>
                        </div>
                        <div className='border-2 border-gray-200 rounded-2xl p-6 px-12 text-center w-52'>
                          <div className='relative mb-4 flex justify-center'>
                            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300'>
                              <svg
                                className='w-6 h-6 text-green-600'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                                aria-hidden='true'
                              >
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                              </svg>
                            </div>
                          </div>
                          <div className='mt-2'>
                            <h4 className='text-sm font-semibold text-gray-900 leading-tight'>
                              Screen Applicants Module
                            </h4>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
          {currentTab === '#transactions-history' && (
            <>
              <div className='mt-6 flex flex-col lg:flex-row items-left gap-4'>
                <div className='flex-none flex flex-col lg:flex-row items-left md:items-center gap-2'>
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
                          from: value,
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
                      className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                      onChange={(e) => setItemsFilter({ ...itemsFilter, search: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          checkIfDateIsValid();
                        }
                      }}
                      placeholder='Search ...'
                    />
                    <button
                      className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
                      onClick={checkIfDateIsValid}
                    >
                      <MagnifyingGlassIcon className='h-5 w-5' />
                    </button>
                  </div>
                </div>
              </div>
              <div className='mt-8 flow-root'>
                <div
                  className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#2d3e58 #f1f1f1'
                  }}
                >
                  <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                    <table className='min-w-full divide-y divide-gray-300 text-center'>
                      <thead className='divide-y divide-gray-200'>
                        <tr>
                          <th className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Reference No.</th>
                          <th className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Subscription Plan</th>
                          <th className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Subscription Start Date</th>
                          <th className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Subscription End Date</th>
                          <th className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Subscription Status</th>
                          <th className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Payment Type</th>
                          <th className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Total</th>
                          <th className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Action</th>
                        </tr>
                      </thead>
                      <tbody>{renderTransactionHistory()}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {isReceiptViewModalOpen && (
        <ReceiptViewModal
          receiptDetailData={receiptDetailData}
          isOpen={isReceiptViewModalOpen}
          setIsOpen={setIsReceiptViewModalOpen}
        />
      )}
    </>
  );
};

export default Content;
