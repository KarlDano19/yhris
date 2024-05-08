'use client';
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import Link from 'next/link';
import SelectChevronDown from '@/svg/SelectChevronDown';
import MinusIcon from '@/svg/MinusIcon';
import PlusIcon from '@/svg/PlusIcon';
import useGetBenefitItems from '@/components/pages/(auth)/employer/manage/design-benefits/hooks/useGetBenefitItems';

const FormCreation = () => {
  const [totalClientGoal, setTotalClientGoal] = React.useState(0);

  const handleMinusClick = () => {
    if (totalClientGoal > 0) {
      setTotalClientGoal(totalClientGoal - 1);
    }
  };

  const handlePlusClick = () => {
    setTotalClientGoal(totalClientGoal + 1);
  };


  return (
    <>
      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link
            href='/train'
            className='flex-none flex gap-3 items-center hover:bg-gray-200'
          >
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Train</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8 space-y-6'>
                <div className='sm:col-span-4 mt-2 w-full border-2 border-red-50 py-6 px-4'>
                    <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
                        Description<span className='text-red-600'>*</span>
                    </label>
                        <input
                        id='position'
                        type='text'
                        className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 border-b-2 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                    />
                </div>
                <div className='sm:col-span-4 mt-2 w-full border-2 border-red-50 py-6 px-4'>
                    <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
                        Scoring/Rating<span className='text-red-600'>*</span>
                    </label>
                    <div className='relative mt-2'>
                        <select
                        id='reason'
                        className='appearance-none block w-full py-2 pl-3 text-gray-900 border-b-2 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                        >
                        <option value=''>Select...</option>
                        <option value='individual'>Individual</option>
                        <option value='team'>Team</option>
                        <option value='manager'>Manager</option>
                        <option value='custom'>Custom</option>
                        </select>
                        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                            <SelectChevronDown />
                        </div>
                    </div>
                </div>
                <div className='flex flex-row space-x-6'>
                    <div className='sm:col-span-4 mt-2 w-full border-2 border-red-50 py-6 px-4'>
                        <div className="flex flex-col px-5">
                            <label className="text-slate-700 mt-2 text-sm">How much is the total score?</label>
                            <div className="flex gap-4 items-center mt-4 text-center whitespace-nowrap text-slate-500">
                                <div className='hover:cursor-pointer' onClick={handleMinusClick}>
                                    <MinusIcon />
                                </div>
                                <div className="justify-center items-start self-stretch px-11 py-1 bg-white rounded-md border border-solid border-slate-400 max-md:px-5">
                                    {totalClientGoal}
                                </div>
                                <div className='hover:cursor-pointer' onClick={handlePlusClick}>
                                    <PlusIcon />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='sm:col-span-4 mt-2 w-full border-2 border-red-50 py-6 px-4'>
                        <div className="flex flex-col px-5">
                            <label className="text-slate-700 mt-2 text-sm">How much is the Passing score?</label>
                            <div className="flex gap-4 items-center mt-4 text-center whitespace-nowrap text-slate-500">
                                <div className='hover:cursor-pointer' onClick={handleMinusClick}>
                                    <MinusIcon />
                                </div>
                                <div className="justify-center items-start self-stretch px-11 py-1 bg-white rounded-md border border-solid border-slate-400 max-md:px-5">
                                    {totalClientGoal}
                                </div>
                                <div className='hover:cursor-pointer' onClick={handlePlusClick}>
                                    <PlusIcon />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row space-x-6'>
                    <div className='sm:col-span-4 mt-2 w-full border-2 border-red-50 py-6 px-4'>
                        <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
                            Evaluation Type<span className='text-red-600'>*</span>
                        </label>
                        
                    </div>
                    <div className='sm:col-span-4 mt-2 w-full border-2 border-red-50 py-6 px-4'>
                        <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
                            Evaluation Type<span className='text-red-600'>*</span>
                        </label>
                        
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormCreation;
