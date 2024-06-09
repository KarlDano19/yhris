'use client';

import { use, useEffect, useState } from 'react';

import Link from 'next/link';

import getEmailTemplate from '@/components/pages/(auth)/employer/settings/general-settings/email-template/hooks/useGetEmailTemplate';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import CreateEmailTemplateModal from './modal/CreateEmailTemplate';
import SuccessModal from './modal/SuccessModal';
import { set } from 'react-hook-form';

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [itemsFilter, setItemsFilter] = useState({
    search: '',
  });
  const [emailTemplatesItems, setEmailTemplatesItems] = useState<any>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const {
    data: dataEmailTemplate,
    isLoading: isGetEmailTemplateLoading,
    refetch: refetchEmailTemplate,
  } = getEmailTemplate(itemsFilter);

  const handleCreateTemplateSuccess = () => {
    setIsSuccessModalOpen(true);
  };

  useEffect(() => {
    refetchEmailTemplate();
  }, []);

  useEffect(() => {
    if (dataEmailTemplate && !isGetEmailTemplateLoading) {
      setEmailTemplatesItems(dataEmailTemplate);
    }
  }, [dataEmailTemplate]);

  const renderRows = () => {
    if (isGetEmailTemplateLoading) {
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
    if (emailTemplatesItems && emailTemplatesItems.length > 0) {
      return emailTemplatesItems.map((item: any) => (
        <tr key={item.id}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.subject}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.to}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.cc}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.bcc}</td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={7}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>{`There's no data yet.`}</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>Please click create to add Email Template.</h4>
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
            <h4>General Settings</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Email Template</h2>
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
                disabled={!hasActiveSubscription}
              >
                CREATE
              </button>
            </div>
          </div>
          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-300 text-center'>
                  <thead>
                    <tr>
                      <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
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
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
                </table>
                <hr />
                <p className='text-xs text-gray-500 mt-2'>Total record/s: {emailTemplatesItems?.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateEmailTemplateModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        refetch={refetchEmailTemplate}
        onSuccess={handleCreateTemplateSuccess}
      />
      <SuccessModal isOpen={isSuccessModalOpen} setIsOpen={setIsSuccessModalOpen} />
    </>
  );
};

export default Content;
