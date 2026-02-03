import { Dispatch, Fragment, useRef, useEffect, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import useGetEmailMonitoringLogDetails from '../hooks/useGetEmailMonitoringLogDetails';
import { formatDateTimeSeparate } from '@/helpers/date';

import { XCircleIcon } from '@heroicons/react/24/solid';

import 'react-quill/dist/quill.snow.css';

type T_ModalData = {
  id: number;
  open: boolean;
};

export default function ViewEmailMonitoringLogDetails({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const [logDetails, setLogDetails] = useState<any>([]);
  const { data: logData, refetch: refetchLog, remove } = useGetEmailMonitoringLogDetails(isOpen.id);

  const formatDateTime = formatDateTimeSeparate;

  useEffect(() => {
    if (isOpen) {
      refetchLog();
    }
  }, [isOpen]);

  useEffect(() => {
    if (logData) {
      setLogDetails(logData);
    }
  }, [logData]);

  const customCloseModal = () => {
    remove();
    setIsOpen(null);
  };

  const renderValue = (val: any): React.ReactNode => {
    try {
      if (val === null || val === undefined) return "N/A";
      if (typeof val === "string") return String(val);
      if (typeof val === "number" || typeof val === "boolean") return String(val);
      if (Array.isArray(val)) {
        return val.join(', ');
      }
      if (typeof val === "object") {
        return JSON.stringify(val, null, 2);
      }
      return String(val);
    } catch (err) {
      console.error("renderValue error:", err);
      return JSON.stringify(val) ?? "[object Object]";
    }
  };

  const extractEmailRecord = (details: any) => {
    // Prefer enriched top-level records, then fall back to new_data (search recursively).
    const em = details?.email_monitoring_record;
    const atem = details?.applicant_talent_email_monitoring_record;
    const newData = details?.new_data ?? details;

    const findInObject = (obj: any, keys: string[], depth = 3): any => {
      if (!obj || depth <= 0) return undefined;
      for (const k of keys) {
        if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k]) return obj[k];
      }
      // search nested objects/arrays
      for (const val of Object.values(obj)) {
        if (val && typeof val === 'object') {
          const found = findInObject(val, keys, depth - 1);
          if (found) return found;
        }
      }
      return undefined;
    };

    const normalizeEmails = (val: any) => {
      if (!val && val !== 0) return '';
      if (Array.isArray(val)) return val.join(', ');
      return String(val);
    };

    if (em) {
      return {
        template: em.template_name ?? '',
        email_type: em.email_type ?? '',
        to: normalizeEmails(em.emails),
        cc: normalizeEmails(em.ccs),
        bcc: normalizeEmails(em.bccs),
        status: em.is_send ? 'Sent' : 'Not Sent',
      };
    }
    if (atem) {
      return {
        template: atem.subject ?? '',
        to: normalizeEmails(atem.to_email),
        cc: normalizeEmails(atem.cc_email),
        bcc: normalizeEmails(atem.bcc_email),
        status: atem.status ?? '',
        scheduled_date: atem.scheduled_date ?? null,
      };
    }

    // Try to find likely fields in newData recursively
    const template = findInObject(newData, ['subject', 'template_name', 'template']);
    const to = findInObject(newData, ['to_email', 'to', 'emails', 'recipient', 'recipients']);
    const cc = findInObject(newData, ['cc_email', 'ccs', 'cc']);
    const bcc = findInObject(newData, ['bcc_email', 'bccs', 'bcc']);
    const status = findInObject(newData, ['status', 'is_send']);
    const scheduled_date = findInObject(newData, ['scheduled_date', 'send_date', 'scheduled']);

    if (template || to || cc || bcc || status) {
      const toArr = Array.isArray(to) ? to : (typeof to === 'string' && to ? to.split(',').map((s:any)=>s.trim()) : (to ? [to] : []));
      const ccArr = Array.isArray(cc) ? cc : (typeof cc === 'string' && cc ? cc.split(',').map((s:any)=>s.trim()) : (cc ? [cc] : []));
      const bccArr = Array.isArray(bcc) ? bcc : (typeof bcc === 'string' && bcc ? bcc.split(',').map((s:any)=>s.trim()) : (bcc ? [bcc] : []));
      return {
        template: template ?? '',
        to: toArr,
        cc: ccArr,
        bcc: bccArr,
        status: typeof status === 'boolean' ? (status ? 'Sent' : 'Not Sent') : status ?? 'Logged',
        scheduled_date: scheduled_date ?? null,
      };
    }
    return null;
  };

  const emailRecord = extractEmailRecord(logDetails);
  const rawStatus = emailRecord?.status ?? logDetails?.status ?? 'Logged';
  const isSuccessStatus = ['sent', 'success'].includes(String(rawStatus).toLowerCase());
  const displayStatus = isSuccessStatus ? 'Success' : 'Unsuccessful';
  const toArray = (val: any, fallback: any[] = []) => {
    if (!val && val !== 0) return fallback;
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return val.split(',').map((s) => s.trim()).filter(Boolean);
    return fallback;
  };

  return (
    <Transition.Root show={isOpen.open} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => customCloseModal()}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Email Log</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => customCloseModal()} />
                </div>

                <div className='px-6 pt-5 pb-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-3'>
                      <div>
                        <h4 className='text-sm text-gray-500'>User</h4>
                        <div className='text-sm font-medium'>{logDetails.user ?? 'N/A'}</div>
                      </div>
                      <div>
                        <h4 className='text-sm text-gray-500'>Date</h4>
                        <div className='text-sm font-medium'>{logDetails.created_at ? formatDateTime(logDetails.created_at).formattedDate + ' ' + formatDateTime(logDetails.created_at).formattedTime : 'N/A'}</div>
                      </div>                      
                      <div>
                        <h4 className='text-sm text-gray-500'>Module</h4>
                        <div className='text-sm font-medium'>{logDetails.model_name ?? 'N/A'}</div>
                      </div>
                      <div>
                        <h4 className='text-sm text-gray-500'>Activity ID</h4>
                        <div className='text-sm font-medium'>{logDetails.id ?? 'N/A'}</div>
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <h4 className='text-sm text-gray-500'>Email Details</h4>
                      <div className='border border-gray-200 rounded-md p-3 bg-gray-50'>
                        <div className='text-sm'>
                          {/*
                          Subject / Template removed for privacy.
                          <div className='mb-2'>
                            <span className='font-semibold'>Subject / Template: </span>
                            <span>{emailRecord?.template ?? 'N/A'}</span>
                          </div>
                          */}
                          <div className='mb-2'>
                            <span className='font-semibold'>To: </span>
                            <div className='mt-2 flex flex-wrap gap-2'>
                              {toArray(emailRecord?.to, logDetails.email ? [logDetails.email] : []).map((addr: any) => (
                                <div key={addr} className='bg-[#ACB9CB] rounded-md py-0 px-4 text-sm'>
                                  {addr}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className='mb-2'>
                            <span className='font-semibold'>Cc: </span>
                            <div className='mt-2 flex flex-wrap gap-2'>
                              {toArray(emailRecord?.cc, []).map((addr: any) => (
                                <div key={addr} className='bg-[#ACB9CB] rounded-md py-0 px-4 text-sm'>
                                  {addr}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className='mb-2'>
                            <span className='font-semibold'>Bcc: </span>
                            <div className='mt-2 flex flex-wrap gap-2'>
                              {toArray(emailRecord?.bcc, []).map((addr: any) => (
                                <div key={addr} className='bg-[#ACB9CB] rounded-md py-0 px-4 text-sm'>
                                  {addr}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className='mb-2'>
                            <span className='font-semibold'>Status: </span>
                            <span className={isSuccessStatus ? 'text-green-500' : 'text-red-500'}>
                              {displayStatus}
                            </span>
                          </div>
                          {emailRecord?.scheduled_date && (
                            <div className='mb-2'>
                              <span className='font-semibold'>Scheduled: </span>
                              <span>{new Date(emailRecord.scheduled_date).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Body content removed for privacy */}
                  </div>
                </div>
                <hr />
                <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
                  <button
                    type='button'
                    className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                    onClick={() => customCloseModal()}
                    ref={cancelButtonRef}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

