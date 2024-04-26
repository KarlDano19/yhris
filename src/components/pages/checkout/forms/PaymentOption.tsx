import React from 'react';
import { Tooltip } from 'react-tooltip';
import styled from 'styled-components';
import toast from "react-hot-toast";

import MayaLogo from '@/svg/MayaLogo';
import DragonpayLogo from '@/svg/DragonpayLogo';
import PaymongoLogo from '@/svg/PaymongoLogo'

const PaymentsDiv = styled.div`
  display: inline-flex;
  align-items: center;
  height: 50px;
`;
const DivSpacer = styled.div`
  display: block;
  height: 100px;
`;

const PaymentOption = ({
  payments,
  errors,
  setError,
  register,
  onSubmit,
  isProcessing,
}: any) => {
  const validation = (key: any, message: any) => (value: any) => {
    if (!value) {
      setError(key, { type: 'focus' }, { shouldFocus: true });
      toast.error(message);
      return false;
    }
    return true;
  };

  const renderPayments = () => {
    if (!payments || !payments.length) {
      return null;
    }
    return payments.map((item: any) => {
      return (
        <div className='ml-4' key={item.id}>
          {item.is_active && (
            <PaymentsDiv>
              <input
                id={item.payment_type}
                type='radio'
                className='h-[20px] w-[20px]'
                name='payment'
                defaultValue={item.payment_type}
                {...register('payment', { validate: validation('payment', 'Select a payment method') })}
              />
              <label className='ml-3 h-[50px]' htmlFor={item.payment_type}>
                {item.payment_type === 'maya' && <MayaLogo />}
                {item.payment_type === 'dragonpay' && <DragonpayLogo />}
                {item.payment_type === 'paymongo' && <PaymongoLogo />}
              </label>
            </PaymentsDiv>
          )}
          {!item.is_active && (
            <>
              <PaymentsDiv
                data-tooltip-id='payment-tooltip'
                data-tooltip-content='Not available right now.'
                data-tooltip-place='right'
              >
                <input
                  id={item.payment_type}
                  type='radio'
                  className='h-[20px] w-[20px]'
                  name='payment'
                  defaultValue={item.payment_type}
                  disabled={true}
                />
                <label className='ml-3 h-[50px]' htmlFor={item.payment_type}>
                  {item.payment_type === 'maya' && <MayaLogo />}
                  {item.payment_type === 'dragonpay' && <DragonpayLogo />}
                  {item.payment_type === 'paymongo' && <PaymongoLogo />}
                </label>
              </PaymentsDiv>
              <Tooltip id='payment-tooltip' />
            </>
          )}
        </div>
      );
    });
  };

  return (
    <form className='mb-5 pt-4' onSubmit={onSubmit}>
      <p className='mb-8 font-semibold text-[18px] leading-[20px] tracking-[0.02em] text-[#373530]'>Payment Method</p>
      {renderPayments()}
      <DivSpacer />
      <button
        className='w-full h-[50px] rounded-lg bg-[#2757ed] text-white text-[18px] leading-[26px] tracking-[0.02em] hover:bg-[#4f80ff] focus:outline-none'
        type='submit'
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default PaymentOption;
