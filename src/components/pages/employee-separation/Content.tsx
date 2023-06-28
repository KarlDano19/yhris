'use client';
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState, useRef } from 'react';
import SeparationLetter from './SeparationLetter';
import {
  T_DocumentsModal,
  T_LastPayModal,
  T_LetterModal,
  T_QuitclaimModal,
} from '@/types/globals';
import SignDocuments from './SignDocuments';
import LastPay from './LastPay';
import Quitclaim from './Quitclaim';
import AddSeparationModal from './modals/AddSeparationModal';
import LetterModal from './modals/LetterModal';
import SignDocumentsModal from './modals/SignDocumentsModal';
import ConfirmModal from '../../ConfirmModal';
import toast from 'react-hot-toast';
import QuitclaimModal from './modals/QuitclaimModal';
import CustomToast from '@/components/CustomToast';
import DateCalendar from '@/svg/DateCalendar';
import useGetDepartmentItems from '@/components/hooks/useGetDepartmentItems';
import useGetEmployeeItems from '@/components/hooks/useGetEmployeeItems';
import useGetPositionItems from '@/components/hooks/useGetPositionItems';
import useGetSeparationItems from './hooks/useGetSeparationItems';
import usePatchSeparationItem from './hooks/usePatchSeparationItem';
import Link from 'next/link';

