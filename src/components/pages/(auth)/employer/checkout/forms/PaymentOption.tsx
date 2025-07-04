import React from 'react';

import { Tooltip } from 'react-tooltip';
import styled from 'styled-components';
import toast from "react-hot-toast";

import CustomToast from '@/components/CustomToast';

import MayaLogo from '@/svg/MayaLogo';
import DragonpayLogo from '@/svg/DragonpayLogo';
import PaymongoLogo from '@/svg/PaymongoLogo'

const PaymentOption = ({
  plan,
  payments,
  errors,
  setError,
  register,
  onSubmit,
  isLoading,
}: any) => {
  const validation = (key: any, message: any) => (value: any) => {
    if (!value) {
      setError(key, { type: 'focus' }, { shouldFocus: true });
      toast.custom(() => <CustomToast message={message} type='error' />, {
        duration: 4000,
      });
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
            <div className='inline-flex items-center h-[50px]'>
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
            </div>
          )}
          {!item.is_active && (
            <>
              <div className='inline-flex items-center h-[50px]'
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
              </div>
              <Tooltip id='payment-tooltip' />
            </>
          )}
        </div>
      );
    });
  };

  return (
    <form className='mb-5 pt-4' onSubmit={onSubmit}>
      {
        !plan.is_allow_trial && (
          <>
            <p className='mb-8 font-semibold text-[18px] leading-[20px] tracking-[0.02em] text-[#373530]'>Payment Method</p>
            {renderPayments()}
            <div className='block h-[100px]' />
          </>
        )
      }
      {
        plan.is_allow_trial && (
          <>
            <p className='mb-8 font-semibold text-[18px] leading-[20px] tracking-[0.02em] text-[#373530]'>Congratulations! Youre once step closer to your free trial.</p>
            <div className='block h-[50px]' />
          </>
        )
      }
      <button
        className='w-full h-[50px] rounded-lg bg-[#2757ed] text-white text-[18px] leading-[26px] tracking-[0.02em] hover:bg-[#4f80ff] focus:outline-none'
        type='submit'
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : plan.is_allow_trial ? 'Click here to start free trial' : 'Next'}
      </button>
    </form>
  );
};

export default PaymentOption;
