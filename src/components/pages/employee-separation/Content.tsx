"use client"
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useState, useRef } from 'react'
import SeparationLetter from './SeparationLetter'
import { T_DocumentsModal, T_LastPayModal, T_LetterModal, T_QuitclaimModal } from '@/types/globals'
import SignDocuments from './SignDocuments'
import LastPay from './LastPay'
import Quitclaim from './Quitclaim'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { separationItems as testData } from '@/helpers/testData'
import AddSeparationModal from './modals/AddSeparationModal'
import LetterModal from './modals/LetterModal'
import SignDocumentsModal from './modals/SignDocumentsModal'
import ConfirmModal from './modals/ConfirmModal'
import toast from 'react-hot-toast';
import QuitclaimModal from './modals/QuitclaimModal'
import CustomToast from '@/components/CustomToast'
import DateCalendar from '@/svg/DateCalendar'
// import useGetSeparationItems from './hooks/useGetSeparationItems'

const Content = () => {
    // const { data: separationItems, isLoading: isSeparationItemsLoading } = useGetSeparationItems();
    const [separationItems, setSeparationItems] = useState(testData);
    const [filteredItems, setFilteredItems] = useState(testData);
    const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
    const [isAddSeparationModalOpen, setIsAddSeparationModalOpen] = useState(false);
    const [isLetterModalOpen, setIsLetterModalOpen] = useState<T_LetterModal | null>(null);
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState<T_DocumentsModal | null>(null);
    const [isLastPayModalOpen, setIsLastPayModalOpen] = useState<T_LastPayModal | null>(null);
    const [isQuitclaimModalOpen, setIsQuitclaimModalOpen] = useState<T_QuitclaimModal | null>(null);
    const date1InputRef = useRef(null);
    const date2InputRef = useRef(null);
    const releaseLastPay = () => {
        if (isLastPayModalOpen && isLastPayModalOpen.id) {
            const itemIndex = separationItems.findIndex((item: any) => item.id === isLastPayModalOpen.id);
            const separationItemsCopy = JSON.parse(JSON.stringify(separationItems));
            separationItemsCopy[itemIndex].isLastPayReleased = true;
            setSeparationItems([...separationItemsCopy]);
            toast.custom(() => <CustomToast message="Last pay marked as release." type="success" />, { duration: 4000 });
            setIsLastPayModalOpen(null);
        } else {
            toast.custom(() => <CustomToast message="Incomplete information." type="error" />, { duration: 4000 });
        }
    };
    const updateReleaseModal = (value: boolean) => {
        if (!value) {
            setIsLastPayModalOpen(null);
        }
    }

    useEffect(() => {
        if (dateFilter.from && dateFilter.to) {
            const filteredByDate = separationItems.filter(item => {
                let date = new Date(item.separationDate);
                let start = new Date(dateFilter.from);
                let end = new Date(dateFilter.to);
                return date >= end && date <= start;
            });
            setFilteredItems([...filteredByDate])
        }
    }, [dateFilter, separationItems])

    const renderRows = () => {
        if (!dateFilter.from && !dateFilter.to && separationItems && separationItems.length > 0) {
            return separationItems.map((item, index) => (
                <tr key={index}>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {item.separationDate}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <div className="flex gap-2"><span>{item.name}</span> <InformationCircleIcon className="text-yellow-500 h-5 w-5" /></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {item.reasonForLeaving}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top">
                        <SeparationLetter id={item.id} isLetterSent={item.isLetterSent} isLetterReceived={item.isLetterReceived} letterReceivedDate={item.letterReceivedDate} setIsLetterModalOpen={setIsLetterModalOpen} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top">
                        <SignDocuments id={item.id} isDocumentsSent={item.isDocumentsSent} isDocumentsReceived={item.isDocumentsReceived} documentReceivedDate={item.documentReceivedDate} setIsDocumentModalOpen={setIsDocumentModalOpen} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top">
                        <LastPay id={item.id} isLastPayReleased={item.isLastPayReleased} setIsLastPayModalOpen={setIsLastPayModalOpen} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top">
                        <Quitclaim id={item.id} isQuitclaimSigned={item.isQuitclaimSigned} isQuitclaimReceived={item.isQuitclaimReceived} quitclaimReceivedDate={item.quitclaimReceivedDate} setIsQuitclaimModalOpen={setIsQuitclaimModalOpen} />
                    </td>
                </tr>
            ));
        } else if (dateFilter.from && dateFilter.to && filteredItems && filteredItems.length > 0) {
            return filteredItems.map((item, index) => (
                <tr key={index}>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {item.separationDate}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <div className="flex gap-2"><span>{item.name}</span> <InformationCircleIcon className="text-yellow-500 h-5 w-5" /></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {item.reasonForLeaving}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top">
                        <SeparationLetter id={item.id} isLetterSent={item.isLetterSent} isLetterReceived={item.isLetterReceived} letterReceivedDate={item.letterReceivedDate} setIsLetterModalOpen={setIsLetterModalOpen} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top">
                        <SignDocuments id={item.id} isDocumentsSent={item.isDocumentsSent} isDocumentsReceived={item.isDocumentsReceived} documentReceivedDate={item.documentReceivedDate} setIsDocumentModalOpen={setIsDocumentModalOpen} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top">
                        <LastPay id={item.id} isLastPayReleased={item.isLastPayReleased} setIsLastPayModalOpen={setIsLastPayModalOpen} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top">
                        <Quitclaim id={item.id} isQuitclaimSigned={item.isQuitclaimSigned} isQuitclaimReceived={item.isQuitclaimReceived} quitclaimReceivedDate={item.quitclaimReceivedDate} setIsQuitclaimModalOpen={setIsQuitclaimModalOpen} />
                    </td>
                </tr>
            ));
        } else {
            return (
                <tr>
                    <td colSpan={7}>
                        <h4 className="text-center text-gray-300 text-sm mt-4">There{`'`}s no data yet.</h4>
                        <h4 className="text-center text-gray-300 text-sm mb-4">Please click create to add separation of employee.</h4>
                    </td>
                </tr>
            );
        }
    }

    return (
        <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="p-2 md:p-8 lg:p-4">
                    <h2 className="text-xl font-bold text-indigo-dye">Employee Separation</h2>
                    <div className="mt-6 flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-none flex flex-col lg:flex-row items-center gap-2">
                            <div className="relative">
                                <input
                                    type="date"
                                    name="to"
                                    id="to"
                                    className="appearance-none block w-44 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                    onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
                                    ref={date1InputRef}
                                    // @ts-expect-error
                                    onClick={() => date1InputRef.current.showPicker()}
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <DateCalendar />
                                </div>
                            </div>
                            <p>to</p>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="from"
                                    id="from"
                                    className="appearance-none block w-44 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                    onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
                                    ref={date2InputRef}
                                    // @ts-expect-error
                                    onClick={() => date2InputRef.current.showPicker()}
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <DateCalendar />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    name="search"
                                    id="search"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                    placeholder="Search..."
                                />
                                <div className="absolute inset-y-0 right-0 flex py-2 pr-2">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-end">
                            <button className="bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none focus:opacity-80" onClick={() => setIsAddSeparationModalOpen(true)}>CREATE</button>
                        </div>
                    </div>
                    <div className="mt-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="min-w-full py-2 sm:px-6 lg:px-8">
                                <table className={`min-w-full divide-y divide-gray-300 ${separationItems.length === 0 && "mb-6"}`}>
                                    <thead>
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                Date of Separation
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Name
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Reason of Leaving
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Letter of Separation
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Sign Documents
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Last Pay
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Quitclaim
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {renderRows()}
                                    </tbody>
                                </table>
                                <hr />
                                <p className="text-xs text-gray-500 mt-2">Total record/s: {separationItems.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddSeparationModal separationItems={separationItems} setSeparationItems={setSeparationItems} isOpen={isAddSeparationModalOpen} setIsOpen={setIsAddSeparationModalOpen} />
            <LetterModal separationItems={separationItems} setSeparationItems={setSeparationItems} type={isLetterModalOpen?.type} isOpen={isLetterModalOpen} setIsOpen={setIsLetterModalOpen} />
            <SignDocumentsModal separationItems={separationItems} setSeparationItems={setSeparationItems} isOpen={isDocumentModalOpen} setIsOpen={setIsDocumentModalOpen} />
            <ConfirmModal message="Are you sure the employee’s Last Pay has been released?" isOpen={!!isLastPayModalOpen} setIsOpen={updateReleaseModal} confirmAction={releaseLastPay} />
            <QuitclaimModal separationItems={separationItems} setSeparationItems={setSeparationItems} isOpen={isQuitclaimModalOpen} setIsOpen={setIsQuitclaimModalOpen} />
        </>
    )
}

export default Content