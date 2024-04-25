import React from 'react';
import { Tooltip } from 'react-tooltip';
import styled from 'styled-components';
import toast from "react-hot-toast";

import MayaLogo from '@/svg/MayaLogo';
import DragonpayLogo from '@/svg/DragonpayLogo';
import PaymongoLogo from '@/svg/PaymongoLogo'

const PaymentTitle = styled.div`
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  letter-spacing: 0.02em;
  color: #373530;
`;
const PaymentsDiv = styled.div`
  display: inline-flex;
  align-items: center;
  height: 50px;
`;
const PaymentTypeLabel = styled.label`
  height: 50px;
`;
const RadioInput = styled.input`
  height: 20px;
  width: 20px;
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
              <RadioInput
                id={item.payment_type}
                type='radio'
                name='payment'
                defaultValue={item.payment_type}
                {...register('payment', { validate: validation('payment', 'Select a payment method') })}
              />
              <PaymentTypeLabel className='ml-3' htmlFor={item.payment_type}>
                {item.payment_type === 'maya' && <MayaLogo />}
                {item.payment_type === 'dragonpay' && <DragonpayLogo />}
                {item.payment_type === 'paymongo' && <PaymongoLogo />}
              </PaymentTypeLabel>
            </PaymentsDiv>
          )}
          {!item.is_active && (
            <>
              <PaymentsDiv
                data-tooltip-id='payment-tooltip'
                data-tooltip-content='Not available right now.'
                data-tooltip-place='right'
              >
                <RadioInput
                  id={item.payment_type}
                  type='radio'
                  name='payment'
                  defaultValue={item.payment_type}
                  disabled={true}
                />
                <PaymentTypeLabel className='ml-3' htmlFor={item.payment_type}>
                  {item.payment_type === 'maya' && <MayaLogo />}
                  {item.payment_type === 'dragonpay' && <DragonpayLogo />}
                  {item.payment_type === 'paymongo' && <PaymongoLogo />}
                </PaymentTypeLabel>
              </PaymentsDiv>
              <Tooltip id='payment-tooltip' />
            </>
          )}
        </div>
      );
    });
  };

  return (
    <form className='mb-3 pt-5' onSubmit={onSubmit}>
      <PaymentTitle className='mb-4'>Payment Method</PaymentTitle>
      {renderPayments()}
      <DivSpacer />
      <button
        className='w-full h-[60px] rounded-lg bg-[#2757ed] text-white text-[20px] leading-[26px] tracking-[0.02em] hover:bg-[#4f80ff] focus:outline-none'
        type='submit'
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default PaymentOption;
