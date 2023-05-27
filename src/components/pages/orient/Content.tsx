"use client";
import { ArrowLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import SeparationLetter from "../employee-separation/SeparationLetter";
import {
    T_DocumentsModal,
    T_LastPayModal,
    T_LetterModal,
    T_QuitclaimModal,
} from "@/types/globals";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { orientItems as testData } from "@/helpers/testData";
import ConfirmModal from "../employee-separation/modals/ConfirmModal";
import toast from "react-hot-toast";
import Link from "next/link";
import SendContract from "./SendContract";
import Orient from "./Orient";
import IntroduceToTeam from "./IntroduceToTeam";
import EnrollToPayroll from "./EnrollToPayroll";

const Content = () => {
    const [orientItems, setOrientItems] = useState(testData);
    const [filteredItems, setFilteredItems] = useState(testData);
    const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
    const [isSendContractModalOpen, setIsSendContractModalOpen] =
        useState(false);
    const [isOrientFirstModalOpen, setIsOrientFirstModalOpen] =
        useState(false);
    const [isIntroducedModalOpen, setIsIntroducedModalOpen] =
        useState(false);
    const [isEnrollModalOpen, setIsEnrollModalOpen] =
        useState(false);

    useEffect(() => {
        if (dateFilter.from && dateFilter.to) {
            const filteredByDate = orientItems.filter((item) => {
                let date = new Date(item.date);
                let start = new Date(dateFilter.from);
                let end = new Date(dateFilter.to);
                return date >= end && date <= start;
            });
            setFilteredItems([...filteredByDate]);
        }
    }, [dateFilter, orientItems]);

    const renderRows = () => {
        if (
            !dateFilter.from &&
            !dateFilter.to &&
            orientItems &&
            orientItems.length > 0
        ) {
            return orientItems.map((item, index) => (
                <tr key={index}>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {item.date}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <div className="flex gap-2">
                            <span>{item.name}</span>{" "}
                        </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <SendContract isContractSent={item.isContractSent} isContractReceived={item.isContractReceived} contractReceivedDate={item.contractReceivedDate} setIsSendContractModalOpen={setIsSendContractModalOpen} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <Orient isOriented={item.isNewHireOriented} setIsOrientFirstModalOpen={setIsOrientFirstModalOpen} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <IntroduceToTeam isIntroduced={item.isIntroduceSent} setIsIntroducedModalOpen={setIsIntroducedModalOpen} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <EnrollToPayroll isEnrolled={item.isNewHireEnrolled} setIsEnrollModalOpen={setIsEnrollModalOpen} />
                    </td>
                </tr>
            ));
        } else if (
            dateFilter.from &&
            dateFilter.to &&
            filteredItems &&
            filteredItems.length > 0
        ) {
            return filteredItems.map((item, index) => (
                <tr key={index}>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {item.date}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <div className="flex gap-2">
                            <span>{item.name}</span>{" "}
                            <InformationCircleIcon className="text-yellow-500 h-5 w-5" />
                        </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <SendContract isContractSent={item.isContractSent} isContractReceived={item.isContractReceived} contractReceivedDate={item.contractReceivedDate} setIsSendContractModalOpen={setIsSendContractModalOpen} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <Orient isOriented={item.isNewHireOriented} setIsOrientFirstModalOpen={setIsOrientFirstModalOpen} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <IntroduceToTeam isIntroduced={item.isIntroduceSent} setIsIntroducedModalOpen={setIsIntroducedModalOpen} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <EnrollToPayroll isEnrolled={item.isNewHireEnrolled} setIsEnrollModalOpen={setIsEnrollModalOpen} />
                    </td>
                </tr>
            ));
        } else {
            return (
                <tr>
                    <td colSpan={7}>
                        <h4 className="text-center text-gray-300 text-sm mt-4">
                            There{`'`}s no data yet.
                        </h4>
                        <h4 className="text-center text-gray-300 text-sm">
                            Please click create to add separtion of employee.
                        </h4>
                    </td>
                </tr>
            );
        }
    };

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
                    <h2 className="text-xl font-bold text-indigo-dye">
                        Orient
                    </h2>
                    <div className="mt-6 flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-none flex flex-col lg:flex-row items-center gap-2">
                            <input
                                type="date"
                                name="to"
                                id="to"
                                className="block w-full rounded-md py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                onChange={(e) =>
                                    setDateFilter({ ...dateFilter, to: e.target.value })
                                }
                            />
                            <p>to</p>
                            <input
                                type="date"
                                name="from"
                                id="from"
                                className="block w-full rounded-md py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                onChange={(e) =>
                                    setDateFilter({ ...dateFilter, from: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex-none">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    name="search"
                                    id="search"
                                    className="block w-full rounded-md border-0 py-[5px] px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                    placeholder="Search..."
                                />
                                <div className="absolute inset-y-0 right-0 flex py-2 pr-2">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 h-[75vh]">
                                <table
                                    className={`min-w-full divide-y divide-gray-300 ${orientItems.length === 0 && "mb-6"
                                        }`}
                                >
                                    <thead>
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                            >
                                                Date
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Send Contract
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Orient
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Introduce to the team
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Enroll to YAHSHUA Payroll
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {renderRows()}
                                    </tbody>
                                </table>
                                <hr />
                                <p className="text-xs text-gray-500 mt-2">
                                    Total record/s: {orientItems.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Content;
