'use client';

import { useState } from 'react';

import Details from './Details';
import Settings from './Settings';

const Content = () => {
  const [isDetails, setIsDetails] = useState(true);
  const [progressBar, setProgressBar] = useState(0);
  const [form, setForm] = useState({});
  return (
    <>
      <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-8'>
        <h1>Tell us more about you!</h1>
        <div className='px-5 sm:px-7 lg:px-9'>
          <div className='relative my-10'>
            <div className='relative w-11/12 bg-gray-200 rounded-full h-1.5 mb-4 my-0 mx-auto inset-x-0'>
              <div
                className='transition-all ease-out duration-500 bg-green-600 h-1.5 rounded-full'
                style={{ width: `${progressBar}%` }}
              ></div>
            </div>
            <div className='flex justify-between'>
              <div>Employeer Details</div>
              <div>Account Settings</div>
            </div>
          </div>
          <Details
            form={form}
            isDetails={isDetails}
            setIsDetails={setIsDetails}
            setProgressBar={setProgressBar}
            setForm={setForm}
          />
          <Settings
            form={form}
            isDetails={isDetails}
            setIsDetails={setIsDetails}
            setProgressBar={setProgressBar}
          />
        </div>
      </div>
    </>
  );
};

export default Content;
