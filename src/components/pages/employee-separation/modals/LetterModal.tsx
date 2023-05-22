import { Dispatch, Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { T_LetterModal } from '@/types/globals'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ConfirmModal from '../../../ConfirmModal';
import CustomToast from '@/components/CustomToast';
import DateCalendar from '@/svg/DateCalendar';

type FormValues = {
    date: string;
    email: string;
    message: string;
};

export default function LetterModal({ separationItems, setSeparationItems, type = 'Acceptance', isOpen, setIsOpen }: { separationItems: any, setSeparationItems: any, type?: 'Acceptance' | 'Separation', isOpen: T_LetterModal | null, setIsOpen: Dispatch<T_LetterModal | null> }) {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [toSaveData, setToSaveData] = useState<any>(null);
    const { register, handleSubmit, reset, setValue } = useForm<FormValues>();
    const onSubmit = handleSubmit((data) => {
        if (isOpen && isOpen.id) {
            const itemIndex = separationItems.findIndex((item: any) => item.id === isOpen.id);
            const separationItemsCopy = JSON.parse(JSON.stringify(separationItems));
            separationItemsCopy[itemIndex][type === "Acceptance" ? 'acceptanceLetter' : 'separationLetter'].date = data.date;
            separationItemsCopy[itemIndex][type === "Acceptance" ? 'acceptanceLetter' : 'separationLetter'].to = data.email;
            separationItemsCopy[itemIndex][type === "Acceptance" ? 'acceptanceLetter' : 'separationLetter'].message = data.message;
            separationItemsCopy[itemIndex].isLetterSent = true;
            separationItemsCopy[itemIndex].isLetterReceived = true;
            separationItemsCopy[itemIndex].letterReceivedDate = new Intl.DateTimeFormat('en-US').format(new Date());
            setToSaveData([...separationItemsCopy]);
            setIsOpen(null);
            setIsConfirmModalOpen(true);
        } else {
            toast.custom(() => <CustomToast message="Incomplete information." type="error" />, { duration: 4000 });
        }
    });
    const saveData = () => {
        setSeparationItems([...toSaveData]);
        toast.custom(() => <CustomToast message="Successfully sent email." type="success" />, { duration: 4000 });
        reset();
    }
    const updateConfirmModal = (value: boolean) => {
        if (!value) {
            setIsConfirmModalOpen(false);
            reset();
        }
    }
    const cancelButtonRef = useRef(null)
    return (
        <>
            <Transition.Root show={isOpen ? true : false} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setIsOpen(null)}>
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
                                        <h3 className="flex-1 text-white ml-2 font-semibold">Letter of {type}</h3>
                                        <XCircleIcon className="w-8 h-8 text-white cursor-pointer" onClick={() => setIsOpen(null)} />
                                    </div>
                                    <form onSubmit={onSubmit}>
                                        <div className="px-4 pt-4 pb-6">
                                            <div className="sm:col-span-4">
                                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Date<span className="text-red-600">*</span>
                                                </label>
                                                <div className="relative mt-2">
                                                    <input
                                                        type="date"
                                                        onChange={(e) => setValue('date', Intl.DateTimeFormat('en-US').format(new Date(e.target.value)))}
                                                        required
                                                        id="date"
                                                        className="appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                        placeholder="you@example.com"
                                                        aria-describedby="email-optional"
                                                    />
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <DateCalendar />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="sm:col-span-4 mt-4">
                                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                                    To<span className="text-red-600">*</span>
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        id="email"
                                                        {...register("email", { required: true })}
                                                        type="email"
                                                        autoComplete="email"
                                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                            <div className="sm:col-span-4 mt-4">
                                                <label htmlFor="message" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Message<span className="text-red-600">*</span>
                                                </label>
                                                <div className="mt-2">
                                                    <textarea
                                                        rows={4}
                                                        {...register("message", { required: true })}
                                                        id="message"
                                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                                                        defaultValue={''}
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
                                                Send
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
            <ConfirmModal message="Would you like to send the letter of acceptance?" isOpen={isConfirmModalOpen} setIsOpen={updateConfirmModal} confirmAction={saveData} />
        </>
    )
}
