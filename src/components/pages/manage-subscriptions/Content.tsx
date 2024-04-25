'use client';

import React, { useState, useEffect } from 'react';

import Link from 'next/link';

import styled from 'styled-components';
import PurchaseStatusCard from './PurchaseStatusCard';
import useGetSubscriptions from './hooks/useGetSubscriptions';
import formatPrice from '@/helpers/currencyFormat';
import updateSession from '@/helpers/updateSession';

const CancelledLabel = styled.p`
  font-weight: 700 !important;
  color: red;
`;

const Content = ({ hasActiveSubscription }: any) => {
  const [activePlans, setActivePlans] = useState<any>({});
  const [transactionHistory, setTransactionHistory] = useState<any>([]);
  const { data, isLoading, refetch } = useGetSubscriptions();

  useEffect(() => {
    if (data && Object.keys(data).length !== 0 && !isLoading) {
      setTransactionHistory(data.transaction_history);
      setActivePlans(data.active_plan);
      if (!hasActiveSubscription && data.active_plan.is_used && !data.active_plan.is_ended) {
        updateSession({ hasActiveSubscription: true });
      }
    }
  }, [data]);

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

  const renderTransactionHistory = () => {
    if (transactionHistory.length === 0) {
      return (
        <tr>
          <td className='border w-1/8 px-4 py-2'>No transaction history</td>
        </tr>
      );
    }
    return transactionHistory.map((transaction: any, index: any) => {
      return (
        <tr key={index}>
          <td className='border w-1/8 px-4 py-2'>{transaction.reference_id}</td>
          <td className='border w-1/8 px-4 py-2'>{transaction.plan}</td>
          <td className='border w-1/8 px-4 py-2'>{transaction.start_date}</td>
          <td className='border w-1/8 px-4 py-2'>{transaction.end_date}</td>
          <td className='border w-1/8 px-4 py-2'>{transaction.status}</td>
          <td className='border w-1/8 px-4 py-2'>{transaction.payment}</td>
          <td className='border w-1/8 px-4 py-2'>{formatPrice(transaction.amount)}</td>
          <td className='border w-1/8 px-4 py-2'>
            <button className='border px-4 py-2'>View Receipt</button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className='h-[100vh]'>
      <div>
        <h1 className='text-[24px]'>Active Plans</h1>
        <div className='flex'>
          {Object.keys(activePlans).length ? (
            <>
              <div className='py-8 px-12 grow relative'>
                <div className='text-center'>
                  <h2 className='text-[30px] font-bold text-[#2C3F58]'>
                    YAHSHUA <span className='text-[30px] font-bold text-[#FFC107]'>HRIS</span>
                  </h2>
                </div>
                <div className='flex mx-3 mt-5'>
                  <div>
                    <img src={`/assets/yahshua-hris.png`} alt='yahshua-hris' />
                  </div>
                  <div className='mx-4 mb-3'>
                    <span className='text-[20px] font-bold leading-[26px] tracking-[0.02em]'>{activePlans.plan}</span>
                    <p className='text-[15px]'>
                      Number of Employees: {activePlans.number_of_employees}
                      <br />
                      Lock-in Period: {lockInPeriod()}
                    </p>
                    <div className='mt-4'>
                      {activePlans.plan_features.map((feature: any, index: any) => {
                        return (
                          <div key={index} className='flex mb-[0.8rem]'>
                            <img
                              src={`/assets/check-icon.png`}
                              alt='check-icon'
                            />
                            <span className='ml-3 text-[15px]'>{feature}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className='border border-[#878787] mb-4'></div>
                <div className='flex'>
                  <div className='grow mb-4'>
                    <span className='text-[15px] font-bold leading-[20px] tracking-[0.02em]'>Payment Type</span>
                    <p className='mt-[0.3rem] text-[15px] font-normal leading-[20px] tracking-[0.02em]'>
                      Online Payment - {activePlans.payment}
                    </p>
                  </div>
                  <div className='grow mb-4'>
                    <span className='text-[15px] font-bold leading-[20px] tracking-[0.02em]'>Payment Status</span>
                    {!['Paid', 'Cancelled', 'Failed'].includes(activePlans.status) && (
                      <p className='mt-[0.3rem] text-[15px] font-normal leading-[20px] tracking-[0.02em]'>
                        {activePlans.status}
                      </p>
                    )}
                    {activePlans.status === 'Paid' && <p>{activePlans.status}</p>}
                    {(activePlans.status === 'Cancelled' || activePlans.status === 'Failed') && (
                      <CancelledLabel>{activePlans.status}</CancelledLabel>
                    )}
                  </div>
                </div>
                <div className='flex'>
                  <div className='grow mb-4'>
                    <span className='text-[15px] font-bold leading-[20px] tracking-[0.02em]'>Subscription Plan</span>
                    <p className='mt-[0.3rem] text-[15px] font-normal leading-[20px] tracking-[0.02em]'>
                      {activePlans.plan}
                    </p>
                  </div>
                </div>
                <div className='flex mb-5'>
                  <div className='grow mb-4'>
                    <span className='text-[15px] font-bold leading-[20px] tracking-[0.02em]'>
                      Subscription Start Date
                    </span>
                    <p className='mt-[0.3rem] text-[15px] font-normal leading-[20px] tracking-[0.02em]'>
                      {activePlans.start_date}
                    </p>
                  </div>
                  <div className='grow mb-4'>
                    <span className='text-[15px] font-bold leading-[20px] tracking-[0.02em]'>
                      Subscription End Date
                    </span>
                    <p className='mt-[0.3rem] text-[15px] font-normal leading-[20px] tracking-[0.02em]'>
                      {activePlans.end_date}
                    </p>
                  </div>
                </div>
              </div>
              <div className='px-2 py-4 shadow-custom grow'>
                <div className='flex mx-1 mb-4'>
                  <div>
                    <img src={`/assets/building.png`} alt='building' />
                  </div>
                  <div className='mx-4'>
                    <h2 className='font-bold'>My Account</h2>
                    <p className='text-[15px]'>Reference No. {activePlans.reference_no}</p>
                  </div>
                </div>
                <div className='flex'>
                  <div className='grow mb-4'>
                    <span className='text-[15px] font-bold leading-[20px] tracking-[0.02em]'>Company Name</span>
                    <p className='mt-[0.3rem] font-normal leading-[20px] tracking-[0.02em] text-[18px]'>
                      {activePlans.billing_information.company_name}
                    </p>
                  </div>
                  <div className='grow mb-4'>
                    <span className='text-[15px] font-bold leading-[20px] tracking-[0.02em]'>Email Address</span>
                    <p className='mt-[0.3rem] font-normal leading-[20px] tracking-[0.02em] text-[18px]'>
                      {activePlans.billing_information.email}
                    </p>
                  </div>
                </div>
                <div className='flex'>
                  <div className='grow mb-4'>
                    <span className='text-[15px] font-bold leading-[20px] tracking-[0.02em]'>Company Address</span>
                    <p className='mt-[0.3rem] font-normal leading-[20px] tracking-[0.02em] text-[18px]'>
                      {activePlans.billing_information.company_address}
                    </p>
                  </div>
                  <div className='grow mb-4'>
                    <span className='text-[15px] font-bold leading-[20px] tracking-[0.02em]'>Contact Number</span>
                    <p className='mt-[0.3rem] font-normal leading-[20px] tracking-[0.02em] text-[18px]'>
                      {activePlans.billing_information.contact_number}
                    </p>
                  </div>
                </div>
                <PurchaseStatusCard refetch={refetch} plan={activePlans} />
              </div>
            </>
          ) : (
            <div className='w-full border-2 border-dashed px-8 py-12 text-center'>
              <p className='mb-3'>You don’t have any active subscriptions</p>
              <Link href={`/pricing`} className='bg-[#FFC107] text-white rounded-md px-4 py-2 mt-4'>
                Subscribe Now
              </Link>
            </div>
          )}
        </div>
      </div>
      <div>
        <h1 className='text-[24px]'>Transaction History</h1>
        <table className='w-full'>
          <thead>
            <tr>
              <th className='border w-1/8 px-4 py-2'>Reference No.</th>
              <th className='border w-1/8 px-4 py-2'>Subscription Plan</th>
              <th className='border w-1/8 px-4 py-2'>Subscription Start Date</th>
              <th className='border w-1/8 px-4 py-2'>Subscription End Date</th>
              <th className='border w-1/8 px-4 py-2'>Subscription Status</th>
              <th className='border w-1/8 px-4 py-2'>Payment Type</th>
              <th className='border w-1/8 px-4 py-2'>Total</th>
              <th className='border w-1/8 px-4 py-2'>Action</th>
            </tr>
          </thead>
          <tbody>{renderTransactionHistory()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Content;
