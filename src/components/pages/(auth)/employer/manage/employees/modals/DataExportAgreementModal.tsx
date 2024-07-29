/* eslint-disable react/no-unescaped-entities */
import { Dispatch, Fragment, useEffect, useState, useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';

import { XCircleIcon } from '@heroicons/react/24/solid';

export default function DataAgreementModal({
  isOpen,
  setIsOpen,
  setIsAgreementAccepted,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  setIsAgreementAccepted: Dispatch<boolean>;
}) {
  const { register, handleSubmit } = useForm<{ is_export_agreed: boolean }>();
  const queryClient = useQueryClient();
  const [isAgreeChecked, setIsAgreeChecked] = useState(false); 
  const cancelButtonRef = useRef(null);

  const onSubmit = (data: { is_export_agreed: boolean }) => {
    setIsOpen(false);
    setIsAgreementAccepted(data.is_export_agreed);
    queryClient.setQueryData(['employerProfileCache'], (oldData: any) => ({
        ...oldData,
        is_export_agreed: data.is_export_agreed,
    }));
};

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => setIsOpen(false)}>
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-[500px]'>
                <div className='text-center px-4 pt-4 pb-4'>
                  <div className='flex justify-end'>
                    <XCircleIcon className='w-[19px] h-[19px] text-[#ACB9CB] cursor-pointer mt-1' onClick={()=>setIsOpen(false)} />
                  </div>
                    <div className='flex p-2'>
                      <h3 className='flex-1 text-[#2C3F58] text-xl px-4 font-semibold text-center'>Export Agreement</h3>
                    </div>
                  <div className='mt-3 text-left sm:mt-3 px-6 h-[450px] overflow-auto'>
                    <ul className='list-decimal nested-decimal'>
                        <li className='text-base font-semibold mb-3 mt-6'>Authorization and User Roles</li>
                        <div className='space-y-3'>
                            <ul className='list-decimal nested-decimal pl-2'>
                                <li className='text-sm'>
                                  Only authorized users with specific roles are permitted to view and
                                  export data from the YAHSHUA HRIS.
                                </li>
                            </ul>
                        </div>
                        <li className='text-base font-semibold mb-3 mt-6'>Approved Data for Export</li>
                        <div className='space-y-3'>
                            <ul className='list-decimal nested-decimal text-sm space-y-3 pl-2'>
                                <li className='text-sm'>
                                  Only the following documents/data are approved for export from the
                                  YAHSHUA HRIS:
                                </li>
                                <ul className='list-disc pl-5 text-sm'>
                                    <li>
                                      Employee Profile such as Date Hired, Employee's Name (First Name,
                                      Middle Name, Last Name), City Address, Email Address, and Mobile
                                      number.
                                    </li>
                                </ul>
                                <li className='text-sm'>
                                    Any data not explicitly listed above is prohibited from export without
                                    additional approval.
                                </li>
                            </ul>
                        </div>
                        <li className='text-base font-semibold mb-3 mt-6'>Export Process</li>
                        <div className='space-y-3'>
                            <ul className='list-decimal nested-decimal text-sm space-y-3 pl-2'>
                                <p className='text-sm'>
                                  By agreeing to these terms, authorized users ("User") acknowledge and
                                  consent to the following
                                </p>
                                <li className='text-sm'>
                                  Data Export Authorization: User is authorized to export only the data
                                  listed in Section 2.1 from the YAHSHUA HRIS   
                                </li>
                                <li className='text-sm'>
                                  Data Responsibility: User understands and accepts full responsibility
                                  for the exported data and its use by third parties.
                                </li>
                                <li className='text-sm'>
                                  Security Measures: User agrees to take appropriate security measures
                                  to protect the exported data during transfer and storage.
                                </li>
                                <li className='text-sm'>
                                  Limit of Liability: YAHSHUA-ABBA is not liable for any misuse, loss, or
                                  unauthorized access to the exported data once it leaves our system.
                                </li>
                                <li className='text-sm'>
                                  Compliance: User agrees to comply with all applicable data protection
                                  and privacy laws when handling the exported data.
                                </li>
                                <li className='text-sm'>
                                  Audit: All data exports will be logged and subject to audit to ensure
                                  compliance with this agreement.
                                </li>
                                <p className='text-sm'>
                                  By proceeding with the data export, you confirm that you have read,
                                  understood, and agreed to these terms.
                                </p>
                            </ul>
                        </div>
                    </ul>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex items-center pt-4 pl-10'>
                      <input 
                        type='checkbox' 
                        {...register('is_export_agreed')}
                        className='mr-2'
                        onChange={(e) => setIsAgreeChecked(e.target.checked)}
                      />
                      <label className='text-gray-600'>I Agree</label>
                    </div>
                    <button
                      type='submit'
                      className='rounded-md border border-transparent px-20 py-2 mt-6 bg-blue-600 text-base font-bold text-white shadow-sm enabled:hover:bg-blue-700 disabled:opacity-50'
                      disabled={!isAgreeChecked}
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}