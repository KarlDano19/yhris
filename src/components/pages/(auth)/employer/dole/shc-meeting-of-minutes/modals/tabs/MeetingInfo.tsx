"use client";

import { useEffect, useState, useMemo } from "react";

import { Controller } from "react-hook-form";

import CustomDatePicker from "@/components/CustomDatePicker";
import EmployeeSelect from "@/components/common/EmployeeSelect";

import { XCircleIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";

export default function MeetingInfo({
  control,
  register, 
  setSelectedTab,
  errors,
  setError,
  clearErrors,
  watch,
}: {
  control: any;
  register: any;
  setSelectedTab: any;
  errors: any;
  setError: any;
  clearErrors: any;
  watch: any;
}) {
  const [employeeSearch, setEmployeeSearch] = useState<string>('');
  
  // Watch the form values for attendees and absentees
  const attendeesValue = watch("attendees");
  const absenteesValue = watch("absentees");
  const selectedAttendees = useMemo(() => attendeesValue || [], [attendeesValue]);
  const selectedAbsentees = useMemo(() => absenteesValue || [], [absenteesValue]);


  useEffect(() => {
    if (selectedAttendees && Array.isArray(selectedAttendees) && selectedAttendees.length > 0) {
      clearErrors("attendees");
    }
  }, [selectedAttendees, clearErrors]);

  useEffect(() => {
    if (selectedAbsentees && Array.isArray(selectedAbsentees) && selectedAbsentees.length > 0) {
      clearErrors("absentees");
    }
  }, [selectedAbsentees, clearErrors]);


  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timeOfMeeting = watch("time_of_meeting");
    const venue = watch("venue");

    if (!timeOfMeeting) {
      const el = document.getElementById("time_of_meeting");
      if (el) el.focus();
      return;
    }
    if (!venue) {
      const el = document.getElementById("venue");
      if (el) el.focus();
      return;
    }

    let hasError = false;
    if (!selectedAttendees || !Array.isArray(selectedAttendees) || selectedAttendees.length === 0) {
      setError("attendees", {
        type: "manual",
        message: "Please select at least one Attendee."
      });
      hasError = true;
    }
    if (hasError) return;

    setSelectedTab(2);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="px-4 pt-4 pb-6">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Date of Meeting
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <Controller
                control={control}
                name="date_of_meeting"
                render={({ field }) => (
                  <CustomDatePicker
                    id="shc-meeting-of-minutes-datepicker"
                    placeholder={"mm/dd/yyyy"}
                    className={
                      "block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none"
                    }
                    selected={field.value ? new Date(field.value) : null}
                    pickerOnChange={(date: any) => field.onChange(date)}
                    inputOnChange={(value: any) => field.onChange(value)}
                    required={true}
                  />
                )}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Time of Meeting
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="time"
                {...register("time_of_meeting", { required: true })}
                id="time_of_meeting"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 [&::-webkit-calendar-picker-indicator]:hidden"
                style={{ WebkitAppearance: 'none' }}
              />
              <div 
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => {
                  const timeInput = document.getElementById('time_of_meeting') as HTMLInputElement;
                  timeInput?.showPicker();
                }}
              >
                <ClockIcon className="h-6 w-6 text-savoy-blue hover:text-indigo-300" />
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="venue"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Venue
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                {...register("venue", { required: true })}
                id="venue"
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h1 className="text-lg font-semibold">Attendance</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
          <div>
            <label
              htmlFor="attendees"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Attendees<span className="text-red-600">*</span>
            </label>
            {errors.attendees && (
              <p className="text-xs text-red-600 mt-1">
                {errors.attendees.message || "Please select at least one Attendee."}
              </p>
            )}
            <EmployeeSelect
              control={control}
              name="attendees"
              label=""
              required={true}
              placeholder="Select attendees..."
              isMulti={true}
              isClearable={false}
              employeeSearch={employeeSearch}
              setEmployeeSearch={setEmployeeSearch}
              excludeValues={selectedAbsentees}
              className=""
              onChange={(selectedOptions: any) => {
                clearErrors("attendees");
              }}
            />
          </div>
          <div>
            <label
              htmlFor="absentees"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Absentees
            </label>
            <EmployeeSelect
              control={control}
              name="absentees"
              label=""
              required={false}
              placeholder="Select absentees..."
              isMulti={true}
              isClearable={false}
              employeeSearch={employeeSearch}
              setEmployeeSearch={setEmployeeSearch}
              excludeValues={selectedAttendees}
              className=""
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="py-4 px-4 text-right">
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
