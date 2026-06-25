'use client';

import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import { Tooltip } from 'react-tooltip';
import ClientGoalModal from './modal/ClientGoalModal';
import EditClientSourceModal from './modal/EditClientSourceModal';
import CreateClientModal from './modal/CreateClientModal';
import RecordPaymentModal from './modal/RecordPaymentModal';
import DeleteClientModal from './modal/DeleteClientModal';
import useClientItems from './hooks/useGetClientItems';
import useToggleEmployerOTP from './hooks/useToggleEmployerOTP';
import useToggleClientTour from './hooks/useToggleClientTour';

import { CreditCardIcon, MapIcon, MagnifyingGlassIcon, ShieldCheckIcon, ShieldExclamationIcon, TrashIcon } from '@heroicons/react/24/outline';
import MoreIcon from '@/svg/MoreIcon';
import EditIcon from '@/svg/EditIcon';

const CLIENT_SOURCE_OPTIONS = ["", "Direct Client", "RCBC Partner", "GLOBE Partner"];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Active": "bg-green-100 text-green-700",
    "Expiring Soon": "bg-yellow-100 text-yellow-700",
    "Expired": "bg-red-100 text-red-700",
    "No Subscription": "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? map["No Subscription"]}`}>
      {status || "No Subscription"}
    </span>
  );
}

