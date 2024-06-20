import { Dispatch, Fragment, useRef, useEffect } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import useGetVoucherDetails from '../hooks/useGetVoucherDetails';

import { XCircleIcon } from '@heroicons/react/24/solid';

export default function RedemptionCountModal({
  isOpen,
  setIsOpen,
  selectedVoucherId,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  selectedVoucherId: number | null;
}) {
  const cancelButtonRef = useRef(null);
  const {
    data: dataVoucherDetail,
    refetch: refetchVoucherDetail,
    remove: removeVoucherDetail,
  } = useGetVoucherDetails(selectedVoucherId);

  useEffect(() => {
    if (isOpen) {
      refetchVoucherDetail();
    }
  }, [isOpen]);

  const customCloseModal = () => {
    removeVoucherDetail();
    setIsOpen(false);
  };

  const renderRows = () => {
    if (dataVoucherDetail && dataVoucherDetail.redemption_count && dataVoucherDetail.redemption_count.length > 0) {
      return dataVoucherDetail.redemption_count.map((item: any) => (
        <tr key={item.id}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.name}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.plan}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.date}</td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={7}>
            <h4 className='text-gray-300 text-sm mt-4'>{`There's no data yet.`}</h4>
            <h4 className='text-gray-300 text-sm mb-4'>Voucher is not been redeemed yet.</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
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
              <Dialog.Panel className='relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Redeemed History</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                </div>
                <div className='px-4 pt-4 pb-6'>
                  <table className='min-w-full divide-y divide-gray-300 text-center'>
                    <thead>
                      <tr>
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                          Name
                        </th>
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                          Plan
                        </th>
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
                  </table>
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
