import { Dispatch, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { T_IncidentReport, T_InvestigationModal } from "@/types/globals";
import SelectChevronDown from "@/svg/SelectChevronDown";
import DateCalendar from "@/svg/DateCalendar";
// import useAddSeparationItems from '../hooks/useAddSeparationItems';

export default function InvestigationModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: T_InvestigationModal | null;
  setIsOpen: Dispatch<T_InvestigationModal | null>;
}) {
  // const { mutate, isLoading } = useAddSeparationItems();
  const { register, handleSubmit } = useForm<T_IncidentReport>();
  const InvestigationDateInputRef = useRef<HTMLInputElement>(null);
  const IncidentDateInputRef = useRef<HTMLInputElement>(null);

  const cancelButtonRef = useRef(null);

  const onSubmit = handleSubmit((data) => {
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
    setIsOpen(null);
    toast.success("Successfully created separation", { duration: 5000 });
  });
  return (
    <Transition.Root show={isOpen ? true : false} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => setIsOpen(null)}
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
                    Investigation Report Template
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={() => setIsOpen(null)}
                  />
                </div>
                <form onSubmit={onSubmit}>
                  <div className="px-4 pt-4 pb-6">
                    <div>
                      <label
                        htmlFor="dateOfInvestigation"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Date of Investigation
                        <span className="text-red-600">*</span>
                      </label>
                      <div className="relative mt-2">
                        <input
                          type="date"
                          {...register("date", { required: true })}
                          id="dateOfInvestigation"
                          className="block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none"
                          aria-describedby="email-optional"
                          ref={InvestigationDateInputRef}
                          onClick={() =>
                            InvestigationDateInputRef.current?.showPicker()
                          }
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                          <DateCalendar />
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-4 mt-4">
                      <label
                        htmlFor="witness"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Witness<span className="text-red-600">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          id="witness"
                          {...register("witness", { required: true })}
                          type="name"
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-4 mt-4">
                      <label
                        htmlFor="presider"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Presider<span className="text-red-600">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          id="presider"
                          {...register("presider", { required: true })}
                          type="name"
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-4 mt-4">
                      <label
                        htmlFor="isAttendHearing"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Did the employee attend the hearing
                        <span className="text-red-600">*</span>
                      </label>
                      <div className="relative mt-2">
                        <select
                          id="isAttendHearing"
                          {...register("isAttendHearing", { required: true })}
                          className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        >
                          <option disabled selected>
                            Select...
                          </option>
                          <option>YES</option>
                          <option>NO</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                          <SelectChevronDown />
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-4 mt-4">
                      <label
                        htmlFor="briefBackground"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Result of Investigation
                        <span className="text-red-600">*</span>
                      </label>
                      <div className="mt-2">
                        <textarea
                          rows={4}
                          {...register("briefBackground", { required: true })}
                          id="briefBackground"
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-4 mt-4">
                      <label
                        htmlFor="decision"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Decision <span className="text-red-600">*</span>
                      </label>
                      <div className="relative mt-2">
                        <select
                          id="decision"
                          {...register("decision", { required: true })}
                          className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        >
                          <option disabled selected>
                            Select...
                          </option>
                          <option>First Warning</option>
                          <option>Second Warning</option>
                          <option>Final Warning</option>
                          <option>1-3 Days Suspension</option>
                          <option>5 Days Suspension</option>
                          <option>Terminate</option>
                          <option>Other...</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                          <SelectChevronDown />
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-4 mt-4">
                      <label
                        htmlFor="other"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        If you selected other, please specify the decision.
                      </label>
                      <div className="mt-2">
                        <input
                          id="other"
                          {...register("other", { required: false })}
                          type="name"
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-4 mt-4">
                      <label
                        htmlFor="attachment"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Attachment<span className="text-red-600">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          id="attachment"
                          {...register("attachment", { required: true })}
                          type="file"
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6  file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
                        />
                      </div>
                    </div>
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
