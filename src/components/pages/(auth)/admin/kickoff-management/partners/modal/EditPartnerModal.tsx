import { Dispatch, Fragment, useEffect, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import { XCircleIcon } from '@heroicons/react/24/solid';

import useUpdatePartner from '../hooks/useUpdatePartner';

type T_ModalData = {
  id: number;
  open: boolean;
  name?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
};

export default function EditPartnerModal({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const { register, handleSubmit, reset } = useForm<any>();
  const { mutate, isLoading } = useUpdatePartner();

  useEffect(() => {
    if (isOpen) {
      reset({
        name: isOpen.name || '',
        email: isOpen.email || '',
        phone: isOpen.phone || '',
        is_active: isOpen.is_active ?? true,
      });
    }
  }, [isOpen, reset]);

  const onSubmit = handleSubmit((data) => {
    mutate(
      { id: isOpen.id, data },
      {
        onSuccess: (res: any) => {
          toast.custom(() => <CustomToast message={res.message || 'Partner updated successfully.'} type="success" />, { duration: 4000 });
          setIsOpen(null);
          refetch();
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err.message || 'Something went wrong.'} type="error" />, { duration: 4000 });
        },
      }
    );
  });

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">Edit Partner</h3>
                  <XCircleIcon className="w-8 h-8 text-white cursor-pointer" onClick={() => setIsOpen(null)} />
                </div>
                <form onSubmit={onSubmit}>
                  <div className="px-4 pt-4 pb-6 space-y-3">
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('name', { required: true })}
                        className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        {...register('email', { required: true })}
                        className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">Phone</label>
                      <input
                        type="text"
                        {...register('phone')}
                        className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" {...register('is_active')} className="h-4 w-4" />
                      <label className="text-sm font-medium text-gray-900">Active</label>
                    </div>
                  </div>
                  <hr />
                  <div className="mt-4 sm:flex sm:flex-row-reverse px-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setIsOpen(null)}
                      ref={cancelButtonRef}
                    >
                      Close
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
