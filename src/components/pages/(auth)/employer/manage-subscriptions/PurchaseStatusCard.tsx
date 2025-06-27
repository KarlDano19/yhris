/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import CancelConfirmModal from './modal/CancelConfirmModal';

const PurchaseStatusCard = ({ refetch, plan }: any) => {
  const router = useRouter();
  const [showCancelConfirmModal, setCancelConfirmModal] = useState<boolean | null>(null);

  return (
    <div className='py-6 px-12 border-2 rounded-[2rem] items-center w-[30rem] text-center'>
      {plan.status === 'Processing' ? (
        <h4 className='text-[15px] font-medium tracking-[0.02em]'>
          You're almost there! waiting for the payment to success.
        </h4>
      ) : plan.status === 'Paid' ? (
        plan.is_ended ? (
          <>
            <h4 className='text-[15px] font-medium tracking-[0.02em]'>Your subscription has ended.</h4>
            <button className='bg-[#FFC107] text-black rounded-md font-semibold px-4 py-2 mt-4' onClick={() => router.push('/landing-page/pricing')}>
              Renew Subscription
            </button>
          </>
        ) : (
          <>
            <h2 className='text-[28px] font-semibold'>Congratulations!</h2>
            <h4 className='text-[15px] font-medium tracking-[0.02em]'>You have successfully purchased your plan.</h4>
          </>
        )
      ) : plan.status === 'Pending' ? (
        <>
          <h4 className='text-[15px] font-medium tracking-[0.02em]'>Did something went wrong with your payment?</h4>
          <h4 className='text-[15px] font-medium tracking-[0.02em]'>
            <button
              className='bg-transparent border-0 font-semibold text-[15px] text-[#2757ed] text-[underline] cursor-pointer hover:text-[#4f80ff]'
              onClick={() => {
                window.open(plan.checkout_url, 'popupWindow', 'width=720,height=720');
              }}
            >
              Click here to go to the payment window
            </button>
            &nbsp;or&nbsp;
            <button
              className='bg-transparent border-0 font-semibold text-[15px] text-[#2757ed] text-[underline] cursor-pointer hover:text-[#4f80ff]'
              type='button'
              onClick={() => setCancelConfirmModal(true)}
            >
              Cancel Purchase
            </button>
          </h4>
        </>
      ) : null}
      {showCancelConfirmModal && (
        <CancelConfirmModal
          referenceId={plan.reference_id}
          refetch={refetch}
          isOpen={showCancelConfirmModal}
          setIsOpen={setCancelConfirmModal}
        />
      )}
    </div>
  );
};

export default PurchaseStatusCard;
