'use client';

import { useState } from 'react';

import AskProfModal from '../modals/AskProfModal';

function ContactsTab({
  register,
  setValue,
  handleSubmit,
  setCurrentTab,
}: {
  register: any;
  setValue: any;
  handleSubmit: any;
  setCurrentTab: any;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleNext = (event: React.FormEvent) => {
  //   event.preventDefault();
  // };

  // const handleAgree = () => {
  //   setCurrentTab(3);
  // };

  // const handleDecline = () => {
  //   onSubmit();
  //   setIsModalOpen(false);
  // };

  const onSubmit = handleSubmit((data: any) => {
    setCurrentTab(3);
  });

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
            <div className='mt-2'>
              <input
                type='number'
                {...register('mobile', { required: true })}
                id='mobile-num'
                className='[&::-webkit-inner-spin-button]:appearance-none rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                tabIndex={1}
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
                tabIndex={2}
              />
            </div>
          </div>
          <h6 className="md:col-span-3 text-sm font-semibold mt-6 mb-3">
            Contact Person
          </h6>
          <div className="grid-item md:col-span-1">
            <label
              htmlFor="name"
              className="text-sm font-medium leading-6 text-gray-900"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="text"
                {...register("contactPersonName", { required: true })}
                id="name"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                tabIndex={3}
              />
            </div>
          </div>
          <div className="grid-item mt-4 md:mt-0 md:col-span-2">
            <label
              htmlFor="address"
              className="text-sm font-medium leading-6 text-gray-900"
            >
              Address <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="text"
                {...register("contactPersonAddress", { required: true })}
                id="address"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                tabIndex={4}
              />
            </div>
          </div>
          <div className="grid-item mt-4">
            <label
              htmlFor="age"
              className="text-sm font-medium leading-6 text-gray-900"
            >
              Age <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="number"
                {...register("contactPersonAge", { required: true })}
                id="age"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                tabIndex={5}
              />
            </div>
          </div>
          <div className="grid-item mt-4">
            <label
              htmlFor="contact-person-mobile"
              className="text-sm font-medium leading-6 text-gray-900"
            >
              Mobile No. <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="number"
                {...register("contactPersonContactNo", { required: true })}
                id="contact-person-mobile"
                className="[&::-webkit-inner-spin-button]:appearance-none rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                tabIndex={6}
              />
            </div>
          </div>
          <div className="grid-item mt-4">
            <label
              htmlFor="relationship"
              className="text-sm font-medium leading-6 text-gray-900"
            >
              Relationship <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="text"
                {...register("contactPersonRelationship", { required: true })}
                id="relationship"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                tabIndex={7}
              />
            </div>
          </div>
        </div>
        <div className='flex justify-between py-10'>
          <button
            type='button'
            className='w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            onClick={() => setCurrentTab(1)}
            tabIndex={-1}
          >
            Back
          </button>
          <button
            type='submit'
            className='w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            tabIndex={8}
          >
            Next
          </button>
        </div>
      </form>
      {/* <AskProfModal
        open={isModalOpen}
        onAgree={handleAgree}
        onDecline={handleDecline}
        onClose={() => setIsModalOpen(false)}
      />{' '} */}
      {/* Modal component */}
    </>
  );
}

export default ContactsTab;
