'use client';

import { Dispatch, Fragment, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import CustomDatePicker from '@/components/CustomDatePicker';
import Pagination from '@/components/Pagination';
import useGetCompletedEvaluationForms from '../hooks/useGetCompletedEvaluationForms';
import useResendCompletionEmail from '../hooks/useResendCompletionEmail';

export default function ResendCompletionEmailModal({
  isOpen,
  setIsOpen,
  selectedEvaluationSchedulerId,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  selectedEvaluationSchedulerId: number | null;
}) {
  const [selectedFormIds, setSelectedFormIds] = useState<Set<number>>(new Set());
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data, isLoading: isLoadingForms } = useGetCompletedEvaluationForms(
    selectedEvaluationSchedulerId,
    {
      dateFrom: dateFrom ? dateFrom.toLocaleDateString('en-CA') : '',
      dateTo: dateTo ? dateTo.toLocaleDateString('en-CA') : '',
      currentPage,
      pageSize,
    },
  );
  const { mutate: resend, isLoading: isResending } = useResendCompletionEmail();

  const completedForms: any[] = data?.data?.records ?? data?.records ?? [];
  const pagination = {
    totalRecords: data?.data?.total_records ?? data?.total_records ?? 0,
    totalPages: data?.data?.total_pages ?? data?.total_pages ?? 1,
  };

  const allSelectedOnPage = completedForms.length > 0 && completedForms.every((f) => selectedFormIds.has(f.id));

  const handleClose = () => {
    setSelectedFormIds(new Set());
    setDateFrom(null);
    setDateTo(null);
    setCurrentPage(1);
    setPageSize(5);
    setIsOpen(false);
  };

  const toggleForm = (id: number) => {
    setSelectedFormIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const togglePageAll = () => {
    if (allSelectedOnPage) {
      setSelectedFormIds((prev) => {
        const next = new Set(prev);
        completedForms.forEach((f) => next.delete(f.id));
        return next;
      });
    } else {
      setSelectedFormIds((prev) => {
        const next = new Set(prev);
        completedForms.forEach((f) => next.add(f.id));
        return next;
      });
    }
  };

  const handlePageChange = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  const handlePageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const handleResend = () => {
    if (selectedFormIds.size === 0 || !selectedEvaluationSchedulerId) return;

    resend(
      {
        evaluation_scheduler_id: selectedEvaluationSchedulerId,
        evaluation_form_ids: Array.from(selectedFormIds),
      },
      {
        onSuccess: (res: any) => {
          toast.custom(
            () => <CustomToast message={res.message || 'Completion email resent successfully.'} type="success" />,
            { duration: 4000 },
          );
          handleClose();
        },
        onError: (err: any) => {
          toast.custom(
            () => <CustomToast message={err.message || 'Failed to resend email.'} type="error" />,
            { duration: 4000 },
          );
        },
      },
    );
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full max-w-lg">
                <div className="bg-white px-6 pt-6 pb-2">
                  <Dialog.Title as="h3" className="text-lg font-bold text-gray-900 mb-1">
                    Resend Completion Email
                  </Dialog.Title>
                  <p className="text-sm text-gray-500 mb-4">
                    Select evaluations below to resend the completion email to the employees and evaluators.
                  </p>

                  {/* Date filters */}
                  <div className="flex gap-3 mb-4">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Date From</label>
                      <div className="relative">
                        <CustomDatePicker
                          id="resend-date-from"
                          selected={dateFrom}
                          maxDate={dateTo ?? undefined}
                          placeholder="MM/DD/YYYY"
                          className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          pickerOnChange={(date: Date | null) => {
                            setDateFrom(date);
                            setCurrentPage(1);
                            setSelectedFormIds(new Set());
                          }}
                          inputOnChange={(date: Date | null) => {
                            setDateFrom(date);
                            setCurrentPage(1);
                            setSelectedFormIds(new Set());
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Date To</label>
                      <div className="relative">
                        <CustomDatePicker
                          id="resend-date-to"
                          selected={dateTo}
                          minDate={dateFrom ?? undefined}
                          placeholder="MM/DD/YYYY"
                          className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          pickerOnChange={(date: Date | null) => {
                            setDateTo(date);
                            setCurrentPage(1);
                            setSelectedFormIds(new Set());
                          }}
                          inputOnChange={(date: Date | null) => {
                            setDateTo(date);
                            setCurrentPage(1);
                            setSelectedFormIds(new Set());
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {isLoadingForms ? (
                    <div className="py-8 flex justify-center">
                      <LoadingSpinner size="lg" color="yellow" />
                    </div>
                  ) : completedForms.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-8">No completed evaluations found.</p>
                  ) : (
                    <>
                      <div className="border rounded-md overflow-hidden">
                        {/* Select current page header */}
                        <label className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b cursor-pointer hover:bg-gray-100">
                          <input
                            type="checkbox"
                            checked={allSelectedOnPage}
                            onChange={togglePageAll}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-semibold text-gray-700">
                            Select All on This Page
                          </span>
                        </label>

                        {/* Rows */}
                        <div className="divide-y divide-gray-100">
                          {completedForms.map((form: any) => (
                            <label
                              key={form.id}
                              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                                selectedFormIds.has(form.id) ? 'bg-blue-50' : ''
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedFormIds.has(form.id)}
                                onChange={() => toggleForm(form.id)}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{form.employee_name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">Score: {form.total_score}</p>
                                <p className="text-xs text-gray-500">
                                  Date: {form.date_of_evaluation
                                    ? new Date(form.date_of_evaluation).toLocaleDateString()
                                    : 'N/A'}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <Pagination
                        pagination={pagination}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                        onPageChange={handlePageChange}
                      />
                    </>
                  )}
                </div>

                <div className="flex justify-between items-center px-6 pb-6 pt-2">
                  <span className="text-sm text-gray-500">
                    {selectedFormIds.size > 0 ? `${selectedFormIds.size} selected` : ''}
                  </span>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={selectedFormIds.size === 0 || isResending}
                      className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      onClick={handleResend}
                    >
                      {isResending && (
                        <svg
                          aria-hidden="true"
                          className="w-4 h-4 animate-spin text-white"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      )}
                      Resend{selectedFormIds.size > 1 ? ` (${selectedFormIds.size})` : ''} Email{selectedFormIds.size > 1 ? 's' : ''}
                    </button>
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
