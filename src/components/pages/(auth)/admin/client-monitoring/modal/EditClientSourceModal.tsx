'use client';

import { Fragment, useEffect } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useUpdateClientSource } from '../hooks/useUpdateClientSource';

const CLIENT_SOURCE_OPTIONS = ["Direct Client", "RCBC Partner", "GLOBE Partner"];
const PARTNER_OPTIONS: Record<string, string[]> = {
  "RCBC Partner": ["RCBC Bankard", "RCBC Savings Bank", "RCBC Capital"],
  "GLOBE Partner": ["Globe Business", "Globe myBusiness", "TM"],
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  employer: {
    id: number;
    name: string;
    client_source: string;
    partner: string;
  } | null;
};

export default function EditClientSourceModal({ isOpen, onClose, employer }: Props) {
  const { mutate, isLoading } = useUpdateClientSource();
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: { client_source: '', partner: '' },
  });

  const watchedClientSource = watch('client_source');

  useEffect(() => {
    if (isOpen && employer) {
      reset({ client_source: employer.client_source || 'Direct Client', partner: employer.partner || '' });
    }
  }, [isOpen, employer, reset]);

  const onSubmit = handleSubmit((data) => {
    if (!employer) return;
    mutate(
      { employer_id: employer.id, client_source: data.client_source, partner: data.partner },
      {
        onSuccess: () => {
          toast.success('Client info updated successfully.');
          onClose();
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to update.');
        },
      }
    );
  });

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                Edit Client Info — {employer?.name}
              </Dialog.Title>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Source *</label>
                  <Controller
                    control={control}
                    name="client_source"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        onChange={(e) => { field.onChange(e); setValue('partner', ''); }}
                      >
                        {CLIENT_SOURCE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                  />
                </div>

                {PARTNER_OPTIONS[watchedClientSource] && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Partner</label>
                    <Controller
                      control={control}
                      name="partner"
                      render={({ field }) => (
                        <select {...field} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                          <option value="">Select partner…</option>
                          {PARTNER_OPTIONS[watchedClientSource].map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
