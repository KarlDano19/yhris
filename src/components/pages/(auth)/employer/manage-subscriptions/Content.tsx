'use client';

import React, { useState, useEffect } from 'react';

import Link from 'next/link';

import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import CustomDatePicker from '@/components/CustomDatePicker';
import PurchaseStatusCard from './PurchaseStatusCard';
import ReceiptViewModal from './modal/ReceiptViewModal';
import classNames from '@/helpers/classNames';
import formatPrice from '@/helpers/currencyFormat';
import updateSession from '@/helpers/updateSession';
import useGetSubscriptions from './hooks/useGetSubscriptions';
import useGetReceiptDetail from './hooks/useGetReceiptDetail';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [activePlans, setActivePlans] = useState<any>({});
  const [isReceiptViewModalOpen, setIsReceiptViewModalOpen] = useState<boolean | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<any>([]);
  const [selectedReferenceId, setSelectedReferenceId] = useState<any>('');
  const [currentTab, setCurrentTab] = useState('');
  const [itemsFilter, setItemsFilter] = useState({
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
  }, [receiptDetailData]);

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
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative'>
        <div className='p-2 md:p-8 lg:p-4 relative'>
          <h2 className='text-2xl font-bold text-indigo-dye'>Subscription</h2>
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
              {(!isLoading && Object.keys(activePlans).length !== 0) && (
                <div>
                  <p className='font-semibold mb-8'>Current Plan</p>
                  <div className='flex mb-10'>
                    <div className='flex py-6 px-12 border-2 rounded-[2rem] mr-10 w-[30rem]'>
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
                      <div className='flex py-6 px-12 border-2 rounded-[2rem] items-center w-[30rem]'>
                        <div>
                          <img className='h-[70px]' src={`/assets/restart.png`} alt='restart' />
                        </div>
                        <div className='ml-4'>
                          <p>Renew at</p>
                          <span className='mb-[0.5rem] font-bold'>{activePlans.end_date}</span>
                        </div>
                      </div>
                    )}
                    {!activePlans.is_used && (
                      <PurchaseStatusCard refetch={refetch} plan={activePlans} />
                    )}
                  </div>
                  <p className='font-semibold mb-8'>Plan Privileges</p>
                  <div className='flex'>
                    {(activePlans.plan_features || []).map((feature: any, index: any) => {
                      return (
                        <div key={index} className='text-center py-6 px-8 border-2 rounded-[2rem] mr-10 w-[14rem]'>
                          <div className='flex mx-auto mb-2 justify-center'>
                            <img className='h-[35px]' src={`/assets/check-icon.png`} alt='check-icon' />
                          </div>
                          <div>
                            <span className='mb-[0.5rem] font-bold'>{feature}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {(!isLoading && Object.keys(activePlans).length === 0) && (
                <div className='w-full flex justify-center'>
                  <div className='w-1/4 border-2 border-dashed rounded-[2rem] mt-8 px-8 py-12 text-center'>
                    <p className='mb-4 font-semibold'>You’re not subscribed to any plans yet.</p>
                    <Link href={`/pricing`} className='bg-[#FFC107] text-black rounded-md px-4 py-2 mt-4'>
                      Subscribe Now
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
          {currentTab === '#transactions-history' && (
            <>
              <div className='mt-6 flex flex-col lg:flex-row items-center gap-4'>
                <div className='flex-none flex flex-col lg:flex-row items-center gap-2'>
                  <div className='relative'>
                    <CustomDatePicker
                      name={'from'}
                      selected={itemsFilter.from}
                      pickerOnChange={setItemsFilter}
                      className={
                        'appearance-none block w-44 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                      }
                      objectFilter={itemsFilter}
                      inputOnChange={setItemsFilter}
                      placeholder={'mm/dd/yyyy'}
                    />
                  </div>
                  <p>to</p>
                  <div className='relative'>
                    <CustomDatePicker
                      name={'to'}
                      selected={itemsFilter.to}
                      pickerOnChange={setItemsFilter}
                      className={
                        'appearance-none block w-44 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                      }
                      objectFilter={itemsFilter}
                      inputOnChange={setItemsFilter}
                      placeholder={'mm/dd/yyyy'}
                    />
                  </div>
                </div>
                <div className='flex-none lg:w-1/3'>
                  <div className='relative flex items-center'>
                    <input
                      type='text'
                      name='search'
                      id='search'
                      className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                      onChange={(e) => setItemsFilter({ ...itemsFilter, search: e.target.value })}
                      placeholder='Search...'
                    />
                  </div>
                </div>
                <button
                  className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
                  onClick={checkIfDateIsValid}
                >
                  <MagnifyingGlassIcon className='h-5 w-5' />
                </button>
              </div>
              <div className='mt-8 flow-root'>
                <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                  <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                    <table className='min-w-full divide-y divide-gray-300 text-center'>
                      <thead className='divide-y divide-gray-200'>
                        <tr>
                          <th className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Reference No.</th>
                          <th className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Subscription Plan
                          </th>
                          <th className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Subscription Start Date
                          </th>
                          <th className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Subscription End Date
                          </th>
                          <th className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Subscription Status
                          </th>
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
