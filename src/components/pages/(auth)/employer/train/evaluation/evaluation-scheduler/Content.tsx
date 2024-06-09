'use client';

import React, { useEffect, useState, useRef } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import toast from 'react-hot-toast';

import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import classNames from '@/helpers/classNames';
import CreateEvaluationSchedulerModal from './modals/CreateEvaluationSchedulerModal';
import DeleteEvaluationSchedulerModal from './modals/DeleteEvaluationSchedulerModal';
import EditEvaluationSchedulerModal from './modals/EditEvaluationSchedulerModal';
import ConfirmSendEmailEvaluationSchedulerModal from './modals/ConfirmSendEmailEvaluationSchedulerModal';
import useGetEvaluationSchedulerItems from './hooks/useGetEvaluationSchedulerItems';
import useGetEvaluationSchedulerDetails from './hooks/useGetEvaluationSchedulerDetails';
import useSendEmailEvaluationScheduler from './hooks/useSendEmailEvaluationScheduler';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';

function Content({ hasActiveSubscription }: { hasActiveSubscription: boolean }) {
  const [evaluationSchedulerItems, setEvaluationSchedulerItems] = useState<any>([]);
  const [actionType, setActionType] = useState<string>('');
  const [selectedEvaluationSchedulerId, setSelectedEvaluationSchedulerId] = useState<number | null>(null);
  const [isEditEvaluationSchedulerModalOpen, setIsEditEvaluationSchedulerModalOpen] = useState(false);
  const [isDeleteEvaluationSchedulerModalOpen, setIsDeleteEvaluationSchedulerModalOpen] = useState(false);
  const [isConfirmSendEmailEvaluationSchedulerModalOpen, setIsConfirmSendEmailEvaluationSchedulerModalOpen] =
    useState(false);
  const [isCreateEvaluationSchedulerOpen, setIsCreateEvaluationSchedulerOpen] = useState(false);
  const [itemsFilter, setItemsFilter] = useState({
    from: '',
    to: '',
    search: '',
  });
  const {
    data: dataEvaluationScheduler,
    isLoading: isGetEvaluationSchedulerLoading,
    refetch: refetchEvaluationScheduler,
  } = useGetEvaluationSchedulerItems(itemsFilter);
  const {
    data: dataEvaluationSchedulerDetails,
    isLoading: isGetEvaluationSchedulerDetailsLoading,
    refetch: refetchEvaluationSchedulerDetails,
  } = useGetEvaluationSchedulerDetails(selectedEvaluationSchedulerId);
  const { mutate, isLoading } = useSendEmailEvaluationScheduler();

  useEffect(() => {
    refetchEvaluationScheduler();
  }, []);

  useEffect(() => {
    if (dataEvaluationScheduler) {
      setEvaluationSchedulerItems(dataEvaluationScheduler);
    }
  }, [dataEvaluationScheduler]);

  useEffect(() => {
    if (selectedEvaluationSchedulerId) {
      refetchEvaluationSchedulerDetails();
      if (
        dataEvaluationSchedulerDetails &&
        Object.keys(dataEvaluationSchedulerDetails).length &&
        !isGetEvaluationSchedulerDetailsLoading
      ) {
        if (actionType === 'edit') {
          setIsEditEvaluationSchedulerModalOpen(true);
        }
        if (actionType === 'delete') {
          setIsDeleteEvaluationSchedulerModalOpen(true);
        }
        if (actionType === 'send-email') {
          setIsConfirmSendEmailEvaluationSchedulerModalOpen(true);
        }
      }
    }
  }, [selectedEvaluationSchedulerId, dataEvaluationSchedulerDetails]);

  const openEditEvaluationModal = (evaluationDetails: any) => {
    setActionType('edit');
    if (selectedEvaluationSchedulerId && selectedEvaluationSchedulerId === evaluationDetails.id) {
      setIsEditEvaluationSchedulerModalOpen(true);
    } else {
      setSelectedEvaluationSchedulerId(evaluationDetails.id);
    }
  };

  const openDeleteEvaluationModal = (evaluationDetails: any) => {
    setActionType('delete');
    if (selectedEvaluationSchedulerId && selectedEvaluationSchedulerId === evaluationDetails.id) {
      setIsDeleteEvaluationSchedulerModalOpen(true);
    } else {
      setSelectedEvaluationSchedulerId(evaluationDetails.id);
    }
  };

  const openConfirmSendEmailEvaluationSchedulerModal = (evaluationDetails: any) => {
    setActionType('send-email');
    if (selectedEvaluationSchedulerId && selectedEvaluationSchedulerId === evaluationDetails.id) {
      setIsConfirmSendEmailEvaluationSchedulerModalOpen(true);
    } else {
      setSelectedEvaluationSchedulerId(evaluationDetails.id);
    }
  };

  const renderReceipientsRoundPhoto = (recipients: any) => {
    return (
      <div className='flex items-center justify-center'>
        {(recipients || []).map((recipient: any, index: number) => {
          return (
            <Image
              key={index}
              src={recipient}
              width={40}
              height={40}
              alt='round-photo'
              className={classNames(
                'max-w-[40px] max-h-[40px] border-2 border-[#fff] rounded-full',
                index === 0 ? 'z-0' : `relative -left-[${(25 * index).toString()}px] z-${index}0`
              )}
            />
          );
        })}
      </div>
    );
  };

  const renderRows = () => {
    if (isGetEvaluationSchedulerLoading) {
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
    if (evaluationSchedulerItems && evaluationSchedulerItems?.length > 0) {
      return evaluationSchedulerItems?.map((item: any) => (
        <tr key={item.id}>
          <td className='whitespace-nowrap text-ellipsis px-3 py-5 text-sm text-gray-500'>{item.name}</td>
          <td className='whitespace-nowrap text-ellipsis px-3 py-5 text-sm text-gray-500'>
            {item.evaluation_template}
          </td>
          <td className='whitespace-nowrap text-ellipsis px-3 py-5 text-sm text-gray-500'>{item.evaluation_period}</td>
          <td className='whitespace-nowrap text-ellipsis px-3 py-5 text-sm text-gray-500'>
            {item.evaluation_schedule}
          </td>
          <td className='whitespace-nowrap text-ellipsis px-3 py-5 text-sm text-gray-500'>
            {renderReceipientsRoundPhoto(item.recipients)}
          </td>
          <td className='whitespace-nowrap text-ellipsis px-3 py-5 text-sm text-gray-500'>
            <div className='flex justify-center space-x-2'>
              <button
                className='border rounded px-[0.65em] border-[#3d6cee9f]'
                onClick={() => openConfirmSendEmailEvaluationSchedulerModal(item)}
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
                {!isLoading && (
                  <Image
                    src='/assets/send-icon.png'
                    width={20}
                    height={20}
                    alt='send-icon'
                    className='max-w-[20px] max-h-[20px]'
                  />
                )}
              </button>
              <button onClick={() => openEditEvaluationModal(item)}>
                <EditIcon />
              </button>
              <button onClick={() => openDeleteEvaluationModal(item)}>
                <DeleteIcon />
              </button>
            </div>
          </td>
        </tr>
      ));
    } else {
      return (
        <>
          <tr>
            <td colSpan={7}>
              <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
              <h4 className='text-center text-gray-300 text-sm mb-4'>
                Please click create to add evaluation template.
              </h4>
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
      return toast.custom(() => <CustomToast message='Invalid date to.' type='error' />, {
        duration: 5000,
      });
    }
    if (!dateFrom && dateTo) {
      return toast.custom(() => <CustomToast message='Invalid date from.' type='error' />, {
        duration: 5000,
      });
    }
    if (dateFrom > dateTo) {
      return toast.custom(
        () => <CustomToast message='You have entered an invalid date range. Please select again.' type='error' />,
        {
          duration: 5000,
        }
      );
    }
    refetchEvaluationScheduler();
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/train' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Train</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Evaluation Scheduler</h2>
          <div className='mt-6 flex flex-col lg:flex-row items-center gap-4'>
            <div className='flex-none flex flex-col lg:flex-row items-center gap-2'>
              <div className='relative'>
                <CustomDatePicker
                  name={'from'}
                  selected={itemsFilter.from}
                  pickerOnChange={setItemsFilter}
                  className={
                    'appearance-none block w-44 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
                  objectFilter={itemsFilter}
                  inputOnChange={setItemsFilter}
                  placeholder={'mm/dd/yyyy'}
                />
              </div>
              <p>to</p>
              <div className='relative'>
                <CustomDatePicker
                  name={'to'}
                  selected={itemsFilter.to}
                  pickerOnChange={setItemsFilter}
                  className={
                    'appearance-none block w-44 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
                  objectFilter={itemsFilter}
                  inputOnChange={setItemsFilter}
                  placeholder={'mm/dd/yyyy'}
                />
              </div>
            </div>
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
                <div className='absolute inset-y-0 right-0 flex py-2 pr-2'>
                  <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
                </div>
              </div>
            </div>
            <button
              className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
              onClick={checkIfDateIsValid}
            >
              <MagnifyingGlassIcon className='h-5 w-5' />
            </button>
            <div className='flex-1 flex justify-end'>
              <button
                className='bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none focus:opacity-80 disabled:opacity-50'
                onClick={() => setIsCreateEvaluationSchedulerOpen(true)}
                disabled={!hasActiveSubscription}
              >
                CREATE
              </button>
            </div>
          </div>
          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                <table className='min-w-full text-center divide-y divide-gray-300'>
                  <thead>
                    <tr>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Schedule Name
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Evaluation Template
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Evaluation Period
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Evaluation Schedule
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Receipients
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
                </table>
                <hr />
                <p className='text-xs text-gray-500 mt-2'>Total record/s: {evaluationSchedulerItems.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateEvaluationSchedulerModal
        refetch={refetchEvaluationScheduler}
        isOpen={isCreateEvaluationSchedulerOpen}
        setIsOpen={setIsCreateEvaluationSchedulerOpen}
      />
      <EditEvaluationSchedulerModal
        refetch={refetchEvaluationScheduler}
        isOpen={isEditEvaluationSchedulerModalOpen}
        setIsOpen={setIsEditEvaluationSchedulerModalOpen}
        evaluationSchedulerDetails={dataEvaluationSchedulerDetails}
      />
      <DeleteEvaluationSchedulerModal
        refetch={refetchEvaluationScheduler}
        isOpen={isDeleteEvaluationSchedulerModalOpen}
        setIsOpen={setIsDeleteEvaluationSchedulerModalOpen}
        evaluationDetails={dataEvaluationSchedulerDetails}
      />
      <ConfirmSendEmailEvaluationSchedulerModal
        refetch={refetchEvaluationScheduler}
        isOpen={isConfirmSendEmailEvaluationSchedulerModalOpen}
        setIsOpen={setIsConfirmSendEmailEvaluationSchedulerModalOpen}
        evaluationDetails={dataEvaluationSchedulerDetails}
      />
    </>
  );
}

export default Content;
