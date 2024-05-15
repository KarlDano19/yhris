'use client';

import { useEffect, useState, useRef } from 'react';

import Link from 'next/link';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import EmailTemplateModal from './modal/CreateEmailTemplate';
import SuccessModal from './modal/SuccessModal';

const Content = () => {
  const [itemsFilter, setItemsFilter] = useState({
    search: '',
  });
  const [vouchersItems, setVouchersItems] = useState<any>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(true);

  const renderRows = () => {
    if (vouchersItems && vouchersItems.length > 0) {
      return vouchersItems.map((item: any) => (
        <tr key={item.id}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.code}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='flex gap-2 text-center'>
              <span>{item.plan}</span>
            </div>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.discount}%</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
            {item.employees_slot_from} - {item.employees_slot_to}
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>{item.maximum_redemption}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
            <span className='cursor-pointer text-blue-600 underline'>
              {item.redeem_count}
            </span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            {item.redemption_date_from} - {item.redemption_date_to}
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
            <div className='flex space-x-2'>
              <button>
                <EditIcon />
              </button>
              <button>
                <DeleteIcon />
              </button>
            </div>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={7}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>{`There's no data yet.`}</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>Please click create to add vouchers.</h4>

            <div className='flex-1 flex justify-center mb-4'>
              <button
                className='bg-white border-2 border-green-500 rounded-md py-2 px-8 text-green-500 text-sm font-semibold hover:shadow-md focus:shadow-none focus:opacity-80 disabled:opacity-50'
                onClick={() => setIsCreateModalOpen(true)}
              >
                CREATE
              </button>
            </div>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/settings/general-settings' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4> Settings | General Settings | Email Template</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <div className='mt-6 flex flex-col lg:flex-row items-center gap-4'>
            <div className='flex-none lg:w-1/3'>
              <div className='relative flex items-center'>
                <input
                  type='text'
                  name='search'
                  id='search'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  onChange={(e) => setItemsFilter({ ...itemsFilter, search: e.target.value })}
                  placeholder='Search...'
                />
              </div>
            </div>
            <button
              className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
            //   onClick={() => refetchVouchers()}
            >
              <MagnifyingGlassIcon className='h-5 w-5' />
            </button>
            <div className='flex-1 flex justify-end'>
              <button
                className='bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none focus:opacity-80 disabled:opacity-50'
                onClick={() => setIsCreateModalOpen(true)}
              >
                CREATE
              </button>
            </div>
          </div>
          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-300'>
                  <thead>
                    <tr>
                      <th scope='col' className='py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-0'>
                        Subject
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                        To
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                        Cc
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                        Bcc
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
                </table>
                <hr />
                <p className='text-xs text-gray-500 mt-2'>Total record/s: {vouchersItems?.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EmailTemplateModal isOpen={isCreateModalOpen} setIsOpen={setIsCreateModalOpen}/>
      <SuccessModal isOpen={isSuccessModalOpen} setIsOpen={setIsSuccessModalOpen}/>
    </>
  );
};

export default Content;
