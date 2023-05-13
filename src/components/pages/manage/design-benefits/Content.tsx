"use client"
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useState, useRef } from 'react'
import { T_DesignBenefitsModal, T_DocumentsModal, T_LastPayModal, T_LetterModal, T_QuitclaimModal } from '@/types/globals'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { designBenefitsItems as testData } from '@/helpers/testData'
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast'
import DateCalendar from '@/svg/DateCalendar'
import DesignBenefitsModal from './modals/DesignBenefitsModal'
// import useGetSeparationItems from './hooks/useGetSeparationItems'

const Content = () => {
    // const { data: designBenefitsItems, isLoading: isSeparationItemsLoading } = useGetSeparationItems();
    const [designBenefitsItems, setDesignBenefitsItems] = useState(testData);
    const [filteredItems, setFilteredItems] = useState(testData);
    const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
    const [isDesignBenefitsModalOpen, setIsDesignBenefitsModalOpen] = useState<boolean | null>(null);
    const date1InputRef = useRef(null);
    const date2InputRef = useRef(null);

    useEffect(() => {
        if (dateFilter.from && dateFilter.to) {
            const filteredByDate = designBenefitsItems.filter(item => {
                let date = new Date(item.date);
                let start = new Date(dateFilter.from);
                let end = new Date(dateFilter.to);
                return date >= end && date <= start;
            });
            setFilteredItems([...filteredByDate])
        }
    }, [dateFilter, designBenefitsItems]);

    useEffect(() => {
        setDateFilter({ from: "", to: "" });
    }, [designBenefitsItems])
    
    const renderRows = () => {
        if (!dateFilter.from && !dateFilter.to && designBenefitsItems && designBenefitsItems.length > 0) {
            return designBenefitsItems.map((item, index) => (
                <tr key={index}>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {item.date}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {item.title}
                    </td>
                    <td className="px-3 py-5 text-sm text-gray-500 text-ellipsis">
                        {item.purpose}
                    </td>
                    <td className="px-3 py-5 text-sm text-gray-500 text-ellipsis">
                        {item.eligibility}
                    </td>
                </tr>
            ));
        } else if (dateFilter.from && dateFilter.to && filteredItems && filteredItems.length > 0) {
            return filteredItems.map((item, index) => (
                <tr key={index}>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {item.date}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {item.title}
                    </td>
                    <td className="px-3 py-5 text-sm text-gray-500 text-ellipsis">
                        {item.purpose}
                    </td>
                    <td className="px-3 py-5 text-sm text-gray-500 text-ellipsis">
                        {item.eligibility}
                    </td>
                </tr>
            ));
        } else {
            return (
                <tr>
                    <td colSpan={7}>
                        <h4 className="text-center text-gray-300 text-sm mt-4">There{`'`}s no data yet.</h4>
                        <h4 className="text-center text-gray-300 text-sm mb-4">Please click create to add incident report.</h4>
                    </td>
                </tr>
            );
        }
    }

    return (
        <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="p-2 md:p-8 lg:p-4">
                    <h2 className="text-xl font-bold text-indigo-dye">Design Benefits</h2>
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
                            <button className="bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none focus:opacity-80" onClick={() => setIsDesignBenefitsModalOpen(true)}>CREATE</button>
                        </div>
                    </div>
                    <div className="mt-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="min-w-full py-2 sm:px-6 lg:px-8">
                                <table className={`min-w-full divide-y divide-gray-300 ${designBenefitsItems.length === 0 && "mb-6"}`}>
                                    <thead>
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                Date
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Title
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Purpose
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Eligibility
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {renderRows()}
                                    </tbody>
                                </table>
                                <hr />
                                <p className="text-xs text-gray-500 mt-2">Total record/s: {designBenefitsItems.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DesignBenefitsModal designBenefitsItems={designBenefitsItems} setDesignBenefitsItems={setDesignBenefitsItems} isOpen={isDesignBenefitsModalOpen} setIsOpen={setIsDesignBenefitsModalOpen} />
        </>
    )
}

export default Content