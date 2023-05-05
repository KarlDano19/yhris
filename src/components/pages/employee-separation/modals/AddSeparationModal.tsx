import { Dispatch, Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/24/solid'

export default function AddSeparationModal({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: Dispatch<boolean> }) {

    const cancelButtonRef = useRef(null)

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setIsOpen}>
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
                                    <h3 className="flex-1 text-white ml-2 font-semibold">Separate</h3>
                                    <XCircleIcon className="w-8 h-8 text-white cursor-pointer" onClick={() => setIsOpen(false)} />
                                </div>
                                <div className="px-4 pt-4 pb-6">
                                    <div className="sm:col-span-4">
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            Date of Separation<span className="text-red-600">*</span>
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="date"
                                                name="date"
                                                id="date"
                                                className="block w-full rounded-md py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                placeholder="you@example.com"
                                                aria-describedby="email-optional"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4 mt-4">
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            Name<span className="text-red-600">*</span>
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="name"
                                                name="name"
                                                type="name"
                                                autoComplete="email"
                                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4 mt-4">
                                        <label htmlFor="position" className="block text-sm font-medium leading-6 text-gray-900">
                                            Position<span className="text-red-600">*</span>
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                id="position"
                                                name="position"
                                                className="block w-full rounded-md border-0 py-2 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                            >
                                                <option>Payroll Consultant</option>
                                                <option>Programmer</option>
                                                <option>QA Analyst</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4 mt-4">
                                        <label htmlFor="department" className="block text-sm font-medium leading-6 text-gray-900">
                                            Department<span className="text-red-600">*</span>
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                id="department"
                                                name="department"
                                                className="block w-full rounded-md border-0 py-2 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                            >
                                                <option>Payroll</option>
                                                <option>Information Technology</option>
                                                <option>Marketing</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4 mt-4">
                                        <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">
                                            Reason of Leaving<span className="text-red-600">*</span>
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                id="reason"
                                                name="reason"
                                                className="block w-full rounded-md border-0 py-2 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                            >
                                                <option>Resignation</option>
                                                <option>Absence Without Leave (AWoL)</option>
                                                <option>Layoff</option>
                                                <option>Termination</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
                                        onClick={() => setIsOpen(false)}
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
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