const Content = () => {
  const [clientItems, setClientItems] = useState<any>([]);
  const [search, setSearch] = useState('');
  const [clientSourceFilter, setClientSourceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isClientGoalModalOpen, setIsClientGoalModalOpen] = useState(false);
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{ id: number; name: string; client_source: string; partner: string } | null>(null);
  const [paymentTarget, setPaymentTarget] = useState<{ id: number; name: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const { data: dataClient, isLoading: isGetClientLoading, refetch } = useClientItems({
    search,
    client_source: clientSourceFilter,
  });

  const { mutate: toggleOTP, isLoading: isTogglingOTP } = useToggleEmployerOTP();
  const { mutate: toggleTour, isLoading: isTogglingTour } = useToggleClientTour();

  useEffect(() => {
    if (dataClient && !isGetClientLoading) {
      setClientItems(dataClient);
    }
  }, [dataClient]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, clientSourceFilter]);

  const totalRecords = clientItems.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedItems = clientItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const renderRows = () => {
    if (isGetClientLoading) {
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
    if (paginatedItems && paginatedItems.length > 0) {
      return paginatedItems.map((item: any, index: number) => {
        const sub = item.subscription;
        const tourEnabled = item.tour_enabled !== false;
        return (
          <tr
            key={item.id}
            className='hover:bg-gray-50 transition-colors'
          >
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{(currentPage - 1) * pageSize + index + 1}</td>
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-800 font-medium'>{item.name}</td>
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.partner || 'Direct Client'}</td>
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{sub?.plan_name || '—'}</td>
            <td className='whitespace-nowrap px-3 py-5 text-sm'>
              <StatusBadge status={sub?.status || 'No Subscription'} />
            </td>
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{sub?.start_date || '—'}</td>
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{sub?.end_date || '—'}</td>
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
              {sub?.days_remaining != null ? `${sub.days_remaining}d` : '—'}
            </td>
            <td className='whitespace-nowrap px-3 py-5 text-sm'>
              <div className='flex justify-center space-x-2'>
                <button
                  onClick={() => setEditTarget({ id: item.id, name: item.name, client_source: item.client_source || '', partner: item.partner || '' })}
                  data-tooltip-id='action-btn-tooltip'
                  data-tooltip-content='Edit client source'
                  data-tooltip-place='top'
                >
                  <EditIcon />
                </button>
                {(!sub || ['Expired', 'No Subscription'].includes(sub.status)) && (
                  <button
                    onClick={() => setPaymentTarget({ id: item.id, name: item.name })}
                    className='border rounded px-[0.65em] border-[#22c55e9f] text-green-600 hover:bg-green-50'
                    data-tooltip-id='action-btn-tooltip'
                    data-tooltip-content='Record payment'
                    data-tooltip-place='top'
                  >
                    <CreditCardIcon className='w-5 h-5' />
                  </button>
                )}
                <button
                  onClick={() =>
                    toggleOTP(
                      { employerId: item.id, is_enabled: !item.otp_enabled },
                      {
                        onSuccess: () => {
                          toast.custom(
                            <CustomToast
                              message={`OTP ${!item.otp_enabled ? 'enabled' : 'disabled'} for ${item.name}.`}
                              type='success'
                            />
                          );
                        },
                        onError: (err: any) => {
                          toast.custom(
                            <CustomToast
                              message={err?.message ?? 'Failed to update OTP settings.'}
                              type='error'
                            />
                          );
                        },
                      }
                    )
                  }
                  disabled={isTogglingOTP}
                  className={`border rounded px-[0.65em] disabled:opacity-50 ${
                    item.otp_enabled
                      ? 'border-[#22c55e9f] text-green-600 hover:bg-green-50'
                      : 'border-red-300 text-red-400 hover:bg-red-50'
                  }`}
                  data-tooltip-id='action-btn-tooltip'
                  data-tooltip-content={item.otp_enabled ? 'OTP Enabled — click to disable' : 'OTP Disabled — click to enable'}
                  data-tooltip-place='top'
                >
                  {item.otp_enabled ? (
                    <ShieldCheckIcon className='w-5 h-5' />
                  ) : (
                    <ShieldExclamationIcon className='w-5 h-5' />
                  )}
                </button>
                <button
                  onClick={() =>
                    toggleTour(
                      { employerId: item.id, enable_tour: !tourEnabled },
                      {
                        onSuccess: () => {
                          toast.custom(
                            <CustomToast
                              message={`Tour ${!tourEnabled ? 'enabled' : 'disabled'} for ${item.name}.`}
                              type='success'
                            />
                          );
                        },
                        onError: (err: any) => {
                          toast.custom(
                            <CustomToast
                              message={err?.message ?? 'Failed to update tour setting.'}
                              type='error'
                            />
                          );
                        },
                      }
                    )
                  }
                  disabled={isTogglingTour}
                  className={`border rounded px-[0.65em] disabled:opacity-50 ${
                    tourEnabled
                      ? 'border-[#22c55e9f] text-green-600 hover:bg-green-50'
                      : 'border-red-300 text-red-400 hover:bg-red-50'
                  }`}
                  data-tooltip-id='action-btn-tooltip'
                  data-tooltip-content={tourEnabled ? 'Tour Enabled — click to disable' : 'Tour Disabled — click to enable'}
                  data-tooltip-place='top'
                >
                  <MapIcon className='w-5 h-5' />
                </button>
                <button
                  onClick={() => setDeleteTarget({ id: item.id, name: item.name })}
                  className='border rounded px-[0.65em] border-red-300 text-red-400 hover:bg-red-50'
                  data-tooltip-id='action-btn-tooltip'
                  data-tooltip-content='Delete company'
                  data-tooltip-place='top'
                >
                  <TrashIcon className='w-5 h-5' />
                </button>
              </div>
            </td>
          </tr>
        );
      });
    } else {
      return (
        <tr>
          <td colSpan={10}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>{`There's no data yet.`}</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8'>
          <div className='mt-6 flex flex-col lg:flex-row gap-4'>
            <div className='flex-none w-full lg:w-1/2 space-y-4'>
              <h2 className='text-xl font-bold text-indigo-dye'>Client Monitoring</h2>
              <div className='relative flex flex-wrap items-center gap-2'>
                <input
                  type='text'
                  name='search'
                  id='search'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder='Search ...'
                />
                <select
                  className='rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-700'
                  value={clientSourceFilter}
                  onChange={(e) => setClientSourceFilter(e.target.value)}
                >
                  <option value=''>All Sources</option>
                  <option value='Direct Client'>Direct Client</option>
                  <option value='RCBC Partner'>RCBC Partner</option>
                  <option value='GLOBE Partner'>GLOBE Partner</option>
                </select>
                <button
                  className='bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-100'
                  onClick={() => refetch()}
                >
                  <MagnifyingGlassIcon className='h-5 w-5' />
                </button>
                <div className='flex-1 flex justify-end gap-2'>
                  <button
                    onClick={() => setIsCreateClientOpen(true)}
                    className='bg-blue-600 w-max rounded-md py-2 px-4 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none focus:opacity-80'
                  >
                    + Add Client
                  </button>
                  <button
                    className='bg-slate-500 w-max rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none focus:opacity-80 disabled:opacity-50'
                    disabled={true}
                  >
                    Client Analytics
                  </button>
                </div>
              </div>
            </div>
            <div className='flex-none w-full lg:w-1/2'>
              <div className='flex justify-between gap-3 px-5 py-5 font-semibold rounded-xl border border-solid border-slate-400 w-full max-w-[318px]'>
                <div className='flex flex-col my-auto text-base tracking-wide text-slate-700'>
                  <div>TOTAL</div>
                  <div className='mt-3.5'>client</div>
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
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>#</th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Company Name</th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Partner</th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Plan</th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Status</th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Start Date</th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>End Date</th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Days Left</th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>Actions</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
                </table>
                <hr />
              </div>
            </div>
            <Pagination
              pagination={{ totalPages, totalRecords }}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageSizeChange={(val) => { setPageSize(val); setCurrentPage(1); }}
              onPageChange={({ selected }) => setCurrentPage(selected + 1)}
            />
          </div>
      </div>
      <Tooltip id='action-btn-tooltip' />
      <ClientGoalModal isOpen={isClientGoalModalOpen} setIsOpen={setIsClientGoalModalOpen} />
      <EditClientSourceModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        employer={editTarget}
      />
      <CreateClientModal isOpen={isCreateClientOpen} onClose={() => setIsCreateClientOpen(false)} />
      <RecordPaymentModal
        isOpen={!!paymentTarget}
        onClose={() => setPaymentTarget(null)}
        employer={paymentTarget}
      />
      <DeleteClientModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        employer={deleteTarget}
        refetch={refetch}
      />
    </>
  );
};

export default Content;
