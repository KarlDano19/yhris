'use client';

import React, { useState, useEffect } from 'react';
import DropDownArrow from '@/svg/DropDownArrow';
import countryCode from '@/utils/country-code';

function ContactsTab({ register, onSubmit, isLoading, watch, setValue }: { register: any; onSubmit: any; isLoading: any; watch: any; setValue: any }) {
  // Country code and mobile number states
  const [selectedCountryCode, setSelectedCountryCode] = useState('PH'); // Default to Philippines
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');

  // Country code and mobile number states for contact person
  const [selectedContactCountryCode, setSelectedContactCountryCode] = useState('PH'); // Default to Philippines
  const [showContactCountryDropdown, setShowContactCountryDropdown] = useState(false);
  const [contactMobileNumber, setContactMobileNumber] = useState('');

  // Get form data from the form context (watch all values)
  const formData = watch();

  // Initialize mobile number with current value
  useEffect(() => {
    if (formData && formData.mobile) {
      // Extract country code and mobile number from the full number
      const fullNumber = formData.mobile.toString();
      // Find the country code that matches the beginning of the number
      for (const [countryKey, code] of Object.entries(countryCode)) {
        if (fullNumber.startsWith(code)) {
          setSelectedCountryCode(countryKey);
          setMobileNumber(fullNumber.substring(code.length));
          break;
        }
      }
    }
  }, [formData]);

  // Initialize contact person mobile number with current value
  useEffect(() => {
    if (formData && formData.contactPersonContactNo) {
      // Extract country code and mobile number from the full number
      const fullNumber = formData.contactPersonContactNo.toString();
      // Find the country code that matches the beginning of the number
      for (const [countryKey, code] of Object.entries(countryCode)) {
        if (fullNumber.startsWith(code)) {
          setSelectedContactCountryCode(countryKey);
          setContactMobileNumber(fullNumber.substring(code.length));
          break;
        }
      }
    }
  }, [formData]);

  // Country code handlers for main mobile
  const handleCountryCodeSelect = (countryKey: string) => {
    setSelectedCountryCode(countryKey);
    setShowCountryDropdown(false);
    // Update the form value with country code + mobile number
    const fullMobileNumber = `${countryCode[countryKey as keyof typeof countryCode]}${mobileNumber}`;
    setValue('mobile', fullMobileNumber);
  };

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 11) {
      setMobileNumber(value);
      // Update the form value with country code + mobile number
      const fullMobileNumber = `${countryCode[selectedCountryCode as keyof typeof countryCode]}${value}`;
      setValue('mobile', fullMobileNumber);
    }
  };

  const handleCountryDropdownBlur = () => {
    setTimeout(() => {
      setShowCountryDropdown(false);
    }, 200);
  };

  // Country code handlers for contact person mobile
  const handleContactCountryCodeSelect = (countryKey: string) => {
    setSelectedContactCountryCode(countryKey);
    setShowContactCountryDropdown(false);
    // Update the form value with country code + mobile number
    const fullMobileNumber = `${countryCode[countryKey as keyof typeof countryCode]}${contactMobileNumber}`;
    setValue('contactPersonContactNo', fullMobileNumber);
  };

  const handleContactMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 11) {
      setContactMobileNumber(value);
      // Update the form value with country code + mobile number
      const fullMobileNumber = `${countryCode[selectedContactCountryCode as keyof typeof countryCode]}${value}`;
      setValue('contactPersonContactNo', fullMobileNumber);
    }
  };

  const handleContactCountryDropdownBlur = () => {
    setTimeout(() => {
      setShowContactCountryDropdown(false);
    }, 200);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className='mt-10 grid grid-cols-1 md:grid-cols-3 md:gap-x-12'>
          <div className='grid-item mt-4 md:mt-0'>
            <label htmlFor='email' className='text-sm font-medium leading-6 text-gray-900'>
              Email Address<span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='email'
                {...register('email', { required: true })}
                id='email'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                tabIndex={-1}
                disabled
              />
            </div>
          </div>
          <div className='grid-item mt-4 md:mt-0'>
            <label htmlFor='mobile-num' className='text-sm font-medium leading-6 text-gray-900'>
              Mobile No.<span className='text-red-500'>*</span>
            </label>
            <div className='mt-2 flex'>
              {/* Country Code Dropdown */}
              <div className='relative flex-shrink-0'>
                <button
                  type='button'
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  onBlur={handleCountryDropdownBlur}
                  className='flex items-center justify-between w-20 h-9 px-3 py-1.5 text-sm text-gray-900 bg-white border border-r-0 border-gray-300 rounded-l-md focus:ring-2 focus:ring-inset focus:ring-black focus:outline-none'
                  tabIndex={1}
                >
                  <span className='text-xs'>{countryCode[selectedCountryCode as keyof typeof countryCode]}</span>
                  <DropDownArrow />
                </button>
                
                {/* Country Code Dropdown */}
                {showCountryDropdown && (
                  <div className='absolute z-20 w-28 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                    {Object.entries(countryCode).map(([countryKey, code]) => (
                      <div
                        key={countryKey}
                        className='px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm'
                        onClick={() => handleCountryCodeSelect(countryKey)}
                      >
                        <div className='flex justify-between items-center'>
                          <span className='font-medium'>{countryKey}</span>
                          <span className='text-gray-500'>{code}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Mobile Number Input */}
              <input
                type='tel'
                value={mobileNumber}
                onChange={handleMobileNumberChange}
                id='mobile-num'
                placeholder='Enter mobile number'
                maxLength={11}
                className='flex-1 rounded-r-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                tabIndex={2}
              />
            </div>
          </div>
          <div className='grid-item mt-4 md:mt-0'>
            <label htmlFor='landline-num' className='text-sm font-medium leading-6 text-gray-900'>
              Landline No.
            </label>
            <div className='mt-2'>
              <input
                type='number'
                {...register('landLineNo')}
                id='landline-num'
                className='[&::-webkit-inner-spin-button]:appearance-none rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                tabIndex={3}
              />
            </div>
          </div>
          <h6 className='md:col-span-3 text-sm font-semibold mt-6 mb-3'>Contact Person</h6>
          <div className='grid-item md:col-span-1'>
            <label htmlFor='name' className='text-sm font-medium leading-6 text-gray-900'>
              Name <span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='text'
                {...register('contactPersonName', { required: true })}
                id='name'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                tabIndex={4}
              />
            </div>
          </div>
          <div className='grid-item mt-4 md:mt-0 md:col-span-2'>
            <label htmlFor='address' className='text-sm font-medium leading-6 text-gray-900'>
              Address <span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='text'
                {...register('contactPersonAddress', { required: true })}
                id='address'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                tabIndex={5}
              />
            </div>
          </div>
          <div className='grid-item mt-4'>
            <label htmlFor='age' className='text-sm font-medium leading-6 text-gray-900'>
              Age <span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='number'
                {...register('contactPersonAge', { required: true })}
                id='age'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                tabIndex={6}
              />
            </div>
          </div>
          <div className='grid-item mt-4'>
            <label htmlFor='contact-person-mobile' className='text-sm font-medium leading-6 text-gray-900'>
              Mobile No. <span className='text-red-500'>*</span>
            </label>
            <div className='mt-2 flex'>
              {/* Country Code Dropdown */}
              <div className='relative flex-shrink-0'>
                <button
                  type='button'
                  onClick={() => setShowContactCountryDropdown(!showContactCountryDropdown)}
                  onBlur={handleContactCountryDropdownBlur}
                  className='flex items-center justify-between w-20 h-9 px-3 py-1.5 text-sm text-gray-900 bg-white border border-r-0 border-gray-300 rounded-l-md focus:ring-2 focus:ring-inset focus:ring-black focus:outline-none'
                  tabIndex={7}
                >
                  <span className='text-xs'>{countryCode[selectedContactCountryCode as keyof typeof countryCode]}</span>
                  <DropDownArrow />
                </button>
                
                {/* Country Code Dropdown */}
                {showContactCountryDropdown && (
                  <div className='absolute z-20 w-28 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                    {Object.entries(countryCode).map(([countryKey, code]) => (
                      <div
                        key={countryKey}
                        className='px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm'
                        onClick={() => handleContactCountryCodeSelect(countryKey)}
                      >
                        <div className='flex justify-between items-center'>
                          <span className='font-medium'>{countryKey}</span>
                          <span className='text-gray-500'>{code}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Mobile Number Input */}
              <input
                type='tel'
                value={contactMobileNumber}
                onChange={handleContactMobileNumberChange}
                id='contact-person-mobile'
                placeholder='Enter mobile number'
                maxLength={11}
                className='flex-1 rounded-r-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                tabIndex={8}
              />
            </div>
          </div>
          <div className='grid-item mt-4'>
            <label htmlFor='relationship' className='text-sm font-medium leading-6 text-gray-900'>
              Relationship <span className='text-red-500'>*</span>
            </label>
            <div className='mt-2'>
              <input
                type='text'
                {...register('contactPersonRelationship', { required: true })}
                id='relationship'
                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                tabIndex={9}
              />
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <button
            type='submit'
            className='mt-10 md:mt-12 w-full md:w-auto text-center float-right mb-7 rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            {isLoading ? (
              <div
                className='animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2'
                role='status'
                aria-label='loading'
              >
                <span className='sr-only'>Loading...</span>
              </div>
            ) : (
              'SAVE'
            )}
          </button>
        </div>
      </form>
    </>
  );
}

export default ContactsTab;
