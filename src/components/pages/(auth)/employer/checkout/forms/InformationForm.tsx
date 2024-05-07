import React from 'react';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';

import classNames from '@/helpers/classNames';

const RequiredLabel = styled.label`
  &::after {
    content: '*';
    color: red;
  }
`;

const InformationForm = ({ register, errors, setError, handleSubmit, SetCheckoutProgress }: any) => {
  const onSubmit = () => {
    SetCheckoutProgress(1);
  };

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

  return (
    <form className='mb-3 space-y-4' onSubmit={handleSubmit(onSubmit)}>
      <div className='form-group'>
        <RequiredLabel htmlFor='email' className='text-[15px] font-normal tracking-wider'>
          Email Address
        </RequiredLabel>
        <input
          id='email'
          type='email'
          className={classNames(
            'w-full mt-2 border border-[#acb9cb] rounded-md text-[15px] p-[0.7rem]',
            errors.email ? 'is-invalid' : ''
          )}
          placeholder='Enter Email Address...'
          {...register('email', {
            validate: validation('email', 'Email is required'),
          })}
        />
      </div>
      <div className='form-group'>
        <RequiredLabel htmlFor='company_name' className='text-[15px] font-normal tracking-wider'>
          Company Name
        </RequiredLabel>
        <input
          id='company_name'
          type='text'
          className={classNames(
            'w-full mt-2 border border-[#acb9cb] rounded-md text-[15px] p-[0.7rem]',
            errors.company_name ? 'is-invalid' : ''
          )}
          placeholder='Enter Company Name...'
          {...register('company_name', {
            validate: validation('company_name', 'Company name is required'),
          })}
        />
      </div>
      <div className='form-group'>
        <RequiredLabel htmlFor='company_address' className='text-[15px] font-normal tracking-wider'>
          Company Address
        </RequiredLabel>
        <input
          id='company_address'
          type='text'
          className={classNames(
            'w-full mt-2 border border-[#acb9cb] rounded-md text-[15px] p-[0.7rem]',
            errors.company_address ? 'is-invalid' : ''
          )}
          placeholder='Enter Company Address...'
          {...register('company_address', {
            validate: validation('company_address', 'Company address is required'),
          })}
        />
      </div>
      <div className='form-group mb-4'>
        <RequiredLabel htmlFor='contact_number' className='text-[15px] font-normal tracking-wider'>
          Contact Number
        </RequiredLabel>
        <input
          id='contact_number'
          type='text'
          className={classNames(
            'w-full mt-2 mb-4 border border-[#acb9cb] rounded-md text-[15px] p-[0.7rem]',
            errors.contact_number ? 'is-invalid' : ''
          )}
          placeholder='Enter Contact Number...'
          {...register('contact_number', {
            validate: validation('contact_number', 'Contact number is required'),
          })}
        />
      </div>
      <div className='form-check d-flex items-center mx-2'>
        <input
          id='news_subscription'
          type='checkbox'
          className='h-[19px] w-[19px] mb-4'
          defaultChecked={true}
          {...register('is_news_subscription', { required: false })}
        />
        <label className='form-check-label ml-3' htmlFor='news_subscription'>
          I’d like to receive helpful promotional and email updates from YAHSHUA Payroll Solutions.
        </label>
      </div>
      <button
        className='h-[60px] rounded-lg bg-[#2757ed] text-lg leading-6 tracking-wider text-white hover:bg-[#4f80ff] w-full'
        type='submit'
      >
        Next
      </button>
    </form>
  );
};

export default InformationForm;
