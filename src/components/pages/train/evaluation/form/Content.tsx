'use client';
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState, useRef } from 'react';
import CustomDatePicker from '@/components/CustomDatePicker';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import Link from 'next/link';
import useGetBenefitItems from '@/components/pages/manage/design-benefits/hooks/useGetBenefitItems';
import SelectChevronDown from '@/svg/SelectChevronDown';
import MinusIcon from '@/svg/MinusIcon';
import PlusIcon from '@/svg/PlusIcon';

const Content = () => {
  const [designBenefitsItems, setDesignBenefitsItems] = useState<any>([]);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false)
  const [itemsFilter, setItemsFilter] = useState({
    from: '',
    to: '',
    search: '',
  });
  const {
    data: dataBenefits,
    isLoading: isGetBenefitsLoading,
    refetch,
  } = useGetBenefitItems(itemsFilter);
  const [totalClientGoal, setTotalClientGoal] = React.useState(0);

  const handleMinusClick = () => {
    if (totalClientGoal > 0) {
      setTotalClientGoal(totalClientGoal - 1);
    }
  };

  const handlePlusClick = () => {
    setTotalClientGoal(totalClientGoal + 1);
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (dataBenefits) {
      dataBenefits.benefits.map((benefit: any) => {
        benefit.date = Intl.DateTimeFormat('en-US').format(
          new Date(benefit.date)
        );
        return benefit;
      });
      setDesignBenefitsItems(dataBenefits.benefits);
    }
  }, [dataBenefits]);

  const renderRows = () => {
    if (isGetBenefitsLoading) {
      return (
        <tr>
          <td colSpan={100}>
            <div role='status' className='py-5 text-center'>
              <svg
                aria-hidden='true'
                className='inline w-12 h-12 mr-2 text-gray-200 animate-spin fill-yellow-400'
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
          </td>
        </tr>
      );
    }
    if (designBenefitsItems && designBenefitsItems.length > 0) {
      return designBenefitsItems.map((item: any) => (
        <tr key={item.id}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            {item.date}
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            {item.title}
          </td>
          <td className='px-3 py-5 text-sm text-gray-500 text-ellipsis'>
            {item.purpose}
          </td>
        </tr>
      ));
    } else {
      return (
        <>
            <tr>
                <td colSpan={7}>
                    <h4 className='text-center text-gray-300 text-sm mt-4'>
                    There{`'`}s no data yet.
                    </h4>
                    <h4 className='text-center text-gray-300 text-sm mb-4'>
                    Please click create to add incident report.
                    </h4>
                    <div className='text-center mb-4'>
                        <button
                            className='bg-[#f3f4f6] border border-[#65C979] rounded-md py-2 px-8 text-[#65C979] text-sm font-semibold hover:shadow-md focus:shadow-none focus:opacity-80'
                            onClick={() => setIsSelectionModalOpen(true)}
                        >
                            CREATE
                        </button>
                    </div>
                </td>
            </tr>
        </>
      );
    }
  };

  const checkIfDateIsValid = () => {
    const dateFrom = Date.parse(itemsFilter.from);
    const dateTo = Date.parse(itemsFilter.to);

    if (dateFrom && !dateTo) {
      return toast.custom(
        () => <CustomToast message='Invalid date to.' type='error' />,
        {
          duration: 5000,
        }
      );
    }
    if (!dateFrom && dateTo) {
      return toast.custom(
        () => <CustomToast message='Invalid date from.' type='error' />,
        {
          duration: 5000,
        }
      );
    }
    if (dateFrom > dateTo) {
      return toast.custom(
        () => (
          <CustomToast
            message='You have entered an invalid date range. Please select again.'
            type='error'
          />
        ),
        {
          duration: 5000,
        }
      );
    }
    refetch();
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

export default Content;
