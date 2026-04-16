'use client';

import { Fragment, useEffect } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getCookie } from 'cookies-next';

import { useRecordPayment } from '../hooks/useRecordPayment';

const PAYMENT_METHOD_OPTIONS = ['Bank Transfer', 'Cheque', 'Cash'] as const;
const PERIODICITY_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];
const DURATION_OPTIONS = [
  { value: 1, label: '1 Year' },
  { value: 2, label: '2 Years' },
  { value: 3, label: '3 Years' },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  employer: { id: number; name: string } | null;
};

async function getPlans() {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans/`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch plans.');
  return res.json();
}

export default function RecordPaymentModal({ isOpen, onClose, employer }: Props) {
  const { mutate, isLoading } = useRecordPayment();
  const { data: plans } = useQuery(['plansCache'], getPlans, { refetchOnWindowFocus: false });

  const { control, register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      plan_id: '',
      periodicity: 'monthly',
      periodicity_duration: null as number | null,
      amount: '',
      payment_method: 'Bank Transfer',
      payor: '',
      reference_number: '',
      notes: '',
    },
  });

  const watchedPeriodicity = watch('periodicity');

  useEffect(() => {
    if (isOpen) {
      reset({
        plan_id: '',
        periodicity: 'monthly',
        periodicity_duration: null,
        amount: '',
        payment_method: 'Bank Transfer',
        payor: '',
        reference_number: '',
        notes: '',
      });
    }
  }, [isOpen, reset]);

  const onSubmit = handleSubmit((data) => {
    if (!employer) return;
    mutate(
      {
        employer_id: employer.id,
        plan_id: Number(data.plan_id),
        periodicity: data.periodicity as 'monthly' | 'yearly',
        periodicity_duration: data.periodicity === 'yearly' ? Number(data.periodicity_duration) : null,
        amount: Number(data.amount),
        payment_method: data.payment_method as 'Bank Transfer' | 'Cheque' | 'Cash',
        payor: data.payor,
        reference_number: data.reference_number,
        notes: data.notes || '',
      },
      {
        onSuccess: () => {
          toast.success('Payment recorded successfully.');
          onClose();
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to record payment.');
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
                Record Payment — {employer?.name}
              </Dialog.Title>

              <form onSubmit={onSubmit} className="space-y-4">
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Periodicity *</label>
                    <Controller
                      control={control}
                      name="periodicity"
                      render={({ field }) => (
                        <select {...field} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                          {PERIODICITY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      )}
                    />
                  </div>

                  {watchedPeriodicity === 'yearly' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                      <Controller
                        control={control}
                        name="periodicity_duration"
                        rules={{ required: 'Duration is required for yearly.' }}
                        render={({ field }) => (
                          <select
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                          >
                            <option value="">Select…</option>
                            {DURATION_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        )}
                      />
                      {errors.periodicity_duration && (
                        <p className="text-red-500 text-xs mt-1">{errors.periodicity_duration.message}</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (PHP) *</label>
                  <input
                    {...register('amount', { required: 'Amount is required.' })}
                    type="number"
                    min="0"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="0"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                  <Controller
                    control={control}
                    name="payment_method"
                    render={({ field }) => (
                      <select {...field} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                        {PAYMENT_METHOD_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payor Name *</label>
                  <input
                    {...register('payor', { required: 'Payor name is required.' })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Name on cheque / bank account"
                  />
                  {errors.payor && (
                    <p className="text-red-500 text-xs mt-1">{errors.payor.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number *</label>
                  <input
                    {...register('reference_number', { required: 'Reference number is required.' })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Cheque no. / Bank reference"
                  />
                  {errors.reference_number && (
                    <p className="text-red-500 text-xs mt-1">{errors.reference_number.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    {...register('notes')}
                    rows={2}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Optional notes…"
                  />
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
                    {isLoading ? 'Saving…' : 'Record Payment'}
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
