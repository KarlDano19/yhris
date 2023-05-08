import { Dispatch, Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { T_DocumentsModal } from '@/types/globals'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type FormValues = {
    template: string;
    email: string;
    message: string;
};

const templates = [
    {
        name: 'Please Sign: Offboarding Documents',
        message: `A blessed day!

        Thank you for your contribution in ABBA-YAHSHUA.
        
        To move forward with your separation, please sign the ABBA-YAHSHUA offboarding documents attached on or before 5:30 PM today.
        
        Let us know if you have any questions.
        Thank you and GOD bless,
        --
        `,
    },
    {
        name: 'Please Sign: Quitclaim',
        message: `A blessed day!

        Thank you for your full cooperation in our offboarding process.
        
        To move forward with your separation, please sign the quitclaim attached on or before 5:30 PM today.
        
        Let us know if you have any questions.
        Thank you and GOD bless,
        --        
        `,
    }
];

export default function QuitclaimModal({ separationItems, setSeparationItems, isOpen, setIsOpen }: { separationItems: any, setSeparationItems: any, isOpen: T_DocumentsModal | null, setIsOpen: Dispatch<T_DocumentsModal | null> }) {
    const { register, handleSubmit, reset, watch, formState: { isDirty }, setValue } = useForm<FormValues>({ defaultValues: { template: 'Please Sign: Quitclaim', message: templates[1].message } });
    const onSubmit = handleSubmit((data) => {
        if(isOpen && isOpen.id) {
            const itemIndex = separationItems.findIndex((item: any) => item.id === isOpen.id);
            const separationItemsCopy = JSON.parse(JSON.stringify(separationItems));
            separationItemsCopy[itemIndex].quitclaim.template = data.template;
            separationItemsCopy[itemIndex].quitclaim.to = data.email;
            separationItemsCopy[itemIndex].quitclaim.message = data.message;
            separationItemsCopy[itemIndex].isQuitclaimSigned = true;
            separationItemsCopy[itemIndex].isQuitclaimReceived = true;
            separationItemsCopy[itemIndex].quitclaimReceivedDate = new Intl.DateTimeFormat('en-US').format(new Date());
            setSeparationItems([...separationItemsCopy]);
            toast.success('Successfully sent quitclaim', { duration: 4000 });
            reset();
            setIsOpen(null);
        } else {
            toast.error('Incomplete information', { duration: 4000 });
        }
    });
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
                                        <h3 className="flex-1 text-white ml-2 font-semibold">Send Documents via Email</h3>
                                        <XCircleIcon className="w-8 h-8 text-white cursor-pointer" onClick={() => setIsOpen(null)} />
                                    </div>
                                    <form onSubmit={onSubmit}>
                                        <div className="px-4 pt-4 pb-6">
                                            <div className="sm:col-span-4">
                                                <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Email Template<span className="text-red-600">*</span>
                                                </label>
                                                <div className="mt-2">
                                                    <select
                                                        id="template"
                                                        {...register("template", { required: true })}
                                                        className="block w-full rounded-md border-0 py-2 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                        onChange={(e) => {
                                                            const currTemplate = templates.find((template) => template.name === e.target.value);
                                                            setValue('message', currTemplate ? currTemplate?.message : "")
                                                        }}
                                                    >
                                                        <option value="">Select...</option>
                                                        <option>Please Sign: Offboarding Documents</option>
                                                        <option>Please Sign: Quitclaim</option>
                                                    </select>
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
        </>
    )
}
