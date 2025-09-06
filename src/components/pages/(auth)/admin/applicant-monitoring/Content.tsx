'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import useApplicantItems from './hooks/useGetApplicantItems';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import MoreIcon from '@/svg/MoreIcon';

const Content = () => {
  const [clientItems, setClientItems] = useState<any>([]);
  const [itemsFilter, setItemsFilter] = useState<any>({
    search: '',
  });
  const [isApplicantGoalModalOpen, setIsApplicantGoalModalOpen] = useState(false);
  const { data: dataApplicant, isLoading: isGetApplicantLoading, refetch } = useApplicantItems(itemsFilter);

  useEffect(() => {
    if (dataApplicant && !isGetApplicantLoading) {
      dataApplicant.map((item: any) => {
        item['created_at'] = Intl.DateTimeFormat('en-US').format(new Date(item.created_at));
      });
      setClientItems(dataApplicant);
    }
  }, [dataApplicant]);

  const renderRows = () => {
    if (isGetApplicantLoading) {
      return (
        <tr>
          <td colSpan={100}>
            <div className='py-5'>
              <LoadingSpinner size="lg" color="yellow" />
            </div>
          </td>
        </tr>
      );
    }
    if (clientItems && clientItems.length > 0) {
      return clientItems.map((item: any) => (
        <tr key={item.id}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.name}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.email}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.mobile}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.created_at}</td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={5}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>{`There's no data yet.`}</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>
              Please click create to add separation of employee.
            </h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/admin/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Dashboard</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <div className='mt-6 flex gap-16 space-x-20'>
            <div className='flex-none lg:w-1/2 space-y-14'>
              <h2 className='text-xl font-bold text-indigo-dye'>Applicant Monitoring</h2>
              <div className='relative flex items-center'>
                <input
                  type='text'
                  name='search'
                  id='search'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  onChange={(e) => setItemsFilter({ ...itemsFilter, search: e.target.value })}
                  placeholder='Search ...'
                />
                <button
                  className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
                  onClick={() => refetch()}
                >
                  <MagnifyingGlassIcon className='h-5 w-5' />
                </button>
                <div className='flex-1 flex justify-end ml-4'>
                  <button
                    className='bg-slate-500 w-max rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none focus:opacity-80 disabled:opacity-50'
                    // onClick={() => setIsClientGoalModalOpen(true)} // Disabled for now to now open the client analytics dialog box
                    disabled={true}
                  >
                    Applicant Analytics
                  </button>
                </div>
              </div>
            </div>
            <div className='flex-none lg:w-1/2'>
              <div className='flex justify-between gap-3 px-5 py-5 font-semibold whitespace-nowrap rounded-xl border border-solid border-slate-400 max-w-[318px]'>
                <div className='flex flex-col my-auto text-base tracking-wide text-slate-700'>
                  <div>TOTAL</div>
                  <div className='mt-3.5'>applicant</div>
                </div>
                <div className='justify-center items-center px-16 py-6 text-3xl tracking-wide text-center text-blue-700 bg-indigo-50 rounded-md border border-violet-200 border-solid'>
                  {clientItems.length}
                </div>
                <MoreIcon />
              </div>
            </div>
          </div>
          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-300 text-center'>
                  <thead>
                    <tr>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Applicant
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Email
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Contact
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Registration Date
                      </th>
                      {/* <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Actions
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
                </table>
                <hr />
                <p className='text-xs text-gray-500 mt-2'>Total record/s: {clientItems.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <ClientGoalModal isOpen={isClientGoalModalOpen} setIsOpen={setIsClientGoalModalOpen} /> */}
    </>
  );
};

export default Content;
