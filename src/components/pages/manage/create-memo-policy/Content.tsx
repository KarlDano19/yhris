'use client';
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState, useRef, Fragment } from 'react';
import ClipIcon from '@/svg/ClipIcon';
import DateCalendar from '@/svg/DateCalendar';
import CreateMemoModal from './modals/CreateMemoModal';
import CreatePolicyModal from './modals/CreatePolicyModal';
import CreateMemoChevronLogo from '@/svg/CreateMemoChevronLogo';
import { Menu, Transition } from '@headlessui/react';
import classNames from '@/helpers/classNames';
import DeleteMemoLogo from '@/svg/DeleteMemoLogo';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import ConfirmModal from '@/components/ConfirmModal';
import Link from 'next/link';
import useGetDirectivesItems from './hooks/useGetDirectivesItems';
import useDeleteDirectivesItem from './hooks/useDeleteDirectivesItem';

const Content = () => {
  const { mutate, isLoading } = useDeleteDirectivesItem();
  const { data: dataDirectives, isLoading: isGetDirectivesLoading } =
    useGetDirectivesItems();
  const [createMemoPolicyItems, setCreateMemoPolicyItems] = useState<any>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [itemsFilter, setItemsFilter] = useState({
    from: '',
    to: '',
    search: '',
  });
  const [isCreateMemoModalOpen, setIsCreateMemoModalOpen] = useState(false);
  const [isCreatePolicyModalOpen, setIsCreatePolicyModalOpen] = useState(false);
  const date1InputRef = useRef(null);
  const date2InputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (dataDirectives) {
      dataDirectives.directives.map((directive: any) => {
        directive.date = Intl.DateTimeFormat('en-US').format(
          new Date(directive.date)
        );
        return directive;
      });
      setCreateMemoPolicyItems(dataDirectives.directives);
    }
  }, [dataDirectives]);

  const deleteMemo = () => {
    if (idToDelete) {
      const updatedItems = createMemoPolicyItems.map((item: any) => {
        return item.id !== idToDelete
          ? item
          : {
              ...item,
              isDeleted: true,
            };
      });
      const callbackReq = {
        onSuccess: (data: any) => {
          toast.custom(
            () => <CustomToast message={data.message} type='success' />,
            { duration: 5000 }
          );
          setIsConfirmModalOpen(false);
          setCreateMemoPolicyItems([...updatedItems]);
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, {
            duration: 7000,
          });
        },
      };
      mutate(idToDelete, callbackReq);
    }
  };

  const renderRows = () => {
    if (isGetDirectivesLoading) {
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
    const deletedCount = createMemoPolicyItems.filter(
      (item: any) => item.isDeleted
    ).length;
    if (
      createMemoPolicyItems &&
      createMemoPolicyItems.length > 0 &&
      createMemoPolicyItems.length !== deletedCount
    ) {
      return createMemoPolicyItems
        .map((item: any) => {
          return (
            !item.isDeleted && (
              <tr key={item.id}>
                <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
                  {item.date}
                </td>
                <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
                  <div className='flex gap-2'>
                    <span>{item.title}</span> <ClipIcon />
                  </div>
                </td>
                <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
                  <input
                    type='checkbox'
                    defaultChecked={item.withResponse}
                    className={`form-checkbox h-5 w-5 border border-gray-300 rounded-md text-indigo-600 bg-white ${
                      !item.withResponse && 'opacity-30'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  />
                </td>
                <td className='whitespace-nowrap px-3 py-5 text-sm text-savoy-blue align-top'>
                  <p
                    className='font-bold hover:underline cursor-pointer'
                    onClick={() => alert('View responses clicked')}
                  >
                    View Responses
                  </p>
                </td>
                <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top'>
                  <span
                    className='cursor-pointer'
                    onClick={() => {
                      setIdToDelete(item.id);
                      setIsConfirmModalOpen(true);
                    }}
                  >
                    <DeleteMemoLogo />
                  </span>
                </td>
              </tr>
            )
          );
        })
        .filter((item: any) => item);
    } else {
      return (
        <tr>
          <td colSpan={7}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>
              There{`'`}s no data yet.
            </h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>
              Please click create to add memo/policy.
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
            href='/manage'
            className='flex-none flex gap-3 items-center hover:bg-gray-200'
          >
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Manage</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>
            Create Memo/Policy
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
                    setItemsFilter({ ...itemsFilter, to: e.target.value })
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
                    setItemsFilter({ ...itemsFilter, from: e.target.value })
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
            <div className='flex-1 lg:w-1/3'>
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
            <div className='flex-1 flex justify-end relative'>
              <Menu as='div' className='relative inline-block text-left'>
                <div>
                  <Menu.Button className='inline-flex w-full justify-center gap-x-4 items-center rounded-md bg-green-500 px-5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-green-500 hover:opacity-90'>
                    CREATE
                    <CreateMemoChevronLogo />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items className='absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-green-500 focus:outline-none'>
                    <div className='py-1'>
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            className={classNames(
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700',
                              'block px-4 py-2 text-sm cursor-pointer'
                            )}
                            onClick={() => {
                              setIsCreateMemoModalOpen(true);
                              setIsOpen(!isOpen);
                            }}
                          >
                            Create Memo
                          </span>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            className={classNames(
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700',
                              'block px-4 py-2 text-sm cursor-pointer'
                            )}
                            onClick={() => {
                              setIsCreatePolicyModalOpen(true);
                              setIsOpen(!isOpen);
                            }}
                          >
                            Create Policy
                          </span>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
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
                        Date
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                      >
                        Title
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                      >
                        With Response
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                      >
                        Response/s
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {renderRows()}
                  </tbody>
                </table>
                <hr />
                <p className='text-xs text-gray-500 mt-2'>
                  Total record/s:{' '}
                  {
                    createMemoPolicyItems.filter((item: any) => !item.isDeleted)
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateMemoModal
        isOpen={isCreateMemoModalOpen}
        setIsOpen={setIsCreateMemoModalOpen}
        setCreateMemoPolicyItems={setCreateMemoPolicyItems}
        createMemoPolicyItems={createMemoPolicyItems}
      />
      <CreatePolicyModal
        setCreateMemoPolicyItems={setCreateMemoPolicyItems}
        createMemoPolicyItems={createMemoPolicyItems}
        isOpen={isCreatePolicyModalOpen}
        setIsOpen={setIsCreatePolicyModalOpen}
      />
      <ConfirmModal
        message='Are you sure you want to delete this memo/policy?'
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        confirmAction={deleteMemo}
        isLoading={false}
      />
    </>
  );
};

export default Content;
