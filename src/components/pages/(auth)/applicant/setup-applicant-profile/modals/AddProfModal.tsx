"use client";

import { Fragment, useRef } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { useFormContext, useFieldArray, useForm} from "react-hook-form";

import { XCircleIcon } from "@heroicons/react/24/solid";
import DateCalendar from "@/svg/DateCalendar";



interface AddProfModalProps {
  open: boolean;
  onSave: () => void;
  onClose: () => void;
}

const AddProfModal = ({ open, onSave, onClose }: AddProfModalProps) => {
  const fromInputRef1 = useRef(null);
  const fromInputRef2 = useRef(null);
  const {register,control} = useForm()
  const {fields} = useFieldArray({
    control,
    name:"exprerience"
  })
  
  return (
    
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className={`relative z-10 `}
        onClose={onClose}
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-sm">
                <div className="header bg-savoy-blue rounded-md flex justify-between px-4 py-2">
                  <h6 className="text-white font-medium">Job 1</h6>
                  <button onClick={onClose}>
                    <XCircleIcon className="h-7 w-7 text-white" />
                  </button>
                </div>
                
                <div className="content px-4 pb-4 pt-5">
                  <div>
                    <label
                      htmlFor="position"
                      className="block text-sm text-indigo-dye font-medium leading-6 text-gray-900"
                    >
                      Position
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register("exprerience.0.position")}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="company-name"
                      className="block text-sm text-indigo-dye font-medium leading-6 text-gray-900"
                    >
                      Company Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register("exprerience.0.companyName")}
                        className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>
                    <h6 className="mt-4 text-indigo-dye font-bold text-sm">
                      Year/s in the Company
                    </h6>
                    <div className="mt-2">
                      <label
                        htmlFor="from1"
                        className="block text-sm text-indigo-dye font-medium leading-6 text-gray-900"
                      >
                        From
                      </label>
                      <div className="relative mt-2">
                        <input
                          type="date"
                          {...register("exprerience.0.fromYear")}
                          className="appearance-none block w-full rounded-md py-[5.1px] px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          ref={fromInputRef1}
                          // @ts-expect-error
                          onClick={() => fromInputRef1.current.showPicker()}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <DateCalendar />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <label
                        htmlFor="from2"
                        className="block text-sm text-indigo-dye font-medium leading-6 text-gray-900"
                      >
                        To
                      </label>
                      <div className="relative mt-2">
                        <input
                          type="date"
                          {...register("exprerience.0.toYear")}
                          className="appearance-none block w-full rounded-md py-[5.1px] px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          ref={fromInputRef2}
                          // @ts-expect-error
                          onClick={() => fromInputRef2.current.showPicker()}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <DateCalendar />
                        </div>
                      </div>
                      <div className="mt-2">
                        <label
                          htmlFor="major-roles"
                          className="block text-sm text-indigo-dye font-medium leading-6 text-gray-900"
                        >
                          Major Roles
                        </label>
                        <textarea
                          rows={4}
                          {...register("exprerience.0.majorRoles")}
                          className="block w-full mt-2 rounded-md border-0 p-[13.5px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                          defaultValue={""}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-300 mt-3">
                  <div className="flex justify-end p-4 space-x-5">
                    <button
                      type="button"
                      className="inline-flex w-full md:w-auto justify-center rounded-md bg-[#ACB9CB] px-7 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300"
                      tabIndex={-1}
                      onClick={onClose}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="inline-flex w-full md:w-auto justify-center rounded-md bg-savoy-blue px-7 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300"
                      tabIndex={-1}
                      onClick={() => {
                        onSave();
                        onClose();
                      }}
                    >
                      Save
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
};

export default AddProfModal;
