import { Dispatch, useRef, useState } from "react";
import SelectChevronDown from "@/svg/SelectChevronDownDummy";
import DateCalendarDummy from "@/svg/DateCalendarDummy";

export default function CreateJobPageTwo({
  register,
  watch,
  setValue,
  setPageNumber,
  setIsSalaryRangeModalOpen,
}: {
  register: any;
  setValue: any;
  watch: any;
  setPageNumber: Dispatch<number>;
  setIsSalaryRangeModalOpen: Dispatch<boolean>;
}) {
  const [otherJobType, setOtherJobType] = useState(false);
  const [otherSchedule, setOtherSchedule] = useState(false);
  const dateInputRef = useRef(null);

  // getting the value of JobType
  const handleJobType = (option: string) => {
    return setValue("jobType", option, { shouldValidate: true });
  };
  // getting the value of Schedule
  const handleSchedule = (option: string) => {
    return setValue("schedule", option, { shouldValidate: true });
  };

  const JobType = [
    { name: "Full Time", item: "fullTime" },
    { name: "Part Time", item: "partTime" },
    { name: "Internship/OJT", item: "internship" },
    { name: "Project-based", item: "projectBased" },
  ];

  const Schedule = [
    { name: "Flexible", item: "flexible" },
    { name: "8 Hours", item: "8 hours" },
    { name: "12 Hours", item: "12 hours" },
    { name: "Night Shift", item: "nightShift" },
  ];
  return (
    <>
      <div className="px-4 pb-6">
        <div className="sm:col-span-4 mt-4">
          <label
            htmlFor="language"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            What is the job type?
            <span className="text-red-600">*</span>
          </label>
          <div className="flex flex-wrap mt-2  space-x-2 md:space-y-0 md:space-x-6">
            {JobType.map((job, index) => {
              return (
                <button
                  key={index}
                  type="button"
                  className={`mt-2 md:mt-0 flex-grow text-sm font-medium leading-6 text-gray-900 shadow-sm ring-1 border-0 ring-inset ring-gray-300 py-3 px-6 rounded-md transition-all ${
                    watch("jobType") == job.item ? "bg-slate-400" : ""
                  }`}
                  onClick={() => {
                    handleJobType(job.item);
                    setOtherJobType(false);
                  }}
                >
                  {watch("jobType") == job.item ? "✓" : "+"} {job.name}
                </button>
              );
            })}
            {/* Other */}
            <button
              type="button"
              className={`mt-2 md:mt-0 flex-grow text-sm font-medium leading-6 text-gray-900 shadow-sm ring-1 border-0 ring-inset ring-gray-300 py-3 px-6 rounded-md transition-all ${
                otherJobType ? "bg-slate-400" : ""
              }`}
              onClick={() => setOtherJobType(!otherJobType)}
            >
              {otherJobType ? "✓" : "+"}
              Other
            </button>
          </div>
        </div>
        {otherJobType && (
          <div className="sm:col-span-4 mt-4">
            <div>
              <label
                htmlFor="otherJobType"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                If you selected other, please input the job type and add comma
                if it&#39;s more than one.
              </label>
              <div className="mt-2">
                <input
                  id="otherJobType"
                  {...register("jobType", {
                    required: true,
                  })}
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        )}
        <div className="sm:col-span-4 mt-4">
          <label
            htmlFor="language"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            What is the schedule for this job?
            <span className="text-red-600">*</span>
          </label>
          <div className="flex flex-wrap mt-2 space-x-2 md:space-y-0 md:space-x-6">
            {Schedule.map((sched, index) => {
              return (
                <button
                  key={index}
                  type="button"
                  className={`mt-2 md:mt-0 flex-grow text-sm font-medium leading-6 text-gray-900 shadow-sm ring-1 border-0 ring-inset ring-gray-300 py-3 px-6 rounded-md transition-all ${
                    watch("schedule") == sched.item ? "bg-slate-400" : ""
                  }`}
                  onClick={() => {
                    handleSchedule(sched.item);
                    setOtherSchedule(false);
                  }}
                >
                  {watch("schedule") == sched.item ? "✓" : "+"} {sched.name}
                </button>
              );
            })}
            {/* Other */}
            <button
              type="button"
              className={`mt-2 md:mt-0 flex-grow text-sm font-medium leading-6 text-gray-900 shadow-sm ring-1 border-0 ring-inset ring-gray-300 py-3 px-6 rounded-md transition-all ${
                otherSchedule ? "bg-slate-400" : ""
              }`}
              onClick={() => setOtherSchedule(!otherSchedule)}
            >
              {otherSchedule ? "✓" : "+"}
              Other
            </button>
          </div>
        </div>
        {otherSchedule && (
          <div className="sm:col-span-4 mt-4">
            <div>
              <label
                htmlFor="otherSchedule"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                If you selected other, please input the job type and add comma
                after the word if it&#39;s more than one.
              </label>
              <div className="mt-2">
                <input
                  id="otherSchedule"
                  {...register("schedule", {
                    required: true,
                  })}
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        )}
        <div className="sm:col-span-4 mt-4">
          <div>
            <label
              htmlFor="hireCount"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              How many people do you want to hire for this opening?
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                id="hireCount"
                {...register("hireCount", {
                  required: true,
                })}
                type="number"
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="sm:col-span-4 mt-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              How soon do you need to hire?
              <span className="text-red-600">*</span>
            </label>
            <div className="relative mt-2">
              <input
                type="date"
                {...register("hireDate", { required: true })}
                id="date"
                className="appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                placeholder="you@example.com"
                aria-describedby="email-optional"
                ref={dateInputRef}
                // @ts-expect-error
                onClick={() => dateInputRef.current.showPicker()}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <DateCalendarDummy />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-between px-4">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
          onClick={() => setIsSalaryRangeModalOpen(true)}
        >
          Next
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={() => setPageNumber(1)}
        >
          Back
        </button>
      </div>
    </>
  );
}
