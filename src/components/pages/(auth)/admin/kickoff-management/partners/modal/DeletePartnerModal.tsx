import { Dispatch, Fragment, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import { XCircleIcon } from '@heroicons/react/24/solid';

import useDeletePartner from '../hooks/useDeletePartner';

type T_ModalData = {
  id: number;
  open: boolean;
  name?: string;
};

export default function DeletePartnerModal({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const { mutate, isLoading } = useDeletePartner();

  const handleDelete = () => {
    mutate(isOpen.id, {
      onSuccess: (res: any) => {
        toast.custom(() => <CustomToast message={res.message || 'Partner deleted successfully.'} type="success" />, { duration: 4000 });
        setIsOpen(null);
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err.message || 'Something went wrong.'} type="error" />, { duration: 4000 });
      },
    });
  };

  return (
    <Transition.Root show={!!isOpen?.open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setIsOpen(null)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">Delete Partner</h3>
                  <XCircleIcon className="w-8 h-8 text-white cursor-pointer" onClick={() => setIsOpen(null)} />
                </div>
                <div className="px-4 pt-5 pb-4">
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-gray-900">{isOpen?.name}</span>? This action cannot be undone.
                  </p>
                </div>
                <hr />
                <div className="mt-4 sm:flex sm:flex-row-reverse px-4">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleDelete}
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto disabled:opacity-50"
                  >
                    {isLoading ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setIsOpen(null)}
                    ref={cancelButtonRef}
                  >
                    Cancel
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
