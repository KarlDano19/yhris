import React, { useState } from 'react';

import { useParams } from 'next/navigation';

import useDiscount from '../hooks/useDiscounts';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import formatPrice from '@/helpers/currencyFormat';

const OrderedSection = ({ title, price, setVoucherCode, plan_employee_slot, added_employee_slot, duration }: any) => {
  const [inputtedCode, setInputtedCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const { slug } = useParams();
  const { mutate, isLoading } = useDiscount();

  const periodicityPrice = () => {
    if (!price) {
      return 0;
    }
    let customPrice = price;
    if (duration) {
      customPrice = customPrice * 12 * duration;
    }
    return customPrice;
  };

  const getAddedPrice = () => {
    return periodicityPrice() + added_employee_slot * 60;
  };

  const getDiscountPrice = () => {
    return (getAddedPrice() / (1 + 12 / 100)) * (discount / 100);
  };

  const getNetOfDiscount = () => {
    return getAddedPrice() - getDiscountPrice();
  };

  const getNumberEmployees = () => {
    if (isNaN(plan_employee_slot + added_employee_slot)) {
      return 0;
    }
    return plan_employee_slot + added_employee_slot;
  };

  const lockInPeriod = () => {
    let periodicity = 'Monthly';
    if (duration) {
      periodicity = `${duration} year`;
      if (duration > 1) {
        periodicity = `${duration} years`;
      }
    }
    return periodicity;
  };

  const availDiscount = () => {
    let payloads = {
      code: inputtedCode,
      employees_slot: plan_employee_slot + added_employee_slot,
      slug: slug,
    };
    const callbackReq = {
      onSuccess: (data: any) => {
        setVoucherCode(data.code);
        setDiscount(data.discount);
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 4000,
        });
      },
    };
    mutate(payloads, callbackReq);
  };

  return (
    <div className='p-8 grow shadow-custom flex-1'>
      <div className='flex mb-8'>
        <div className='mr-5'>
          <img className='h-[65px]' src={`/assets/bulb.png`} alt='bulb' />
        </div>
        <div className='block'>
          <span className='font-bold text-[20px] tracking-[0.02em] text-[#373530]'>{title}</span>
          <p className='text-[12px]'>
            Number of Employees: {getNumberEmployees()}
            <br />
            Lock-in Period: {lockInPeriod()}
          </p>
        </div>
        <div className='flex items-center justify-end grow text-right'>
          <label className='text-[15px]'>PHP {formatPrice(getAddedPrice())}</label>
        </div>
      </div>
      <div className='flex mb-8'>
        <input
          type='text'
          className='w-full border border-[#acb9cb] rounded-md text-[15px] p-2 mr-6'
          placeholder='Enter Discount Code'
          value={inputtedCode}
          onChange={({ target }: any) => {
            setInputtedCode(target.value);
            if (!target.value) {
              if (discount) {
                setVoucherCode('');
                setDiscount(0);
              }
            }
          }}
        />
        <button
          className='w-1/4 h-12 rounded-md bg-[#2757ed] text-lg leading-6 tracking-wider text-white enabled:hover:bg-[#4f80ff] disabled:opacity-50'
          disabled={!inputtedCode}
          onClick={() => availDiscount()}
        >
          Apply
        </button>
      </div>
      <div className='mb-8 space-y-4'>
        <div className='flex justify-between'>
          <h3 className='text-[15px]'>Subtotal</h3>
          <h3 className='text-[15px]'>PHP {formatPrice(getAddedPrice())}</h3>
        </div>
        {!!discount && (
          <>
            <div className='flex justify-between'>
              <h3 className='text-[15px]'>Discount %</h3>
              <h3 className='text-[15px]'>{discount}%</h3>
            </div>
            <div className='flex justify-between'>
              <h3 className='text-[15px]'>Discounted Amount</h3>
              <h3 className='text-[15px]'>PHP {formatPrice(getDiscountPrice())}</h3>
            </div>
            <div className='flex justify-between'>
              <h3 className='text-[15px]'>Net of Discount</h3>
              <h3 className='text-[15px]'>PHP {formatPrice(getNetOfDiscount())}</h3>
            </div>
          </>
        )}
        <div className='flex justify-between'>
          <h3 className='text-[15px]'>VAT (12%)</h3>
          <h3 className='text-[15px]'>PHP {formatPrice(getNetOfDiscount() * (12 / 100))}</h3>
        </div>
        <div className='flex justify-between'>
          <h3 className='text-[15px] font-semibold text-[#2757ed]'>Total</h3>
          <h3 className='text-[15px] font-semibold text-[#2757ed]'>
            PHP {formatPrice(getNetOfDiscount() * (1 + 12 / 100))}
          </h3>
        </div>
      </div>
      <div className='text-[0.9vw] tracking-[0.02em] text-[#f15353]'>
        <i>Please note that the subscription fee and related services are final and non-refundable.</i>
      </div>
      <div className='flex justify-center mt-12'>
        <img src={`/assets/walking-person.png`} alt='walking-person' />
      </div>
    </div>
  );
};

export default OrderedSection;
