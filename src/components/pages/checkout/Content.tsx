'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useParams, useSearchParams } from 'next/navigation';

import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import classNames from '@/helpers/classNames';
import updateSession from '@/helpers/updateSession';
import InformationForm from './forms/InformationForm';
import PaymentOption from './forms/PaymentOption';
import OrderedSection from './forms/OrderSection';
import useGetPlan from './hooks/useGetPlan';
import useGetPayments from './hooks/useGetPayments';
import useCreatePayment from './hooks/useCreatePayment';

const Content = () => {
  const params = useParams();
  const searchParams = useSearchParams() as any;
  const [plan, SetPlan] = useState<any>({});
  const [payments, SetPayments] = useState([]);
  const [checkoutProgress, SetCheckoutProgress] = useState(1);
  const [isProcessing, SetIsProcessing] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState('new');
  const [voucherCode, setVoucherCode] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const { data: dataPlan, isLoading: isPlanLoading } = useGetPlan(params.slug);
  const { data: dataPayment, isLoading: isPaymentLoading } = useGetPayments();
  const { mutate, isLoading } = useCreatePayment();

  useEffect(() => {
    if (dataPlan && Object.keys(dataPlan).length !== 0 && !isPlanLoading) {
      SetPlan(dataPlan);
    }
  }, [dataPlan]);

  useEffect(() => {
    if (dataPayment && !isPaymentLoading) {
      SetPayments(dataPayment);
    }
  }, [dataPayment]);

  const additionalEmployeeSlot = Math.abs(parseInt(searchParams.get('additional_employee_slot') || 0));

  const duration = Math.abs(parseInt(searchParams.get('duration') || 0));

  const onSubmit = handleSubmit((data) => {
    const paymentType = data.payment;
    const payloads: any = {
      info: data,
      path: window.location.pathname,
      url: window.location.origin,
      additional_employees: additionalEmployeeSlot,
      plan_id: plan.id,
      periodicity: duration ? 'yearly' : 'monthly',
      periodicity_duration: duration,
      voucher_code: voucherCode,
    };
    if (paymentType === 'maya') {
      payloads['payment_id'] = getPaymentId('maya');
    }
    if (paymentType === 'dragonpay') {
      payloads['payment_id'] = getPaymentId('dragonpay');
    }
    if (paymentType === 'paymongo') {
      payloads['payment_id'] = getPaymentId('paymongo');
    }
    const callbackReq = {
      onSuccess: async (data: any) => {
        await updateSession({ hasPendingTransaction: true });
        setTimeout(() => {
          window.open(data.checkout_url, 'popupWindow', 'width=720,height=720');
          setTimeout(() => {
            window.location.replace(data.callback_url);
          }, 250);
        }, 500);
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 4000,
        });
      },
    };
    mutate(payloads, callbackReq);
  });

  const getPaymentId = (type: any) => {
    const payment_detail: any = payments.find((item: any) => item.payment_type == type);
    if (payment_detail) {
      return payment_detail.id;
    }
    return '';
  };

  const ChevronSvg = ({ fill }: any) => {
    return (
      <div>
        <svg className='m-2' xmlns='http://www.w3.org/2000/svg' width='5' height='8' viewBox='0 0 5 8' fill='none'>
          <path d='M0 0.715152L0.76264 0L5 4L0.758355 8L0 7.28485L3.48329 4L0 0.715152Z' fill={fill} />
        </svg>
      </div>
    );
  };

  return (
    <div className='flex h-screen'>
      <div className='py-8 px-16 relative'>
        <div className='text-center mb-4'>
          <h2 className='text-[30px] font-bold text-[#2C3F58]'>
            YAHSHUA <span className='text-[30px] font-bold text-[#FFC107]'>HRIS</span>
          </h2>
        </div>
        <div className='flex justify-center align-center mb-4 font-semibold text-[15px] text-gray-500'>
          {/* <div className='text-black'>Information</div>
          <ChevronSvg fill={checkoutProgress == 2 ? '#000000' : '#878787'} /> */}
          {/* <div className={classNames(checkoutProgress == 2 ? 'text-black' : '', '')}>Payment</div> */}
        </div>
        {/* {checkoutProgress == 0 && (
          <InformationForm
            register={register}
            errors={errors}
            setError={setError}
            handleSubmit={handleSubmit}
            SetCheckoutProgress={SetCheckoutProgress}
          />
        )} */}
        {checkoutProgress == 1 && (
          <PaymentOption
            payments={payments}
            errors={errors}
            setError={setError}
            register={register}
            onSubmit={onSubmit}
            isProcessing={isProcessing}
          />
        )}
        <div className='font-normal text-gray-500 leading-4 tracking-wider text-[15px]'>
          By clicking Next, you agree to our{' '}
          <a href='#' data-toggle='modal' data-target='#privacyModal' className='text-[#355FD0] text-sm underline'>
            Terms of Service
          </a>
          ,{' '}
          <a href='#' data-toggle='modal' data-target='#privacyModal' className='text-[#355FD0] text-sm underline'>
            Privacy Notice
          </a>
          , and{' '}
          <a href='#' data-toggle='modal' data-target='#privacyModal' className='text-[#355FD0] text-sm underline'>
            Personal Data Collection and Disclosure Policy
          </a>
          .
        </div>
      </div>
      <OrderedSection
        title={plan.name}
        price={plan.price}
        plan_employee_slot={plan.max_employees}
        added_employee_slot={additionalEmployeeSlot}
        setVoucherCode={setVoucherCode}
        duration={duration}
      />
    </div>
  );
};

export default Content;
