'use client';

import { useEffect, useState, useRef } from 'react';

import Link from 'next/link';

import useGetVoucherItems from './hooks/useGetVoucherItems';
import useGetPlanItems from './hooks/useGetPlanItems';
import CreateVoucherModal from './modal/CreateVoucherModal';
import RedemptionCountModal from './modal/RedemptionCountModal';
import EditVoucherModal from './modal/EditVoucherModal';
import DeleteVoucherModal from './modal/DeleteVoucherModal';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';

const Content = () => {
  const [itemsFilter, setItemsFilter] = useState<any>({
    search: '',
  });
  const [vouchersItems, setVouchersItems] = useState<any>([]);
  const [actionType, setActionType] = useState<string>('');
  const [plans, SetPlans] = useState<any>([]);
  const [isCreateVoucherModalOpen, setIsCreateVoucherModalOpen] = useState(false);
  const [isRedemptionModalOpen, setIsRedemptionModalOpen] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(null);
  const [isEditVoucherModalOpen, setIsEditVoucherModalOpen] = useState(false);
  const [isDeleteVoucherModalOpen, setIsDeleteVoucherModalOpen] = useState(false);
  const { data: dataPlans, isLoading: isLoadingPlans } = useGetPlanItems();
  const {
    data: dataVouchers,
    isLoading: isGetVouchersLoading,
    refetch: refetchVouchers,
  } = useGetVoucherItems(itemsFilter);

  useEffect(() => {
    refetchVouchers();
  }, []);

  useEffect(() => {
    if (dataVouchers && !isGetVouchersLoading) {
      setVouchersItems(dataVouchers);
    }
  }, [dataVouchers]);

  useEffect(() => {
    if (dataPlans && !isLoadingPlans) {
      SetPlans(dataPlans);
    }
  }, [dataPlans]);

  useEffect(() => {
    if (selectedVoucherId) {
      if (actionType === 'edit') {
        setIsEditVoucherModalOpen(true);
      }
      if (actionType === 'delete') {
        setIsDeleteVoucherModalOpen(true);
      }
      if (actionType === 'redemption') {
        setIsRedemptionModalOpen(true);
      }
    }
  }, [selectedVoucherId]);

  const openEditVoucherModal = (voucherDetails: any) => {
    setActionType('edit');
    if (selectedVoucherId && selectedVoucherId === voucherDetails.id) {
      setIsEditVoucherModalOpen(true);
    } else {
      setSelectedVoucherId(voucherDetails.id);
    }
  };

  const openDeleteVoucherModal = (voucherDetails: any) => {
    setActionType('delete');
    if (selectedVoucherId && selectedVoucherId === voucherDetails.id) {
      setIsDeleteVoucherModalOpen(true);
    } else {
      setSelectedVoucherId(voucherDetails.id);
    }
  };

  const openRedemptionModal = (voucherDetails: any) => {
    setActionType('redemption');
    if (selectedVoucherId && selectedVoucherId === voucherDetails.id) {
      setIsRedemptionModalOpen(true);
    } else {
      setSelectedVoucherId(voucherDetails.id);
    }
  };

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
            <span onClick={() => openRedemptionModal(item)} className='cursor-pointer text-blue-600 underline'>
              {item.redeem_count}
            </span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            {item.redemption_date_from} - {item.redemption_date_to}
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
            <div className='flex space-x-2'>
              <button onClick={() => openEditVoucherModal(item)}>
                <EditIcon />
              </button>
              <button onClick={() => openDeleteVoucherModal(item)}>
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
                onClick={() => setIsCreateVoucherModalOpen(true)}
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
          <Link href='/admin/management' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Payment Management</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Vouchers</h2>
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
              onClick={() => refetchVouchers()}
            >
              <MagnifyingGlassIcon className='h-5 w-5' />
            </button>
            <div className='flex-1 flex justify-end'>
              <button
                className='bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                onClick={() => setIsCreateVoucherModalOpen(true)}
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
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Code
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Applied Plan
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Discount (%)
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        No. of Employees
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Max Redemption
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Redeemed Count
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Redemption Period
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
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
      {isCreateVoucherModalOpen && (
        <CreateVoucherModal
          refetch={refetchVouchers}
          plans={plans}
          isOpen={isCreateVoucherModalOpen}
          setIsOpen={setIsCreateVoucherModalOpen}
        />
      )}
      {isRedemptionModalOpen && (
        <RedemptionCountModal
          isOpen={isRedemptionModalOpen}
          setIsOpen={setIsRedemptionModalOpen}
          selectedVoucherId={selectedVoucherId}
        />
      )}
      {isEditVoucherModalOpen && selectedVoucherId && (
        <EditVoucherModal
          refetch={refetchVouchers}
          plans={plans}
          isOpen={isEditVoucherModalOpen}
          setIsOpen={setIsEditVoucherModalOpen}
          selectedVoucherId={selectedVoucherId}
        />
      )}
      {isDeleteVoucherModalOpen && selectedVoucherId && (
        <DeleteVoucherModal
          refetch={refetchVouchers}
          isOpen={isDeleteVoucherModalOpen}
          setIsOpen={setIsDeleteVoucherModalOpen}
          selectedVoucherId={selectedVoucherId}
          selectedVoucherCode={vouchersItems.find((item: any) => item.id === selectedVoucherId)?.code}
        />
      )}
    </>
  );
};

export default Content;
