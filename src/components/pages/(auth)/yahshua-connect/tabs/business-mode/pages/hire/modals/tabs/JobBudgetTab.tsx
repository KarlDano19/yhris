"use client";

import { useEffect } from "react";

import { Controller } from "react-hook-form";

import CustomDatePicker from "@/components/CustomDatePicker";

import { XCircleIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";

export default function JobBudgetTab({
  control,
  register,
  handleSubmit,
  setSelectedTab,
  setValue,
  watch,
  errors,
  setError,
  clearErrors,
}: {
  control: any;
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
  setValue: any;
  watch: any;
  errors: any;
  setError: any;
  clearErrors: any;
}) {
  // Watch form values
  const budgetType = watch("budgetType") || 'fixed';
  const budgetMin = watch("budgetMin");
  const budgetMax = watch("budgetMax");
  const scheduleStartDate = watch("scheduleStartDate");
  const scheduleEndDate = watch("scheduleEndDate");
  const scheduleTimeFrom = watch("scheduleTimeFrom");
  const scheduleTimeTo = watch("scheduleTimeTo");
  const isStrictSchedule = watch("isStrictSchedule");

  useEffect(() => {
    if (scheduleStartDate) {
      clearErrors("scheduleStartDate");
    }
  }, [scheduleStartDate, clearErrors]);

  useEffect(() => {
    if (scheduleEndDate && scheduleStartDate) {
      const startDate = new Date(scheduleStartDate);
      const endDate = new Date(scheduleEndDate);
      if (endDate >= startDate) {
        clearErrors("scheduleEndDate");
      }
    }
  }, [scheduleEndDate, scheduleStartDate, clearErrors]);

  useEffect(() => {
    if (budgetMin && !isNaN(parseFloat(budgetMin)) && parseFloat(budgetMin) > 0) {
      clearErrors("budgetMin");
      if (budgetMax) {
        const minAmount = parseFloat(budgetMin);
        const maxAmount = parseFloat(budgetMax);
        if (!isNaN(maxAmount) && maxAmount > 0 && maxAmount > minAmount) {
          clearErrors("budgetMax");
        }
      }
    }
  }, [budgetMin, budgetMax, clearErrors]);

  const onSubmit = handleSubmit(() => {
    const scheduleStartDateValue = watch("scheduleStartDate");
    const scheduleEndDateValue = watch("scheduleEndDate");
    const budgetMinValue = watch("budgetMin");
    const budgetMaxValue = watch("budgetMax");

    let hasError = false;

    if (!scheduleStartDateValue) {
      setError("scheduleStartDate", {
        type: "manual",
        message: "Contract start date is required"
      });
      hasError = true;
    }

    // Validate end date is not before start date
    if (scheduleStartDateValue && scheduleEndDateValue) {
      const startDate = new Date(scheduleStartDateValue);
      const endDate = new Date(scheduleEndDateValue);
      if (endDate < startDate) {
        setError("scheduleEndDate", {
          type: "manual",
          message: "End date cannot be before start date"
        });
        hasError = true;
      }
    }

    if (!budgetMinValue || !budgetMinValue.trim()) {
      setError("budgetMin", {
        type: "manual",
        message: "Minimum amount is required"
      });
      hasError = true;
    } else {
      const minAmount = parseFloat(budgetMinValue.trim());
      if (isNaN(minAmount) || minAmount <= 0) {
        setError("budgetMin", {
          type: "manual",
          message: "Minimum amount must be a valid positive number"
        });
        hasError = true;
      } else if (budgetMaxValue && budgetMaxValue.trim()) {
        const maxAmount = parseFloat(budgetMaxValue.trim());
        if (isNaN(maxAmount) || maxAmount <= 0) {
          setError("budgetMax", {
            type: "manual",
            message: "Maximum amount must be a valid positive number"
          });
          hasError = true;
        } else if (maxAmount <= minAmount) {
          setError("budgetMax", {
            type: "manual",
            message: "Maximum amount must be greater than minimum amount"
          });
          hasError = true;
        }
      }
    }

    if (hasError) return;

    setSelectedTab(3);
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="px-4 pt-4 pb-16 md:pb-6">
        <div className={`hidden rounded-md bg-red-50 p-4 mb-3`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                You cannot proceed due to incomplete fields. Please review.
              </h3>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {/* Budget Type */}
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Budget Type
              <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setValue("budgetType", "fixed")}
                className={`flex-1 px-4 py-2 rounded-lg border text-sm transition-colors ${
                  budgetType === 'fixed'
                    ? 'border-savoy-blue text-savoy-blue bg-savoy-blue/5'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                Fixed Rate
              </button>
              <button
                type="button"
                onClick={() => setValue("budgetType", "hourly")}
                className={`flex-1 px-4 py-2 rounded-lg border text-sm transition-colors ${
                  budgetType === 'hourly'
                    ? 'border-savoy-blue text-savoy-blue bg-savoy-blue/5'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                Hourly Rate
              </button>
            </div>
          </div>

          {/* Budget Amounts */}
          <div className={`grid gap-4 ${budgetType === 'fixed' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div>
              <label htmlFor="budgetMin" className="block text-sm font-medium leading-6 text-gray-900">
                {budgetType === 'fixed' ? 'Min Amount (₱)' : 'Hourly Rate (₱)'}
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("budgetMin", { required: true })}
                  id="budgetMin"
                  placeholder={budgetType === 'fixed' ? '500' : 'e.g. 150'}
                  className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6 ${
                    errors.budgetMin ? 'ring-red-500' : ''
                  }`}
                />
                {errors.budgetMin && (
                  <p className="mt-1 text-sm text-red-600">{errors.budgetMin.message || (budgetType === 'fixed' ? "Minimum amount is required" : "Hourly rate is required")}</p>
                )}
              </div>
            </div>
            {/* Max Amount - Only shown for fixed rate jobs */}
            {budgetType === 'fixed' && (
              <div>
                <label htmlFor="budgetMax" className="block text-sm font-medium leading-6 text-gray-900">
                  Max Amount (₱)
                  <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <div className="relative mt-2">
                  <input
                    type="text"
                    {...register("budgetMax")}
                    id="budgetMax"
                    placeholder="Enter amount"
                    className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6 ${
                      errors.budgetMax ? 'ring-red-500' : ''
                    }`}
                  />
                  {errors.budgetMax && (
                    <p className="mt-1 text-sm text-red-600">{errors.budgetMax.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Contract Period
              <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {/* Start Date Column */}
              <div className="flex flex-col">
                <div className="mb-3">
                  <label htmlFor="scheduleStartDate" className="block text-xs text-gray-600 mb-1">
                    Start Date
                    <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="scheduleStartDate"
                    render={({ field }) => (
                      <div className="relative">
                        <CustomDatePicker
                          id="scheduleStartDate"
                          placeholder="mm/dd/yyyy"
                          className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6 ${
                            errors.scheduleStartDate ? 'ring-red-500' : ''
                          }`}
                          selected={field.value ? new Date(field.value) : null}
                          minDate={new Date()}
                          pickerOnChange={(date: Date | null) => {
                            if (date) {
                              const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                              field.onChange(formattedDate);
                            } else {
                              field.onChange('');
                            }
                          }}
                          inputOnChange={(value: any) => {
                            if (value && typeof value === 'string') {
                              field.onChange(value);
                            }
                          }}
                        />
                      </div>
                    )}
                  />
                  <div className="h-[33px] flex items-start">
                    {errors.scheduleStartDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.scheduleStartDate.message}</p>
                    )}
                  </div>
                </div>

                {budgetType === 'hourly' && (
                  <div>
                    <label htmlFor="scheduleTimeFrom" className="block text-xs text-gray-600 mb-1">
                      Time From
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        {...register("scheduleTimeFrom")}
                        id="scheduleTimeFrom"
                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6 [&::-webkit-calendar-picker-indicator]:hidden"
                        style={{ WebkitAppearance: 'none' }}
                      />
                      <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        onClick={() => {
                          const timeInput = document.getElementById('scheduleTimeFrom') as HTMLInputElement;
                          timeInput?.showPicker();
                        }}
                      >
                        <ClockIcon className="h-5 w-5 text-savoy-blue hover:text-indigo-300" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* End Date Column */}
              <div className="flex flex-col">
                <div className="mb-3">
                  <label htmlFor="scheduleEndDate" className="block text-xs text-gray-600 mb-1">
                    End Date
                    <span className="text-gray-500 text-xs">(optional)</span>
                  </label>
                  <Controller
                    control={control}
                    name="scheduleEndDate"
                    render={({ field }) => (
                      <div className="relative">
                        <CustomDatePicker
                          id="scheduleEndDate"
                          placeholder="mm/dd/yyyy"
                          className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6 ${
                            errors.scheduleEndDate ? 'ring-red-500' : ''
                          }`}
                          selected={field.value ? new Date(field.value) : null}
                          pickerOnChange={(date: Date | null) => {
                            if (date) {
                              const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                              field.onChange(formattedDate);
                            } else {
                              field.onChange('');
                            }
                          }}
                          inputOnChange={(value: any) => {
                            if (value && typeof value === 'string') {
                              field.onChange(value);
                            }
                          }}
                          minDate={scheduleStartDate ? new Date(scheduleStartDate) : undefined}
                        />
                      </div>
                    )}
                  />
                  <div className="h-[33px] flex items-start">
                    {errors.scheduleEndDate ? (
                      <p className="mt-1 text-sm text-red-600">{errors.scheduleEndDate.message}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Leave blank for flexible/ongoing contract</p>
                    )}
                  </div>
                </div>

                {budgetType === 'hourly' && (
                  <div>
                    <label htmlFor="scheduleTimeTo" className="block text-xs text-gray-600 mb-1">
                      Time To
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        {...register("scheduleTimeTo")}
                        id="scheduleTimeTo"
                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6 [&::-webkit-calendar-picker-indicator]:hidden"
                        style={{ WebkitAppearance: 'none' }}
                      />
                      <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        onClick={() => {
                          const timeInput = document.getElementById('scheduleTimeTo') as HTMLInputElement;
                          timeInput?.showPicker();
                        }}
                      >
                        <ClockIcon className="h-5 w-5 text-savoy-blue hover:text-indigo-300" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hourly Rate Options */}
          {budgetType === 'hourly' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-red-600 mb-3">Hourly Rate Settings</h4>

              <div className="ml-4 space-y-3">
                {/* Strict Schedule Toggle */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Enforce Strict Schedule
                    </label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Workers must clock in/out within the scheduled time window. Late arrivals and early departures will result in pay deductions.
                    </p>
                  </div>
                  <Controller
                    control={control}
                    name="isStrictSchedule"
                    defaultValue={false}
                    render={({ field }) => (
                      <button
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-savoy-blue focus:ring-offset-2 ${
                          field.value ? 'bg-savoy-blue' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            field.value ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    )}
                  />
                </div>

                {/* Clock In/Out Time Window Settings - Only shown when Strict Schedule is enabled */}
                {isStrictSchedule && (
                  <div className="ml-4 p-3 bg-white rounded-lg border border-gray-200">
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Clock In/Out Time Window</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="clockInMinutesBefore" className="block text-xs text-gray-600 mb-1">
                          Allow clock in before start time
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            {...register("clockInMinutesBefore")}
                            id="clockInMinutesBefore"
                            defaultValue={60}
                            min={0}
                            max={180}
                            className="block w-20 rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6"
                          />
                          <span className="text-sm text-gray-600">minutes</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Workers can clock in this many minutes before the scheduled start time
                        </p>
                      </div>
                      <div>
                        <label htmlFor="clockOutMinutesAfter" className="block text-xs text-gray-600 mb-1">
                          Allow clock out after end time
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            {...register("clockOutMinutesAfter")}
                            id="clockOutMinutesAfter"
                            defaultValue={60}
                            min={0}
                            max={180}
                            className="block w-20 rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6"
                          />
                          <span className="text-sm text-gray-600">minutes</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Workers can clock out up to this many minutes after the scheduled end time
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Daily Progress Required Toggle */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Require Daily Progress Report
                    </label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Workers must submit a daily progress report after clocking out each day.
                    </p>
                  </div>
                  <Controller
                    control={control}
                    name="isDailyProgressRequired"
                    defaultValue={false}
                    render={({ field }) => (
                      <button
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-savoy-blue focus:ring-offset-2 ${
                          field.value ? 'bg-savoy-blue' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            field.value ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    )}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <hr />
      <div className="flex justify-between py-4 px-4">
        <button
          type="button"
          className="w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setSelectedTab(1)}
        >
          Back
        </button>
        <button
          type="submit"
          className="w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Next
        </button>
      </div>
    </form>
  );
}