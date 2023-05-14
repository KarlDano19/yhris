import { Dispatch, Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { T_Separation } from '@/types/globals';
import SelectChevronDown from '@/svg/SelectChevronDown';
import DateCalendar from '@/svg/DateCalendar';
import useAddSeparationItems from '../hooks/useAddSeparationItems';
import CustomToast from '@/components/CustomToast';

export default function AddSeparationModal({ separationItems, departmentItems, employeeItems, positionItems, setSeparationItems, isOpen, setIsOpen }: { separationItems: any, departmentItems: any, employeeItems: any, positionItems: any, setSeparationItems: any, isOpen: boolean, setIsOpen: Dispatch<boolean> }) {
    const { mutate, isLoading } = useAddSeparationItems();
    const { register, handleSubmit } = useForm<T_Separation>();
    const dateInputRef = useRef(null);
    const cancelButtonRef = useRef(null)
    const onSubmit = handleSubmit((data) => {
        const callbackReq = {
            onSuccess: (data: any) => {
                toast.custom(() => <CustomToast message="Successfully created separation." type="success" />, { duration: 5000 });
            },
            onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type="error" />, { duration: 7000 });
            },
        }
        mutate(data, callbackReq)
        const newItem = {
            id: separationItems.length + 1,
            separationDate: Intl.DateTimeFormat('en-US').format(new Date(data.date)),
            name: data.name,
            reasonForLeaving: data.reason,
            department: data.department,
            position: data.position,
            acceptanceLetter: {
                date: '',
                to: '',
                message: '',
            },
            separationLetter: {
                date: '',
                to: '',
                message: '',
            },
            isLetterSent: false,
            isLetterReceived: false,
            letterReceivedDate: "",
            isDocumentsSent: false,
            isDocumentsReceived: false,
            documentReceivedDate: "",
            isLastPayReleased: false,
            isQuitclaimSigned: false,
            isQuitclaimReceived: false,
            quitclaimReceivedDate: "",
        }
        setSeparationItems([...separationItems, newItem]);
        setIsOpen(false);
        toast.success('Successfully created separation', { duration: 5000 });
    });
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
                                <form onSubmit={onSubmit}>
                                    <div className="px-4 pt-4 pb-6">
                                        <div className="sm:col-span-4">
                                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                                Date of Separation<span className="text-red-600">*</span>
                                            </label>
                                            <div className="relative mt-2">
                                                <input
                                                    type="date"
                                                    {...register("date", { required: true })}
                                                    id="date"
                                                    className="block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none"
                                                    aria-describedby="email-optional"
                                                    ref={dateInputRef}
                                                    // @ts-expect-error
                                                    onClick={() => dateInputRef.current.showPicker()}
                                                />
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                                    <DateCalendar />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sm:col-span-4 mt-4">
                                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                                Name<span className="text-red-600">*</span>
                                            </label>
                                            <div className="relative mt-2">
                                                <select
                                                    id="position"
                                                    {...register("name", { required: true })}
                                                    className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                >
                                                    <option value="">Select...</option>
                                                    {
                                                        employeeItems.map((item: any) => {
                                                            return (
                                                                <option key={item.id} value={item.id}>{`${item.firstname} ${item.lastname}`}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                                    <SelectChevronDown />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sm:col-span-4 mt-4">
                                            <label htmlFor="position" className="block text-sm font-medium leading-6 text-gray-900">
                                                Position<span className="text-red-600">*</span>
                                            </label>
                                            <div className="relative mt-2">
                                                <select
                                                    id="position"
                                                    {...register("position", { required: true })}
                                                    className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                >
                                                    <option value="">Select...</option>
                                                    {
                                                        positionItems.map((item: any) => {
                                                            return (
                                                                <option key={item.id} value={item.id}>{item.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                                    <SelectChevronDown />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sm:col-span-4 mt-4">
                                            <label htmlFor="department" className="block text-sm font-medium leading-6 text-gray-900">
                                                Department<span className="text-red-600">*</span>
                                            </label>
                                            <div className="relative mt-2">
                                                <select
                                                    id="department"
                                                    {...register("department", { required: true })}
                                                    className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                >
                                                    <option value="">Select...</option>
                                                    {
                                                        departmentItems.map((item: any) => {
                                                            return (
                                                                <option key={item.id} value={item.id}>{item.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                                    <SelectChevronDown />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sm:col-span-4 mt-4">
                                            <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">
                                                Reason of Leaving<span className="text-red-600">*</span>
                                            </label>
                                            <div className="relative mt-2">
                                                <select
                                                    id="reason"
                                                    {...register("reason", { required: true })}
                                                    className="appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                >
                                                    <option value="">Select...</option>
                                                    <option>Resignation</option>
                                                    <option>Absence Without Leave (AWoL)</option>
                                                    <option>Layoff</option>
                                                    <option>Termination</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                                    <SelectChevronDown />
                                                </div>
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
    )
}
