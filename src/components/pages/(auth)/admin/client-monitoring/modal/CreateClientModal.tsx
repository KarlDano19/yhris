'use client';

import { Fragment, useEffect } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getCookie } from 'cookies-next';

import { useCreateClient } from '../hooks/useCreateClient';
import useGetActivePartners from '../hooks/useGetActivePartners';

const CLIENT_SOURCE_OPTIONS = ['Direct Client', 'RCBC Partner', 'GLOBE Partner'];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

async function getPlans() {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans/`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch plans.');
  return res.json();
}

export default function CreateClientModal({ isOpen, onClose }: Props) {
  const { mutate, isLoading } = useCreateClient();
  const { data: plans } = useQuery(['plansCache'], getPlans, { refetchOnWindowFocus: false });
  const { data: partners = [] } = useGetActivePartners();

  const { control, register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      company_name: '',
      email: '',
      mobile_number: '',
      client_source: 'Direct Client',
      partner: '',
      plan_id: '',
      is_trial: false,
    },
  });

  const watchedClientSource = watch('client_source');
  const watchedIsTrial = watch('is_trial');

  useEffect(() => {
    if (isOpen) {
      reset({
        company_name: '',
        email: '',
        mobile_number: '',
        client_source: 'Direct Client',
        partner: '',
        plan_id: '',
        is_trial: false,
      });
    }
  }, [isOpen, reset]);

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        company_name: data.company_name,
        email: data.email,
        mobile_number: data.mobile_number || '',
        client_source: data.client_source,
        partner: data.partner || '',
        plan_id: Number(data.plan_id),
        is_trial: data.is_trial,
      },
      {
        onSuccess: () => {
          toast.success('Client created successfully.');
          onClose();
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to create client.');
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
            <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                Add New Client
              </Dialog.Title>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input
                    {...register('company_name', { required: 'Company name is required.' })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="e.g. Acme Corp"
                  />
                  {errors.company_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.company_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    {...register('email', { required: 'Email is required.' })}
                    type="email"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="admin@company.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    {...register('mobile_number')}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="+63..."
                  />
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partner</label>
                  <Controller
                    control={control}
                    name="partner"
                    render={({ field }) => (
                      <select {...field} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                        <option value="">Direct Client (No Partner)</option>
                        {partners.map((p: any) => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan *</label>
                  <Controller
                    control={control}
                    name="plan_id"
                    rules={{ required: 'Plan is required.' }}
                    render={({ field }) => (
                      <select {...field} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                        <option value="">Select plan…</option>
                        {plans?.map((plan: any) => (
                          <option key={plan.id} value={plan.id}>{plan.name}</option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.plan_id && (
                    <p className="text-red-500 text-xs mt-1">{errors.plan_id.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type *</label>
                  <Controller
                    control={control}
                    name="is_trial"
                    render={({ field }) => (
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            checked={field.value === false}
                            onChange={() => field.onChange(false)}
                          />
                          Paid
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            checked={field.value === true}
                            onChange={() => field.onChange(true)}
                          />
                          Trial
                        </label>
                      </div>
                    )}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {watchedIsTrial ? 'Trial period will be activated immediately.' : 'Subscription will be created in Pending status.'}
                  </p>
                </div>

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
                    {isLoading ? 'Creating…' : 'Create Client'}
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
