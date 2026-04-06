'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import LoadingSpinner from '@/components/LoadingSpinner';
import CustomToast from '@/components/CustomToast';
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import toast from 'react-hot-toast';

import useGetPartners from './hooks/useGetPartners';
import useResendKickoff from '../prospective-clients/hooks/useResendKickoff';
import CreatePartnerModal from './modal/CreatePartnerModal';
import EditPartnerModal from './modal/EditPartnerModal';
import DeletePartnerModal from './modal/DeletePartnerModal';

type T_ModalData = {
  id: number;
  open: boolean;
  name?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
};

const Content = () => {
  const [itemsFilter, setItemsFilter] = useState({ search: '' });
  const [partnerItems, setPartnerItems] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<T_ModalData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<T_ModalData | null>(null);

  const { data, isLoading, refetch } = useGetPartners(itemsFilter);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data) setPartnerItems(data.records || data);
  }, [data]);

  const renderRows = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={100}>
            <div className="py-5">
              <LoadingSpinner size="lg" color="yellow" />
            </div>
          </td>
        </tr>
      );
    }

    if (partnerItems && partnerItems.length > 0) {
      return partnerItems.map((item: any) => (
        <tr key={item.id}>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{item.name}</td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.email}</td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.phone || '—'}</td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {item.is_active ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
            <div className="flex justify-center space-x-2">
              <button
                onClick={() =>
                  setIsEditModalOpen({ id: item.id, open: true, name: item.name, email: item.email, phone: item.phone, is_active: item.is_active })
                }
              >
                <EditIcon />
              </button>
              <button onClick={() => setIsDeleteModalOpen({ id: item.id, open: true, name: item.name })}>
                <DeleteIcon />
              </button>
            </div>
          </td>
        </tr>
      ));
    }

    return (
      <tr>
        <td colSpan={5}>
          <h4 className="text-center text-gray-300 text-sm mt-4">{`There's no data yet.`}</h4>
          <h4 className="text-center text-gray-300 text-sm mb-4">Please click CREATE to add a partner.</h4>
          <div className="flex-1 flex justify-center mb-4">
            <button
              className="bg-white border-2 border-green-500 rounded-md py-2 px-8 text-green-500 text-sm font-semibold hover:shadow-md"
              onClick={() => setIsCreateModalOpen(true)}
            >
              CREATE
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex p-4">
          <Link href="/admin/kickoff-management" className="flex-none flex gap-3 items-center hover:bg-gray-200 px-2 py-1 rounded">
            <ArrowLeftIcon className="h-5 w-5" />
            <h4>Kickoff Management</h4>
          </Link>
        </div>
        <div className="px-2 md:px-8 lg:px-4">
          <h2 className="text-xl font-bold text-indigo-dye">Partners</h2>
          <div className="mt-6 flex flex-col lg:flex-row items-center gap-4">
            <div className="flex-none lg:w-1/3">
              <div className="relative flex items-center">
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  onChange={(e) => setItemsFilter({ search: e.target.value })}
                  placeholder="Search by name or email..."
                />
              </div>
            </div>
            <button
              className="bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100"
              onClick={() => refetch()}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
            <div className="flex-1 flex justify-end">
              <button
                className="bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50"
                onClick={() => setIsCreateModalOpen(true)}
              >
                CREATE
              </button>
            </div>
          </div>

          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="min-w-full py-2 sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
                      <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">{renderRows()}</tbody>
                </table>
                <hr />
                <p className="text-xs text-gray-500 mt-2">Total record/s: {partnerItems?.length ?? 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <CreatePartnerModal refetch={refetch} isOpen={isCreateModalOpen} setIsOpen={setIsCreateModalOpen} />
      )}
      {isEditModalOpen && (
        <EditPartnerModal refetch={refetch} isOpen={isEditModalOpen} setIsOpen={setIsEditModalOpen} />
      )}
      {isDeleteModalOpen && (
        <DeletePartnerModal refetch={refetch} isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} />
      )}
    </>
  );
};

export default Content;
