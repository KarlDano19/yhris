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
          <div className='mt-5'>
            <div className='sm:hidden'>
              <h5 className='text-savoy-blue text-center text-lg font-semibold'>
                {progressBar === 2 ? 'Account Settings' : 'Employeer Details'}
              </h5>
            </div>
            <div className='hidden sm:block'>
              <div className='md:w-[82%] lg:w-[84%] mx-auto translate-y-[10px]'>
                <div className='w-full bg-gray-200 rounded-full h-1'>
                  <div className={`${progressBar === 2 ? 'w-[28%]' : 'w-0'} bg-blue-600 h-1 rounded-full`}></div>
                </div>
              </div>
              <div className='border-t-4 border-gray-300 mx-24 w-auto mb-3 translate-y-[23px] hidden'></div>
              <nav className='-mb-px flex relative justify-between w-[90%] mx-auto' aria-label='Tabs'>
                <li
                  className={`text-center text-sm font-semibold list-none flex flex-col items-center text-savoy-blue`}
                >
                  <div className='bg-white px-2'>
                    <div
                      className={`h-4 w-4 bg-white border-2 mb-2 rounded-full flex justify-center items-center border-savoy-blue`}
                    >
                      <div className={`h-2 w-2 rounded-full bg-savoy-blue`}></div>
                    </div>
                  </div>
                  Employeer Details
                </li>
                <li
                  className={`
                    ${
                      progressBar >= 2 ? 'text-savoy-blue' : 'text-gray-500'
                    } text-center text-sm font-semibold list-none flex flex-col items-center`}
                >
                  <div className='bg-white px-2'>
                    <div
                      className={`${
                        progressBar >= 2 ? 'border-savoy-blue' : 'border-gray-300'
                      } h-4 w-4 bg-white border-2 mb-2 rounded-full flex justify-center items-center`}
                    >
                      <div
                        className={`${
                          progressBar >= 2 ? 'bg-savoy-blue' : 'bg-gray-300'
                        } h-2 w-2 rounded-full`}
                      ></div>
                    </div>
                  </div>
                  Account Settings
                </li>
              </nav>
            </div>
          </div>
          <Details
            form={form}
            isDetails={isDetails}
            setIsDetails={setIsDetails}
            setProgressBar={setProgressBar}
            setForm={setForm}
          />
          <Settings form={form} isDetails={isDetails} setIsDetails={setIsDetails} setProgressBar={setProgressBar} />
        </div>
      </div>
    </>
  );
};

export default Content;
