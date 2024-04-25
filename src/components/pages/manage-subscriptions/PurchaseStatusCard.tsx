import React from 'react';

import CancelConfirmModal from './modal/CancelConfirmModal';

const PurchaseStatusCard = ({ refetch, plan }: any) => {
  const [showCancelConfirmModal, setCancelConfirmModal] = React.useState(false);

  return (
    <div className='text-center border-1 border-[#4f80ff] rounded-[10px] p-5 mt-8'>
      {plan.status === 'Processing' ? (
        <h4 className='text-[15px] font-medium tracking-[0.02em]'>
          You're almost there! waiting for the payment to success.
        </h4>
      ) : plan.status === 'Paid' ? (
        plan.is_ended ? (
          <>
            <h4 className='text-[15px] font-medium tracking-[0.02em]'>Your subscription has ended.</h4>
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
      <CancelConfirmModal
        referenceId={plan.reference_id}
        refetch={refetch}
        isOpen={showCancelConfirmModal}
        onClose={() => setCancelConfirmModal(false)}
      />
    </div>
  );
};

export default PurchaseStatusCard;
