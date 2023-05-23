"use client"
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
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
import ConfirmModal from '../../ConfirmModal'
import toast from 'react-hot-toast';
import QuitclaimModal from './modals/QuitclaimModal'
import CustomToast from '@/components/CustomToast'
import DateCalendar from '@/svg/DateCalendar'
import useGetSeparationItems from './hooks/useGetSeparationItems'
import useGetDepartmentItems from './hooks/useGetDepartmentItems'
import useGetEmployeeItems from './hooks/useGetEmployeeItems'
import useGetPositionItems from './hooks/useGetPositionItems'
import Link from 'next/link'

const Content = () => {
    const [separationItems, setSeparationItems] = useState<any>([]);
    const [departmentItems, setDepartmentItems] = useState<any>([]);
    const [employeeItems, setEmployeeItems] = useState<any>([]);
    const [positionItems, setPositionItems] = useState<any>([]);
    const [itemsFilter, setItemsFilter] = useState({ from: "", to: "", search: "" });
    const [isAddSeparationModalOpen, setIsAddSeparationModalOpen] = useState(false);
    const [isLetterModalOpen, setIsLetterModalOpen] = useState<T_LetterModal | null>(null);
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState<T_DocumentsModal | null>(null);
    const [isLastPayModalOpen, setIsLastPayModalOpen] = useState<T_LastPayModal | null>(null);
    const [isQuitclaimModalOpen, setIsQuitclaimModalOpen] = useState<T_QuitclaimModal | null>(null);
    const { data: dataSepration, isLoading: isLoadingSeparation } = useGetSeparationItems(itemsFilter);
    const { data: dataDepartment, isLoading: isLoadingDepartment } = useGetDepartmentItems();
    const { data: dataEmployee, isLoading: isLoadingEmployee } = useGetEmployeeItems();
    const { data: dataPosition, isLoading: isLoadingPosition } = useGetPositionItems();
    const date1InputRef = useRef(null);
    const date2InputRef = useRef(null);
    const releaseLastPay = () => {
        if (isLastPayModalOpen && isLastPayModalOpen.id) {
            const itemIndex = separationItems.findIndex((item: any) => item.id === isLastPayModalOpen.id);
            const separationItemsCopy = JSON.parse(JSON.stringify(separationItems));
            separationItemsCopy[itemIndex].isLastPayReleased = true;
            setSeparationItems([...separationItemsCopy]);
            toast.custom(() => <CustomToast message="Last pay marked as released." type="success" />, { duration: 4000 });
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
        if (dataDepartment) {
            setDepartmentItems(dataDepartment)
        }
        if (dataEmployee) {
            setEmployeeItems(dataEmployee)
        }
        if (dataPosition) {
            setPositionItems(dataPosition)
        }
        if (dataSepration) {
            dataSepration.map((separation: any) => {
                const employee = separation.employee_dict;
                separation['separationDate'] = Intl.DateTimeFormat('en-US').format(new Date(separation.date_of_separation))
                separation['name'] = `${employee.firstname} ${employee.lastname}`
                separation['reasonForLeaving'] = separation.reason_of_leaving;
                return separation;
            })
            setSeparationItems(dataSepration);
        }
    }, [dataSepration, dataDepartment, dataEmployee, dataPosition])

    const renderRows = () => {
        if (separationItems && separationItems.length > 0) {
            return separationItems.map((item: any) => (
                <tr key={item.id}>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {item.separationDate}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <div className="flex gap-2"><span>{item.name}</span></div>
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
                        <h4 className="text-center text-gray-300 text-sm mt-4">{`There's no data yet.`}</h4>
                        <h4 className="text-center text-gray-300 text-sm mb-4">Please click create to add separation of employee.</h4>
                    </td>
                </tr>
            );
        }
    }

    return (
        <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex p-4">
                    <Link href="/" className="flex-none flex gap-3 items-center hover:bg-gray-200">
                        <ArrowLeftIcon className="h-5 w-5" />
                        <h4>Home</h4>
                    </Link>  
                </div>
                <div className="px-2 md:px-8 lg:px-4">
                    <h2 className="text-xl font-bold text-indigo-dye">Employee Separation</h2>
                    <div className="mt-6 flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-none flex flex-col lg:flex-row items-center gap-2">
                            <div className="relative">
                                <input
                                    type="date"
                                    name="to"
                                    id="to"
                                    className="appearance-none block w-44 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                    onChange={(e) => setItemsFilter({ ...itemsFilter, from: e.target.value })}
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
                                    onChange={(e) => setItemsFilter({ ...itemsFilter, to: e.target.value })}
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
                                    onChange={(e) => setItemsFilter({ ...itemsFilter, search: e.target.value })}
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
            <AddSeparationModal separationItems={separationItems} departmentItems={departmentItems} employeeItems={employeeItems} positionItems={positionItems} setSeparationItems={setSeparationItems} isOpen={isAddSeparationModalOpen} setIsOpen={setIsAddSeparationModalOpen} />
            <LetterModal separationItems={separationItems} setSeparationItems={setSeparationItems} type={isLetterModalOpen?.type} isOpen={isLetterModalOpen} setIsOpen={setIsLetterModalOpen} />
            <SignDocumentsModal separationItems={separationItems} setSeparationItems={setSeparationItems} isOpen={isDocumentModalOpen} setIsOpen={setIsDocumentModalOpen} />
            <ConfirmModal message="Are you sure the employee’s Last Pay has been released?" isOpen={!!isLastPayModalOpen} setIsOpen={updateReleaseModal} confirmAction={releaseLastPay} />
            <QuitclaimModal separationItems={separationItems} setSeparationItems={setSeparationItems} isOpen={isQuitclaimModalOpen} setIsOpen={setIsQuitclaimModalOpen} />
        </>
    )
}

export default Content