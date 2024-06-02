'use client';

import { useState } from 'react';

import GearIcon from '@/svg/GearIcon';
import classNames from '@/helpers/classNames';
import DropdownIcon from '@/svg/DropdownIcon';
import SliderIcon from '@/svg/SliderIcon';

function ViewModeTab({
  setIsPreview,
  setValue,
  getValues,
  onSubmit,
  setSelectedTab,
  isLoading,
}: {
  setIsPreview: any;
  setValue: any;
  getValues: any;
  onSubmit: any;
  setSelectedTab: any;
  isLoading: boolean;
}) {
  const [viewStyle, setViewStyle] = useState(getValues('criteria_rating_view_type'));

  const handleClickViewStyle = (value: any) => {
    if (value === 'default' || value === 'dropdown' || value === 'slider') {
      setViewStyle(value);
      setValue('criteria_rating_view_type', value);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-6'>
        <div className='px-2 md:px-8 lg:px-4'>
          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8 space-y-6'>
                <label className='font-semibold text-xl'>How do you want your sheet/form to look like?</label>
                <div className='justify-center'>
                  <div className='flex justify-end pr-4'>
                    <button
                      onClick={() => setIsPreview(true)}
                      className='bg-[#f3f4f6] border border-[#65C979] rounded-md py-2 px-8 text-[#65C979] text-sm font-semibold hover:shadow-md focus:shadow-none focus:opacity-80'
                    >
                      Preview
                    </button>
                  </div>
                </div>
                <div className='flex mt-2 w-full border rounded-xl border-[#ACB9CB] py-10 px-4 justify-center space-x-20'>
                  <div
                    onClick={() => handleClickViewStyle('default')}
                    className={classNames(
                      'flex flex-col items-center border rounded-xl space-y-2 py-6 px-7 shadow-md hover:cursor-pointer',
                      viewStyle === 'default' ? 'border-blue-600' : 'border-[#ACB9CB]'
                    )}
                  >
                    <GearIcon fill={viewStyle === 'default' ? '#355FD0' : '#ACB9CB'} />
                    <label className='text-sm'>Default</label>
                  </div>
                  <div
                    onClick={() => handleClickViewStyle('dropdown')}
                    className={classNames(
                      'flex flex-col items-center border rounded-xl space-y-2 py-6 px-4 shadow-md hover:cursor-pointer',
                      viewStyle === 'dropdown' ? 'border-blue-600' : 'border-[#ACB9CB]'
                    )}
                  >
                    <DropdownIcon fill={viewStyle === 'dropdown' ? '#355FD0' : '#ACB9CB'} />
                    <label className='text-sm'>Dropdown</label>
                  </div>
                  <div
                    onClick={() => handleClickViewStyle('slider')}
                    className={classNames(
                      'flex flex-col items-center border rounded-xl space-y-2 py-6 px-8 shadow-md hover:cursor-pointer',
                      viewStyle === 'slider' ? 'border-blue-600' : 'border-[#ACB9CB]'
                    )}
                  >
                    <SliderIcon fill={viewStyle === 'slider' ? '#355FD0' : '#ACB9CB'} />
                    <label className='text-sm'>Slider</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className='flex justify-between py-4 px-4'>
        <button
          type='button'
          className='w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          onClick={() => setSelectedTab(3)}
        >
          Back
        </button>
        <button
          type='submit'
          className='w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          disabled={isLoading}
        >
          {isLoading && (
            <div role='status'>
              <svg
                aria-hidden='true'
                className='inline w-6 h-6 mr-2 text-gray-200 animate-spin fill-blue-600'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
              <span className='sr-only'>Loading...</span>
            </div>
          )}
          {!isLoading && 'Save'}
        </button>
      </div>
    </form>
  );
}

export default ViewModeTab;
