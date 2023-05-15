import { Dispatch, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { T_CreateJob } from "@/types/globals";
import DateCalendarDummy from "@/svg/DateCalendarDummy";
import SelectChevronDown from "@/svg/SelectChevronDownDummy";
// import useAddSeparationItems from '../hooks/useAddSeparationItems';

export default function CreateJobModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  // const { mutate, isLoading } = useAddSeparationItems();
  const { register, handleSubmit, watch } = useForm<T_CreateJob>({
    defaultValues: {
      country: "Philippines",
      language: "English",
      jobType: {
        fullTime: false,
        partTime: false,
        internship: false,
        projectBased: false,
        other: false,
      },
    },
  });

  const dateInputRef = useRef(null);
  const cancelButtonRef = useRef(null);

  const onSubmit = handleSubmit((data: T_CreateJob) => {
    console.log(data);

    // const callbackReq = {
    //     onSuccess: (data: any) => {
    //         toast.custom(() => <CustomToast message="Successfully created separation." type="success" />, { duration: 5000 });
    //     },
    //     onError: (err: any) => {
    //         toast.custom(() => <CustomToast message={err} type="error" />, { duration: 7000 });
    //     },
    // }
    // mutate(data, callbackReq)
    // const newItem = {
    //     id: separationItems.length + 1,
    //     separationDate: Intl.DateTimeFormat('en-US').format(new Date(data.date)),
    //     name: data.name,
    //     reasonForLeaving: data.reason,
    //     department: data.department,
    //     position: data.position,
    //     acceptanceLetter: {
    //         date: '',
    //         to: '',
    //         message: '',
    //     },
    //     separationLetter: {
    //         date: '',
    //         to: '',
    //         message: '',
    //     },
    //     isLetterSent: false,
    //     isLetterReceived: false,
    //     letterReceivedDate: "",
    //     isDocumentsSent: false,
    //     isDocumentsReceived: false,
    //     documentReceivedDate: "",
    //     isLastPayReleased: false,
    //     isQuitclaimSigned: false,
    //     isQuitclaimReceived: false,
    //     quitclaimReceivedDate: "",
    // }
    // setSeparationItems([...separationItems, newItem]);
    setIsOpen(false);
    toast.success("Successfully created separation", { duration: 5000 });
  });

  const JobType = [
    { name: "Full Time", item: "fullTime" },
    { name: "Part Time", item: "partTime" },
    { name: "Internship/OJT", item: "internship" },
    { name: "Project-based", item: "projectBased" },
    { name: "Other", item: "other" },
  ];

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setIsOpen}
      >
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Job No. 1
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  />
                </div>
                <form onSubmit={onSubmit}>
                  <div className="px-4 pt-4 pb-6">
                    <div className="sm:col-span-4 mt-4">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Country
                        <span className="text-red-600">*</span>
                      </label>
                      <div className="relative mt-2">
                        <select
                          id="country"
                          {...register("country", { required: true })}
                          className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        >
                          <option>Philippines</option>
                          <option>Indonesia</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                          <SelectChevronDown />
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-4 mt-4">
                      <label
                        htmlFor="language"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Language
                        <span className="text-red-600">*</span>
                      </label>
                      <div className="relative mt-2">
                        <select
                          id="language"
                          {...register("language", { required: true })}
                          className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        >
                          <option>English</option>
                          <option>Chinese</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                          <SelectChevronDown />
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-4 mt-4">
                      <div>
                        <label
                          htmlFor="jobTitle"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Job Title<span className="text-red-600">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            id="jobTitle"
                            {...register("jobTitle", { required: true })}
                            type="text"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-4 mt-4">
                      <label
                        htmlFor="language"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        What is the job type?
                        <span className="text-red-600">*</span>
                      </label>
                      <div className="flex mt-2 gap-6">
                        {JobType.map((job, index) => {
                          const fieldName: any = `jobType.${job.item}`;
                          const fieldValue = watch(fieldName);
                          console.log(fieldValue);

                          return (
                            <div>
                              <label
                                className={`text-sm font-medium leading-6 text-gray-900 shadow-sm ring-1 border-0 ring-inset ring-gray-300 py-3 px-6 rounded-md ${
                                  fieldValue ? "bg-slate-400" : ""
                                }`}
                                htmlFor={`${job.item}`}
                              >
                                {fieldValue ? "✓" : "+"} {job.name}
                              </label>
                              <input
                                id={`${job.item}`}
                                {...register(fieldName, {
                                  required: false,
                                })}
                                type="checkbox"
                                className="hidden"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {watch("jobType.other") && (
                      <div className="sm:col-span-4 mt-4">
                        <div>
                          <label
                            htmlFor="otherJobType"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            If you selected other, please input the job type and
                            add comma after the word if it&#39;s more than one.
                          </label>
                          <div className="mt-2">
                            <input
                              id="otherJobType"
                              {...register("otherJobType", { required: true })}
                              type="text"
                              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {/*
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Department<span className="text-red-600">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            id="department"
                            {...register("department", { required: true })}
                            type="text"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-4">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Date of Incident
                          <span className="text-red-600">*</span>
                        </label>
                        <div className="relative mt-2">
                          <input
                            type="date"
                            {...register("incidentDate", { required: true })}
                            id="incidentDate"
                            className="block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none"
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
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Place of Incident
                          <span className="text-red-600">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            id="incidentPlace"
                            {...register("incidentPlace", { required: true })}
                            type="text"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="sm:col-span-4 mt-4">
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Brief Background<span className="text-red-600">*</span>
                      </label>
                      <div className="mt-2">
                        <textarea
                          rows={4}
                          {...register("briefBackground", { required: true })}
                          id="briefBackground"
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div> */}
                  </div>
                  <hr />
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setIsOpen(false)}
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