const Content = () => {
  const [separationItems, setSeparationItems] = useState<any>([]);
  const [departmentItems, setDepartmentItems] = useState<any>([]);
  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const [positionItems, setPositionItems] = useState<any>([]);
  const [itemsFilter, setItemsFilter] = useState({
    from: '',
    to: '',
    search: '',
  });
  const [isAddSeparationModalOpen, setIsAddSeparationModalOpen] =
    useState(false);
  const [isLetterModalOpen, setIsLetterModalOpen] =
    useState<T_LetterModal | null>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] =
    useState<T_DocumentsModal | null>(null);
  const [isLastPayModalOpen, setIsLastPayModalOpen] =
    useState<T_LastPayModal | null>(null);
  const [isQuitclaimModalOpen, setIsQuitclaimModalOpen] =
    useState<T_QuitclaimModal | null>(null);
  const { mutate, isLoading } = usePatchSeparationItem();
  const date1InputRef = useRef(null);
  const date2InputRef = useRef(null);
  const { data: dataSeparation, isLoading: isGetSeparationLoading } =
    useGetSeparationItems(itemsFilter);
  const { data: dataDepartment, isLoading: isGetDepartmentLoading } =
    useGetDepartmentItems();
  const { data: dataEmployee, isLoading: isGetEmployeeLoading } =
    useGetEmployeeItems();
  const { data: dataPosition, isLoading: isGetPositionLoading } =
    useGetPositionItems();

  const releaseLastPay = () => {
    if (isLastPayModalOpen && isLastPayModalOpen.id) {
      const itemIndex = separationItems.findIndex(
        (item: any) => item.id === isLastPayModalOpen.id
      );
      const separationItemsCopy = JSON.parse(JSON.stringify(separationItems));
      separationItemsCopy[itemIndex].id = isLastPayModalOpen.id;
      separationItemsCopy[itemIndex].actionType = 'sending';
      separationItemsCopy[itemIndex].emailType = 'last pay';
      separationItemsCopy[itemIndex].isLastPayReleased = true;
      separationItemsCopy[itemIndex].lastPay.to =
        separationItemsCopy[itemIndex].employee_dict.email;
      const callbackReq = {
        onSuccess: (data: any) => {
          setSeparationItems([...separationItemsCopy]);
          setIsLastPayModalOpen(null);
          toast.custom(
            () => <CustomToast message={data.message} type='success' />,
            { duration: 5000 }
          );
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, {
            duration: 7000,
          });
        },
      };
      mutate(separationItemsCopy[itemIndex], callbackReq);
    } else {
      toast.custom(
        () => <CustomToast message='Incomplete information.' type='error' />,
        { duration: 4000 }
      );
    }
  };

  const updateReleaseModal = (value: boolean) => {
    if (!value) {
      setIsLastPayModalOpen(null);
    }
  };

  const setReleased = (id: string, emailType: string) => {
    const itemIndex = separationItems.findIndex((item: any) => item.id === id);
    const separationItemsCopy = JSON.parse(JSON.stringify(separationItems));
    const currentDate = new Date();
    separationItemsCopy[itemIndex].id = id;
    separationItemsCopy[itemIndex].actionType = 'received';
    separationItemsCopy[itemIndex].emailType = emailType;
    separationItemsCopy[itemIndex].dateReceived = currentDate;
    if (emailType === 'letters') {
      separationItemsCopy[itemIndex].isLetterReceived = true;
      separationItemsCopy[itemIndex].letterReceivedDate =
        new Intl.DateTimeFormat('en-US').format(currentDate);
    }
    if (emailType === 'sign documents') {
      separationItemsCopy[itemIndex].isDocumentsReceived = true;
      separationItemsCopy[itemIndex].documentReceivedDate =
        new Intl.DateTimeFormat('en-US').format(currentDate);
    }
    if (emailType === 'quit claim') {
      separationItemsCopy[itemIndex].isQuitclaimReceived = true;
      separationItemsCopy[itemIndex].quitclaimReceivedDate =
        new Intl.DateTimeFormat('en-US').format(currentDate);
    }
    const callbackReq = {
      onSuccess: (data: any) => {
        setSeparationItems([...separationItemsCopy]);
        toast.custom(
          () => <CustomToast message={data.message} type='success' />,
          { duration: 5000 }
        );
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate(separationItemsCopy[itemIndex], callbackReq);
  };

  useEffect(() => {
    if (dataDepartment) {
      setDepartmentItems(dataDepartment.departments);
    }
    if (dataEmployee) {
      setEmployeeItems(dataEmployee.employees);
    }
    if (dataPosition) {
      setPositionItems(dataPosition.positions);
    }
    if (dataSeparation) {
      dataSeparation.separations.map((separation: any) => {
        const employee = separation.employee_dict;
        separation['separationDate'] = Intl.DateTimeFormat('en-US').format(
          new Date(separation.date_of_separation)
        );
        separation['name'] = `${employee.firstname} ${employee.lastname}`;
        separation['reasonForLeaving'] = separation.reason_of_leaving;
        separation['isLetterSent'] = separation.is_letter_sent;
        separation['isLetterReceived'] = separation.is_letter_received;
        separation['letterReceivedDate'] =
          separation.letter_received_date &&
          new Intl.DateTimeFormat('en-US').format(
            new Date(separation.letter_received_date)
          );
        separation['isDocumentsSent'] = separation.is_documents_sent;
        separation['isDocumentsReceived'] = separation.is_documents_received;
        separation['documentReceivedDate'] =
          separation.documents_received_date &&
          new Intl.DateTimeFormat('en-US').format(
            new Date(separation.documents_received_date)
          );
        separation['isLastPayReleased'] = separation.is_last_pay_released;
        separation['isQuitclaimSigned'] = separation.is_quit_claim_signed;
        separation['isQuitclaimReceived'] = separation.is_quit_claim_received;
        separation['quitclaimReceivedDate'] =
          separation.quit_claim_received_date &&
          new Intl.DateTimeFormat('en-US').format(
            new Date(separation.quit_claim_received_date)
          );
        separation['separationLetter'] = {
          date: '',
          to: '',
          message: '',
        };
        separation['acceptanceLetter'] = {
          date: '',
          to: '',
          message: '',
        };
        separation['signDocuments'] = {
          template: '',
          to: '',
          message: '',
        };
        separation['lastPay'] = {
          template: '',
          to: '',
          message: '',
        };
        separation['quitClaim'] = {
          template: '',
          to: '',
          message: '',
        };
        return separation;
      });
      setSeparationItems(dataSeparation.separations);
    }
  }, [dataSeparation, dataDepartment, dataEmployee, dataPosition]);

  const renderRows = () => {
    if (isGetSeparationLoading) {
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
    if (separationItems && separationItems.length > 0) {
      return separationItems.map((item: any) => (
        <tr key={item.id}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            {item.separationDate}
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='flex gap-2'>
              <span>{item.name}</span>
            </div>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            {item.reasonForLeaving}
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top'>
            <SeparationLetter
              id={item.id}
              isLetterSent={item.isLetterSent}
              isLetterReceived={item.isLetterReceived}
              letterReceivedDate={item.letterReceivedDate}
              setIsLetterModalOpen={setIsLetterModalOpen}
              setReleased={setReleased}
              isLoading={isLoading}
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top'>
            <SignDocuments
              id={item.id}
              isDocumentsSent={item.isDocumentsSent}
              isDocumentsReceived={item.isDocumentsReceived}
              documentReceivedDate={item.documentReceivedDate}
              setIsDocumentModalOpen={setIsDocumentModalOpen}
              setReleased={setReleased}
              isLoading={isLoading}
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top'>
            <LastPay
              id={item.id}
              isLastPayReleased={item.isLastPayReleased}
              setIsLastPayModalOpen={setIsLastPayModalOpen}
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top'>
            <Quitclaim
              id={item.id}
              isQuitclaimSigned={item.isQuitclaimSigned}
              isQuitclaimReceived={item.isQuitclaimReceived}
              quitclaimReceivedDate={item.quitclaimReceivedDate}
              setIsQuitclaimModalOpen={setIsQuitclaimModalOpen}
              setReleased={setReleased}
              isLoading={isLoading}
            />
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={7}>
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
          <Link
            href='/'
            className='flex-none flex gap-3 items-center hover:bg-gray-200'
          >
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Home</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>
            Employee Separation
          </h2>
          <div className='mt-6 flex flex-col lg:flex-row items-center gap-16'>
            <div className='flex-none flex flex-col lg:flex-row items-center gap-2'>
              <div className='relative'>
                <input
                  type='date'
                  name='to'
                  id='to'
                  className='appearance-none block w-44 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  onChange={(e) =>
                    setItemsFilter({ ...itemsFilter, from: e.target.value })
                  }
                  ref={date1InputRef}
                  // @ts-expect-error
                  onClick={() => date1InputRef.current.showPicker()}
                />
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                  <DateCalendar />
                </div>
              </div>
              <p>to</p>
              <div className='relative'>
                <input
                  type='date'
                  name='from'
                  id='from'
                  className='appearance-none block w-44 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  onChange={(e) =>
                    setItemsFilter({ ...itemsFilter, to: e.target.value })
                  }
                  ref={date2InputRef}
                  // @ts-expect-error
                  onClick={() => date2InputRef.current.showPicker()}
                />
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                  <DateCalendar />
                </div>
              </div>
            </div>
            <div className='flex-none lg:w-1/3'>
              <div className='relative flex items-center'>
                <input
                  type='text'
                  name='search'
                  id='search'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  onChange={(e) =>
                    setItemsFilter({ ...itemsFilter, search: e.target.value })
                  }
                  placeholder='Search...'
                />
                <div className='absolute inset-y-0 right-0 flex py-2 pr-2'>
                  <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
                </div>
              </div>
            </div>
            <div className='flex-1 flex justify-end'>
              <button
                className='bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none focus:opacity-80'
                onClick={() => setIsAddSeparationModalOpen(true)}
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
                      <th
                        scope='col'
                        className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0'
                      >
                        Date of Separation
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                      >
                        Name
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                      >
                        Reason of Leaving
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                      >
                        Letter of Separation
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                      >
                        Sign Documents
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                      >
                        Last Pay
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                      >
                        Quitclaim
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {renderRows()}
                  </tbody>
                </table>
                <hr />
                <p className='text-xs text-gray-500 mt-2'>
                  Total record/s: {separationItems.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddSeparationModal
        separationItems={separationItems}
        departmentItems={departmentItems}
        employeeItems={employeeItems}
        positionItems={positionItems}
        setSeparationItems={setSeparationItems}
        isOpen={isAddSeparationModalOpen}
        setIsOpen={setIsAddSeparationModalOpen}
      />
      <LetterModal
        separationItems={separationItems}
        setSeparationItems={setSeparationItems}
        type={isLetterModalOpen?.type}
        isOpen={isLetterModalOpen}
        setIsOpen={setIsLetterModalOpen}
      />
      <SignDocumentsModal
        separationItems={separationItems}
        setSeparationItems={setSeparationItems}
        isOpen={isDocumentModalOpen}
        setIsOpen={setIsDocumentModalOpen}
      />
      <ConfirmModal
        message='Are you sure the employee’s Last Pay has been released?'
        isOpen={!!isLastPayModalOpen}
        setIsOpen={updateReleaseModal}
        confirmAction={releaseLastPay}
        isLoading={isLoading}
      />
      <QuitclaimModal
        separationItems={separationItems}
        setSeparationItems={setSeparationItems}
        isOpen={isQuitclaimModalOpen}
        setIsOpen={setIsQuitclaimModalOpen}
      />
    </>
  );
};

export default Content;
