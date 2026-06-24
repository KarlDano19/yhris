'use client';

import { useState, useEffect, useRef, Dispatch, Fragment } from 'react';

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import { XCircleIcon } from '@heroicons/react/24/solid';

import useUpdatePartner from '../hooks/useUpdatePartner';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]+$/;

type T_ModalData = {
  id: number;
  open: boolean;
  name?: string;
  emails?: string[];
  phones?: string[];
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
  const { register, handleSubmit, reset, control, setError, clearErrors, formState: { errors } } = useForm<any>();
  const { mutate, isLoading } = useUpdatePartner();
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      reset({
        name: isOpen.name || '',
        is_active: isOpen.is_active ?? true,
        emails: (isOpen.emails || []).map((e) => ({ label: e, value: e })),
        phones: (isOpen.phones || []).map((p) => ({ label: p, value: p })),
      });
    }
  }, [isOpen, reset]);

  const onSubmit = handleSubmit((data) => {
    const emails: string[] = (data.emails || []).map((item: any) => item.value);
    if (emails.length === 0) {
      setError('emails', { type: 'manual', message: 'At least one email is required.' });
      return;
    }
    clearErrors('emails');
    const phones: string[] = (data.phones || []).map((item: any) => item.value);
    mutate(
      { id: isOpen.id, data: { name: data.name, is_active: data.is_active, email: emails, phone: phones } },
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
    <Transition show={!!isOpen?.open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setIsOpen(null)}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
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
                        Email(s) <span className="text-red-600">*</span>
                      </label>
                      <Controller
                        name="emails"
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => (
                          <CreatableSelect
                            {...field}
                            isMulti
                            options={[]}
                            className="mt-1 text-sm"
                            classNamePrefix="select"
                            placeholder="Type an email and press Enter..."
                            isValidNewOption={(inputValue) => EMAIL_REGEX.test(inputValue.trim())}
                            noOptionsMessage={({ inputValue }) =>
                              inputValue && !EMAIL_REGEX.test(inputValue.trim()) ? 'Invalid email format' : null
                            }
                            onInputChange={(val) => setEmailInput(val)}
                            onKeyDown={(e) => {
                              if (['Enter', 'Tab'].includes(e.key) && emailInput.trim() && !EMAIL_REGEX.test(emailInput.trim())) {
                                toast.custom(() => <CustomToast message="Invalid email format. Please enter a valid email address." type="error" />, { duration: 3000 });
                              }
                            }}
                            formatCreateLabel={(input) => `Add "${input}"`}
                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              multiValue: (provided) => ({
                                ...provided,
                                backgroundColor: '#eff6ff',
                                borderRadius: '6px',
                                border: '1.5px solid rgba(29, 78, 216, 0.1)',
                              }),
                              multiValueLabel: (provided) => ({
                                ...provided,
                                color: '#305ddb',
                                fontSize: '12px',
                                fontWeight: '500',
                              }),
                              multiValueRemove: (provided) => ({
                                ...provided,
                                color: '#2353d9',
                                padding: '2px',
                                borderRadius: '2px',
                                ':hover': {
                                  backgroundColor: 'rgba(29, 78, 216, 0.2)',
                                  color: '#305ddb',
                                },
                              }),
                            }}
                          />
                        )}
                      />
                      {errors.emails && (
                        <p className="mt-1 text-xs text-red-500">{(errors.emails as any).message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Phone(s) <span className="text-red-600">*</span>
                      </label>
                      <Controller
                        name="phones"
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => (
                          <CreatableSelect
                            {...field}
                            isMulti
                            options={[]}
                            className="mt-1 text-sm"
                            classNamePrefix="select"
                            placeholder="Type a phone number and press Enter..."
                            isValidNewOption={(inputValue) => PHONE_REGEX.test(inputValue.trim())}
                            noOptionsMessage={({ inputValue }) =>
                              inputValue && !PHONE_REGEX.test(inputValue.trim())
                                ? 'Numbers only (e.g. +63 912 345 6789)'
                                : null
                            }
                            onInputChange={(val) => setPhoneInput(val)}
                            onKeyDown={(e) => {
                              if (['Enter', 'Tab'].includes(e.key) && phoneInput.trim() && !PHONE_REGEX.test(phoneInput.trim())) {
                                toast.custom(() => <CustomToast message="Invalid phone number. Use digits, +, -, spaces, or parentheses only." type="error" />, { duration: 3000 });
                              }
                            }}
                            formatCreateLabel={(input) => `Add "${input}"`}
                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              multiValue: (provided) => ({
                                ...provided,
                                backgroundColor: '#eff6ff',
                                borderRadius: '6px',
                                border: '1.5px solid rgba(29, 78, 216, 0.1)',
                              }),
                              multiValueLabel: (provided) => ({
                                ...provided,
                                color: '#305ddb',
                                fontSize: '12px',
                                fontWeight: '500',
                              }),
                              multiValueRemove: (provided) => ({
                                ...provided,
                                color: '#2353d9',
                                padding: '2px',
                                borderRadius: '2px',
                                ':hover': {
                                  backgroundColor: 'rgba(29, 78, 216, 0.2)',
                                  color: '#305ddb',
                                },
                              }),
                            }}
                          />
                        )}
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
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
