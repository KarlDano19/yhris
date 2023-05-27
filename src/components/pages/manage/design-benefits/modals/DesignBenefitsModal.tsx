import { Dispatch, Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';

type FormValues = {
    title: string;
    email: string;
    purpose: string;
    benefits: string;
    coverage: string;
    eligibility: string;
    cc: string;
    bcc: string;
};

export default function DesignBenefitsModal({ designBenefitsItems, setDesignBenefitsItems, isOpen, setIsOpen }: { designBenefitsItems: any, setDesignBenefitsItems: any, isOpen: boolean | null, setIsOpen: Dispatch<boolean | null> }) {
    const [page, setPage] = useState(1);
    const [isCCOpen, setIsCCOPen] = useState(false);
    const [isBCCOpen, setIsBCCOpen] = useState(false);
    const { register, handleSubmit, reset, trigger, watch, formState: { isDirty }, setValue } = useForm<FormValues>();
    const onSubmit = handleSubmit((data) => {
        const newItem = {
            id: designBenefitsItems.length + 1,
            title: data.title,
            to: data.email,
            purpose: data.purpose,
            benefits: data.benefits,
            coverage: data.coverage,
            eligibility: data.eligibility,
            date: Intl.DateTimeFormat('en-US').format(new Date()),
        }
        setDesignBenefitsItems([...designBenefitsItems, newItem]);
        setIsOpen(false);
        toast.custom(
            () => (
                <CustomToast message="Successfully designed benefits." type="success" />
            ),
            { duration: 5000 }
        );
        reset();
    });
    useEffect(() => {
        if(!isOpen){
            setPage(1);
        }
    }, [isOpen])
    const cancelButtonRef = useRef(null);
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
                                        <h3 className="flex-1 text-white ml-2 font-semibold">Design Benefits</h3>
                                        <XCircleIcon className="w-8 h-8 text-white cursor-pointer" onClick={() => setIsOpen(null)} />
                                    </div>
                                    <form onSubmit={onSubmit}>
                                        {page === 1 ? (
                                            <div className="px-4 pt-4 pb-6">
                                                <div className="sm:col-span-4">
                                                    <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Title<span className="text-red-600">*</span>
                                                    </label>
                                                    <div className="relative mt-2">
                                                        <input
                                                            id="title"
                                                            {...register("title", { required: true })}
                                                            type="text"
                                                            autoComplete="title"
                                                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-4 mt-4">
                                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                                        To<span className="text-red-600">*</span>
                                                    </label>
                                                    <div className="mt-2 flex rounded-md shadow-sm">
                                                        <div className="relative flex flex-grow items-stretch focus-within:z-10">
                                                            <input
                                                                type="email"
                                                                {...register("email", { required: true })}
                                                                id="email"
                                                                className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className={`relative -ml-px inline-flex items-center gap-x-1.5 px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${isCCOpen && 'bg-savoy-blue text-white hover:bg-blue-700'}`}
                                                            onClick={() => setIsCCOPen(!isCCOpen)}
                                                        >
                                                            CC
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${isBCCOpen && 'bg-savoy-blue text-white hover:bg-blue-700'}`}
                                                            onClick={() => setIsBCCOpen(!isBCCOpen)}
                                                        >
                                                            BCC
                                                        </button>
                                                    </div>
                                                </div>
                                                {isCCOpen && (
                                                    <div className="sm:col-span-4 mt-4">
                                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                                            CC
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                id="cc"
                                                                {...register("cc")}
                                                                type="cc"
                                                                autoComplete="email"
                                                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {isBCCOpen && (
                                                    <div className="sm:col-span-4 mt-4">
                                                        <label htmlFor="bcc" className="block text-sm font-medium leading-6 text-gray-900">
                                                            BCC
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                id="bcc"
                                                                {...register("bcc")}
                                                                type="bcc"
                                                                autoComplete="email"
                                                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="sm:col-span-4 mt-4">
                                                    <label htmlFor="purpose" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Purpose<span className="text-red-600">*</span>
                                                    </label>
                                                    <div className="mt-2">
                                                        <textarea
                                                            rows={4}
                                                            {...register("purpose", { required: true })}
                                                            id="purpose"
                                                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-4 mt-4">
                                                    <label htmlFor="benefits" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Benefits<span className="text-red-600">*</span>
                                                    </label>
                                                    <div className="mt-2">
                                                        <textarea
                                                            rows={4}
                                                            {...register("benefits", { required: true })}
                                                            id="benefits"
                                                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="px-4 pt-4 pb-6">
                                                <div className="sm:col-span-4">
                                                    <label htmlFor="coverage" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Coverage<span className="text-red-600">*</span>
                                                    </label>
                                                    <div className="mt-2">
                                                        <textarea
                                                            rows={4}
                                                            {...register("coverage", { required: true })}
                                                            id="coverage"
                                                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-4 mt-4">
                                                    <label htmlFor="eligibility" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Eligibility<span className="text-red-600">*</span>
                                                    </label>
                                                    <div className="mt-2">
                                                        <textarea
                                                            rows={4}
                                                            {...register("eligibility", { required: true })}
                                                            id="eligibility"
                                                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <hr />
                                        {page === 1 ? (
                                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4">
                                                <button
                                                    type="submit"
                                                    className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
                                                    onClick={async () => {
                                                        const title = await trigger("title");
                                                        const email = await trigger("email");
                                                        const purpose = await trigger("purpose");
                                                        const benefits = await trigger("benefits");
                                                        const results = [title, email, purpose, benefits];
                                                        const incomplete = results.some((item: boolean) => !item);
                                                        if(!incomplete) {
                                                            setPage(2)
                                                        }
                                                    }}
                                                >
                                                    Next
                                                </button>
                                            </div>

                                        ) : (
                                            <div className="mt-5 sm:mt-4 sm:flex px-4">
                                                <div className="flex-1">
                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                        onClick={() => setPage(1)}
                                                    >
                                                        Back
                                                    </button>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="flex-none inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
                                                >
                                                    Send
                                                </button>
                                            </div>
                                        )}
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
