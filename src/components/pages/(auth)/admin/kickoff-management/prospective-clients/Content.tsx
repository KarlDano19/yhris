'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import toast from 'react-hot-toast';

import LoadingSpinner from '@/components/LoadingSpinner';
import CustomToast from '@/components/CustomToast';
import { ArrowLeftIcon, MagnifyingGlassIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import DeleteIcon from '@/svg/DeleteIcon';

import useGetProspectiveClients from './hooks/useGetProspectiveClients';
import useGetPartners from '../partners/hooks/useGetPartners';
import useResendKickoff from './hooks/useResendKickoff';
import CreateProspectiveClientModal from './modal/CreateProspectiveClientModal';
import DeleteProspectiveClientModal from './modal/DeleteProspectiveClientModal';

type T_DeleteModalData = {
  id: number;
  open: boolean;
  company_name?: string;
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending_kickoff: { label: 'Pending Kickoff', color: 'bg-yellow-100 text-yellow-700' },
  kickoff_completed: { label: 'Kickoff Completed', color: 'bg-blue-100 text-blue-700' },
  account_created: { label: 'Account Created', color: 'bg-purple-100 text-purple-700' },
  converted_to_client: { label: 'Converted', color: 'bg-green-100 text-green-700' },
};

const Content = () => {
  const [itemsFilter, setItemsFilter] = useState({ search: '' });
  const [items, setItems] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<T_DeleteModalData | null>(null);
  const [resendingId, setResendingId] = useState<number | null>(null);

  const { data, isLoading, refetch } = useGetProspectiveClients(itemsFilter);
  const { data: partnersData, refetch: refetchPartners } = useGetPartners({ view_type: 'select' });
  const { mutate: resendKickoff } = useResendKickoff();

  useEffect(() => {
    refetch();
    refetchPartners();
  }, []);

  useEffect(() => {
    if (data) setItems(data.records || data);
  }, [data]);

  const handleResend = (id: number) => {
    setResendingId(id);
    resendKickoff(id, {
      onSuccess: (res: any) => {
        toast.custom(() => <CustomToast message={res.message || 'Kick-off invitation resent.'} type="success" />, { duration: 4000 });
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err.message || 'Failed to resend invitation.'} type="error" />, { duration: 4000 });
      },
      onSettled: () => setResendingId(null),
    });
  };

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

    if (items && items.length > 0) {
      return items.map((item: any) => {
        const statusMeta = STATUS_LABELS[item.status] || { label: item.status, color: 'bg-gray-100 text-gray-500' };
        return (
          <tr key={item.id}>
            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-800">{item.company_name}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.contact_person}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.contact_email}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.partner?.name || '—'}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${statusMeta.color}`}>
                {statusMeta.label}
              </span>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
              {item.kickoff_token_expiry
                ? Intl.DateTimeFormat('en-US').format(new Date(item.kickoff_token_expiry))
                : '—'}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
              <div className="flex justify-center items-center space-x-2">
                <button
                  title="Resend kick-off invitation"
                  disabled={resendingId === item.id}
                  onClick={() => handleResend(item.id)}
                  className="text-blue-500 hover:opacity-70 disabled:opacity-40"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                </button>
                <button onClick={() => setIsDeleteModalOpen({ id: item.id, open: true, company_name: item.company_name })}>
                  <DeleteIcon />
                </button>
              </div>
            </td>
          </tr>
        );
      });
    }

    return (
      <tr>
        <td colSpan={7}>
          <h4 className="text-center text-gray-300 text-sm mt-4">{`There's no data yet.`}</h4>
          <h4 className="text-center text-gray-300 text-sm mb-4">Please click CREATE to add a prospect client.</h4>
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
          <h2 className="text-xl font-bold text-indigo-dye">Prospect Clients</h2>
          <div className="mt-6 flex flex-col lg:flex-row items-center gap-4">
            <div className="flex-none lg:w-1/3">
              <input
                type="text"
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                onChange={(e) => setItemsFilter({ search: e.target.value })}
                placeholder="Search by company, name, or email..."
              />
            </div>
            <button
              className="bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100"
              onClick={() => refetch()}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
            <div className="flex-1 flex justify-end">
              <button
                className="bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md"
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
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Company</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Contact Person</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Partner</th>
                      <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Token Expiry</th>
                      <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">{renderRows()}</tbody>
                </table>
                <hr />
                <p className="text-xs text-gray-500 mt-2">Total record/s: {items?.length ?? 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateProspectiveClientModal
          refetch={refetch}
          isOpen={isCreateModalOpen}
          setIsOpen={setIsCreateModalOpen}
          partners={partnersData?.records || partnersData || []}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteProspectiveClientModal refetch={refetch} isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} />
      )}
    </>
  );
};

export default Content;
