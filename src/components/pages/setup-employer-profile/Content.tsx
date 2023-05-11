'use client';
import React, { useEffect, useState } from 'react';
import Details from './Details';
import Settings from './Settings';

const Content = () => {
  const [isDetails, setIsDetails] = useState(true);
  const [progressBar, setProgressBar] = useState(0);
  const [form, setForm] = useState({});
  return (
    <>
      <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h1>Tell us more about you!</h1>
        <div className='px-5 sm:px-7 lg:px-9'>
          <div className='relative my-10'>
            <div className='absolute w-11/12 bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700 my-0 mx-auto inset-x-0'>
              <div
                className='transition-all ease-out duration-500 bg-green-600 h-1.5 rounded-full dark:bg-green-500'
                style={{ width: `${progressBar}%` }}
              ></div>
            </div>
            <div className='flex justify-between'>
              <div>Employeer Details</div>
              <div>Account Settings</div>
            </div>
          </div>
          {isDetails && (
            <Details
              form={form}
              setIsDetails={setIsDetails}
              setProgressBar={setProgressBar}
              setForm={setForm}
            />
          )}
          {!isDetails && (
            <Settings
              form={form}
              setIsDetails={setIsDetails}
              setProgressBar={setProgressBar}
              setForm={setForm}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Content;
