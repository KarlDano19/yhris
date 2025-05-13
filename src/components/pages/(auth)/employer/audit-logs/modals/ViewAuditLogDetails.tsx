import { Dispatch, Fragment, useRef, useEffect, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';

import CustomDatePicker from '@/components/CustomDatePicker';
import useGetEmployeeItems from '@/components/hooks/useGetEmployeeItems';
import useGetAuditLogDetails from '../hooks/useGetAuditLogDetails';

import { XCircleIcon } from '@heroicons/react/24/solid';
import SelectChevronDown from '@/svg/SelectChevronDown';

type T_ModalData = {
  id: number;
  open: boolean;
};

export default function EditEmployeeCompensationLogModal({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const [auditLogDetails, setAuditLogDetails] = useState<any>([]);
  const { data: auditLogData, refetch: refetchAuditLog, remove: removeAuditLog } = useGetAuditLogDetails(isOpen.id);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options); // e.g., "January 1, 2023"
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    return { formattedDate, formattedTime };
  };

  useEffect(() => {
    if (isOpen) {
      refetchAuditLog();
    }
  }, [isOpen]);

  useEffect(() => {
    if (auditLogData) {
      setAuditLogDetails(auditLogData);
    }
  }, [auditLogData]);

  const customCloseModal = () => {
    removeAuditLog();
    setIsOpen(null);
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
              <Dialog.Panel className='relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl'>
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Audit Log Details: {auditLogDetails.id}</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => customCloseModal()} />
                </div>
                <div className='px-4 pt-4 pb-6'>
                  <div className={`hidden rounded-md bg-red-50 p-4 mb-3`}>
                    <div className='flex'>
                      <div className='flex-shrink-0'>
                        <XCircleIcon className='h-5 w-5 text-red-400' aria-hidden='true' />
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-6 mt-2'>
                    <div className='flex flex-col'>
                      <h3 className='text-sm font-medium'>Audit Log Details</h3>
                      <div className='flex flex-col gap-2 mt-2'>
                        <h3 className='text-sm font-medium'>User: {auditLogDetails.user}</h3>
                        <h3 className='text-sm font-medium'>
                          Date: {formatDateTime(auditLogDetails.created_at).formattedDate}
                        </h3>
                        <h3 className='text-sm font-medium'>Activity Id: {auditLogDetails.id}</h3>
                        <h3 className='text-sm font-medium'>Previous Data:</h3>
                        <div className='flex flex-col gap-2 border border-gray-300 rounded-md p-2'>
                          {auditLogDetails.old_data &&
                            Object.entries(auditLogDetails.old_data).map(
                              ([key, value]) =>
                                key !== 'id' && ( // Exclude the 'id' field
                                  <h3 key={key} className='text-sm font-medium'>
                                    {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value !== null ? value : 'N/A'}`}
                                  </h3>
                                )
                            )}
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col'>
                      <div className='flex flex-col gap-2 mt-7'>
                        <h3 className='text-sm font-medium'>
                          Time: {formatDateTime(auditLogDetails.created_at).formattedTime}
                        </h3>
                        <h3 className='text-sm font-medium'>Action: {auditLogDetails.action}</h3>
                        <h3 className='text-sm font-medium'>Module: {auditLogDetails.model_name}</h3>
                        <h3 className='text-sm font-medium'>Created Data:</h3>
                        <div className='flex flex-col gap-2 border border-gray-300 rounded-md p-2'>
                          {auditLogDetails.new_data &&
                            Object.entries(auditLogDetails.new_data).map(
                              ([key, value]) =>
                                key !== 'id' && ( // Exclude the 'id' field
                                  <h3 key={key} className='text-sm font-medium'>
                                    {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value !== null ? value : 'N/A'}`}
                                  </h3>
                                )
                            )}
                        </div>
                      </div>
                    </div>
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
