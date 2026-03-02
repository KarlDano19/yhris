import { Dispatch, Fragment, useRef, useEffect, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

import useGetEmailMonitoringLogDetails from '../hooks/useGetEmailMonitoringLogDetails';
import { formatDateTimeSeparate } from '@/helpers/date';

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
        is_send: status,
        scheduled_date: scheduled_date ?? null,
      };
    }
    return null;
  };

  const emailRecord = extractEmailRecord(logDetails);
  const toArray = (val: any, fallback: any[] = []) => {
    if (!val && val !== 0) return fallback;
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return val.split(',').map((s) => s.trim()).filter(Boolean);
    return fallback;
  };
  const isEmailString = (s: any) => {
    if (!s || typeof s !== 'string') return false;
    return /\S+@\S+\.\S+/.test(s);
  };

  const displayUserName = (() => {
    const userVal = logDetails?.user;
    const emailVal = logDetails?.email;
    if (userVal && !isEmailString(userVal)) return userVal;
    if (emailVal) return emailVal;
    return userVal ?? 'N/A';
  })();

  const displayUserEmail = (() => {
    const emailVal = logDetails?.email;
    // Show email only if it's different from displayed name
    if (emailVal && emailVal !== displayUserName) return emailVal;
    return '';
  })();

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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl'>
                {/* Header */}
                <div className='flex bg-savoy-blue p-4 items-center'>
                  <h3 className='flex-1 text-white text-lg font-semibold'>
                    Email Log: #{logDetails.id ?? ''}
                  </h3>
                  <XMarkIcon
                    className='w-6 h-6 text-white cursor-pointer hover:text-gray-200'
                    onClick={() => customCloseModal()}
                  />
                </div>

                {/* Log Information Section */}
                <div className='px-6 py-4 bg-gray-50'>
                  <div className='flex items-center gap-2 mb-4'>
                    <InformationCircleIcon className='w-5 h-5 text-blue-500' />
                    <h3 className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>
                      Log Information
                    </h3>
                  </div>

                  <div className='grid grid-cols-5 gap-4'>
                    <div>
                      <label className='text-xs text-gray-500 uppercase'>User</label>
                    <div className='mt-1'>
                      <div className='text-sm font-medium text-gray-900'>
                        {displayUserName}
                      </div>
                      {displayUserEmail ? (
                        <div className='text-xs text-gray-500'>
                          {displayUserEmail}
                        </div>
                      ) : null}
                    </div>
                    </div>

                    <div>
                      <label className='text-xs text-gray-500 uppercase'>Date & Time</label>
                      <div className='mt-1'>
                        <div className='text-sm font-medium text-gray-900'>
                          {logDetails.created_at ? formatDateTime(logDetails.created_at).formattedDate : 'N/A'}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {logDetails.created_at ? formatDateTime(logDetails.created_at).formattedTime : ''}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className='text-xs text-gray-500 uppercase'>Module</label>
                      <div className='text-sm font-medium text-gray-900 mt-1'>
                        {logDetails.model_name ?? 'N/A'}
                      </div>
                    </div>

                    <div>
                      <label className='text-xs text-gray-500 uppercase'>Activity ID</label>
                      <div className='text-sm font-medium text-gray-900 mt-1'>
                        {logDetails.id ?? 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <label className='text-xs text-gray-500 uppercase'>Status</label>
                      <div className='text-sm font-medium text-gray-900 mt-1'>
                        {logDetails?.status ? 'Sent' : 'Not Sent'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Details Section (single column, no previous/new comparison) */}
                <div className='px-6 py-4'>
                  <div className='flex items-center gap-2 mb-4'>
                    <InformationCircleIcon className='w-5 h-5 text-blue-500' />
                    <h3 className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>
                      Email Details
                    </h3>
                  </div>

                  <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
                    <div className='space-y-3'>
                      <div>
                        <label className='text-xs text-gray-500 uppercase'>To</label>
                        <div className='mt-2 flex flex-wrap gap-2'>
                          {toArray(emailRecord?.to, logDetails.email ? [logDetails.email] : []).map((addr: any) => (
                            <div key={addr} className='bg-[#ACB9CB] rounded-md py-0 px-4 text-sm'>
                              {addr}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className='text-xs text-gray-500 uppercase'>Cc</label>
                        <div className='mt-2 flex flex-wrap gap-2'>
                          {toArray(emailRecord?.cc, []).map((addr: any) => (
                            <div key={addr} className='bg-[#ACB9CB] rounded-md py-0 px-4 text-sm'>
                              {addr}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className='text-xs text-gray-500 uppercase'>Bcc</label>
                        <div className='mt-2 flex flex-wrap gap-2'>
                          {toArray(emailRecord?.bcc, []).map((addr: any) => (
                            <div key={addr} className='bg-[#ACB9CB] rounded-md py-0 px-4 text-sm'>
                              {addr}
                            </div>
                          ))}
                        </div>
                      </div>

                      {emailRecord?.scheduled_date && (
                        <div>
                          <label className='text-xs text-gray-500 uppercase'>Scheduled</label>
                          <div className='mt-1 text-sm'>{new Date(emailRecord.scheduled_date).toLocaleString()}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className='border-t border-gray-200 px-6 py-4 mt-2'>
                  <div className='flex justify-end'>
                    <div className='flex gap-3'>
                      <button
                        onClick={customCloseModal}
                        className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-savoy-blue rounded-md hover:bg-blue-700'
                        ref={cancelButtonRef}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

