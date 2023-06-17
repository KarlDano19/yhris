"use client";
import { ArrowLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { orientItems as testData } from "@/helpers/testData";
import Link from "next/link";
import SendContract from "./SendContract";
import Orient from "./Orient";
import IntroduceToTeam from "./IntroduceToTeam";
import EnrollToPayroll from "./EnrollToPayroll";
import DateCalendar from "@/svg/DateCalendar";
import SendContractModal from "./modals/SendContractModal";
import SuccessModal from "./modals/SuccessModal";
import NoticeModal from "./modals/NoticeModal";
import IntroduceModal from "./modals/IntroduceModal";

const Content = () => {
    const [orientItems, setOrientItems] = useState(testData);
    const [filteredItems, setFilteredItems] = useState(testData);
    const [itemsFilter, setItemsFilter] = useState({
        from: "",
        to: "",
        search: "",
    });
    const [isSendContractModalOpen, setIsSendContractModalOpen] = useState(false);
    const [isSuccessSendContractModalOpen, setIsSuccessSendContractModalOpen] = useState(false);

    const [isDoloNewHire, setIsDoloNewHire] = useState(false);
    const [isIntegrateToDolo, setIntegrateToDolo] = useState(false);
    const [isLoggedInDolo, setIsLoggedInDolo] = useState(false);
    const [isLearningMaterials, setIsLearningMaterials] = useState(false);
    const [selectedLearningMaterials, setSelectedLearningMaterials] = useState<string | null>(null);
    const [isSendOrientLink, setIsSendOrientLink] = useState(false);
    const [isOrientLinkEmail, setIsOrientLinkEmail] = useState(false);
    const [orientLinkEmail, setOrientLinkEmail] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [newHireOriented, setNewHireOriented] = useState(false);

    const [isIntroducedModalOpen, setIsIntroducedModalOpen] = useState(false);
    const [isSuccessIntroducedModalOpen, setSuccessIsIntroducedModalOpen] = useState(false);

    const [isSignInPayrollModalOpen, setIsSignInPayrollModalOpen] = useState(false);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const date1InputRef = useRef(null);
    const date2InputRef = useRef(null);

    useEffect(() => {
        if (itemsFilter.from && itemsFilter.to) {
            const filteredByDate = orientItems.filter((item) => {
                let date = new Date(item.date);
                let start = new Date(itemsFilter.from);
                let end = new Date(itemsFilter.to);
                return date >= end && date <= start;
            });
            setFilteredItems([...filteredByDate]);
        }
    }, [itemsFilter, orientItems]);
    const renderRows = () => {
        if (
            !itemsFilter.from &&
            !itemsFilter.to &&
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
                        <SendContract
                            isContractSent={item.isContractSent}
                            isContractReceived={item.isContractReceived}
                            contractReceivedDate={item.contractReceivedDate}
                            setIsSendContractModalOpen={setIsSendContractModalOpen}
                        />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <Orient
                            isOrientSent={item.isOrientationSent}
                            isOriented={item.isNewHireOriented}
                            setIsOrientFirstModalOpen={setIsDoloNewHire}
                            setIsNewHireOrientedOpen={setNewHireOriented}
                        />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <IntroduceToTeam
                            isIntroduced={item.isIntroduceSent}
                            setIsIntroducedModalOpen={setIsIntroducedModalOpen}
                        />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <EnrollToPayroll
                            isEnrolled={item.isNewHireEnrolled}
                            setIsEnrollModalOpen={setIsSignInPayrollModalOpen}
                        />
                    </td>
                </tr>
            ));
        } else if (
            itemsFilter.from &&
            itemsFilter.to &&
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
                        <SendContract
                            isContractSent={item.isContractSent}
                            isContractReceived={item.isContractReceived}
                            contractReceivedDate={item.contractReceivedDate}
                            setIsSendContractModalOpen={setIsSendContractModalOpen}
                        />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <Orient
                            isOrientSent={item.isOrientationSent}
                            isOriented={item.isNewHireOriented}
                            setIsOrientFirstModalOpen={setIsDoloNewHire}
                            setIsNewHireOrientedOpen={setNewHireOriented}
                        />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <IntroduceToTeam
                            isIntroduced={item.isIntroduceSent}
                            setIsIntroducedModalOpen={setIsIntroducedModalOpen}
                        />
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <EnrollToPayroll
                            isEnrolled={item.isNewHireEnrolled}
                            setIsEnrollModalOpen={setIsSignInPayrollModalOpen}
                        />
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
                    <Link
                        href="/orient"
                        className="flex-none flex gap-3 items-center hover:bg-gray-200"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <h4>Positions</h4>
                    </Link>
                </div>
                <div className="px-2 md:px-8 lg:px-4">
                    <h2 className="text-xl font-bold text-indigo-dye">Orient</h2>
                    <div className="mt-6 flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-none flex flex-col lg:flex-row items-center gap-2">
                            <div className="relative">
                                <input
                                    type="date"
                                    name="to"
                                    id="to"
                                    className="appearance-none block w-44 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setItemsFilter({ ...itemsFilter, from: e.target.value })
                                    }
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
                                    onChange={(e) =>
                                        setItemsFilter({ ...itemsFilter, to: e.target.value })
                                    }
                                    ref={date2InputRef}
                                    // @ts-expect-error
                                    onClick={() => date2InputRef.current.showPicker()}
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <DateCalendar />
                                </div>
                            </div>
                        </div>
                        <div className="flex-none lg:w-1/4">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    name="search"
                                    id="search"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setItemsFilter({ ...itemsFilter, search: e.target.value })
                                    }
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
            <SendContractModal
                orientItems={orientItems}
                setOrientItems={setOrientItems}
                setIsOpen={setIsSendContractModalOpen}
                isOpen={isSendContractModalOpen}
                setSuccessModal={setIsSuccessSendContractModalOpen}
            />
            <SuccessModal
                isOpen={isSuccessSendContractModalOpen}
                setIsOpen={setIsSuccessSendContractModalOpen}
                message="You have successfully sent an email."
            />
            <NoticeModal
                isOpen={isDoloNewHire}
                setIsOpen={setIsDoloNewHire}
            >
                <h5 className="text-xl font-bold text-indigo-dye text-center pt-4">
                    Do you have an account in YAHSHUA Dolo to orient the New Hire?
                </h5>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:justify-between">
                    <button
                        type="button"
                        className="flex-1 sm:ml-10 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-white bg-savoy-blue shadow-sm py-3 px-6 rounded-md transition-all"
                        onClick={() => {
                            setIsDoloNewHire(false);
                            setIntegrateToDolo(true);
                        }}
                    >
                        YES, I HAVE.
                    </button>
                    <button
                        type="submit"
                        className="flex-1 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-savoy-blue  shadow-sm border border-savoy-blue py-3 px-6 rounded-lg transition-all mt-3 sm:mt-0"
                        onClick={() => {
                            setIsDoloNewHire(false);
                        }}
                    >
                        NO, I DON{"'"}T.
                    </button>
                </div>
            </NoticeModal>
            <NoticeModal
                isOpen={isIntegrateToDolo}
                setIsOpen={setIntegrateToDolo}
            >
                <h5 className="text-xl font-bold text-indigo-dye text-center pt-4">
                    Would you like YAHSHUA HRIS to be integrated with YAHSHUA Dolo?
                </h5>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:justify-between">
                    <button
                        type="button"
                        className="flex-1 sm:ml-10 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-white bg-savoy-blue shadow-sm py-3 px-6 rounded-md transition-all"
                        onClick={() => {
                            setIntegrateToDolo(false);
                            setIsLoggedInDolo(true);
                        }}
                    >
                        YES
                    </button>
                    <button
                        type="submit"
                        className="flex-1 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-savoy-blue  shadow-sm border border-savoy-blue py-3 px-6 rounded-lg transition-all mt-3 sm:mt-0"
                        onClick={() => {
                            setIntegrateToDolo(false);
                        }}
                    >
                        NO
                    </button>
                </div>
            </NoticeModal>
            <NoticeModal
                isOpen={isLoggedInDolo}
                setIsOpen={setIsLoggedInDolo}
            >
                <h5 className="text-xl font-bold text-indigo-dye text-center pt-4">
                    It appears that you are not logged in to YAHSHUA Dolo.<br /><br />Please log in to YAHSHUA Dolo.
                </h5>
                <button
                    type="button"
                    className="text-lg text-center block w-full font-bold leading-6 text-white bg-savoy-blue shadow-sm p-3 rounded-md transition-all"
                    onClick={() => {
                        setIsLoggedInDolo(false);
                        setIsLearningMaterials(true);
                    }}
                >
                    LOG IN TO YAHSHUA DOLO
                </button>
            </NoticeModal>
            <NoticeModal
                isOpen={isLearningMaterials}
                setIsOpen={setIsLearningMaterials}
            >
                <h5 className="text-xl font-bold text-indigo-dye text-center pt-4">
                    Awesome! Please select from the following learning materials to orient the New Hire:
                </h5>
                <div className={`flex flex-col space-y-2 pl-8 pt-4 pb-6`}>
                    <label className="inline-flex items-center mr-4">
                        <input
                            type="radio"
                            className="form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900"
                            value="text"
                            name="radioGroup"
                            onClick={() => setSelectedLearningMaterials("New Hire Orientation")}
                        />
                        <span className="ml-2 text-sm font-medium leading-6 text-gray-900">
                            New Hire Orientation
                        </span>
                    </label>
                    <label className="inline-flex items-center mr-4">
                        <input
                            type="radio"
                            className="form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900"
                            value="text"
                            name="radioGroup"
                            onClick={() => setSelectedLearningMaterials("Communication Skills - Email Basics")}
                        />
                        <span className="ml-2 text-sm font-medium leading-6 text-gray-900">
                            Communication Skills - Email Basics
                        </span>
                    </label>
                    <label className="inline-flex items-center mr-4">
                        <input
                            type="radio"
                            className="form-radio h-5 w-5 ext-sm font-medium leading-6 text-gray-900"
                            value="text"
                            name="radioGroup"
                            onClick={() => setSelectedLearningMaterials("Remote Work Readiness")}
                        />
                        <span className="ml-2 text-sm font-medium leading-6 text-gray-900">
                            Remote Work Readiness
                        </span>
                    </label>
                </div>
                <button
                    type="button"
                    className="text-lg text-center block w-full font-bold leading-6 text-white bg-savoy-blue shadow-sm p-3 rounded-md transition-all"
                    onClick={() => {
                        if (selectedLearningMaterials) {
                            setIsLearningMaterials(false);
                            setIsSendOrientLink(true);
                        }
                    }}
                >
                    CONTINUE
                </button>
            </NoticeModal>
            <NoticeModal
                isOpen={isSendOrientLink}
                setIsOpen={setIsSendOrientLink}
            >
                <h5 className="text-xl font-bold text-indigo-dye text-center pt-4">
                    Would you like send the orientation link to the New Hire’s registered email or send to his/her new company email?
                </h5>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:justify-between">
                    <button
                        type="button"
                        className="flex-1 sm:ml-10 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-white bg-savoy-blue shadow-sm py-3 px-6 rounded-md transition-all"
                        onClick={() => {
                            setIsSendOrientLink(false);
                            setIsOrientLinkEmail(true);
                        }}
                    >
                        YES
                    </button>
                    <button
                        type="submit"
                        className="flex-1 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-savoy-blue  shadow-sm border border-savoy-blue py-3 px-6 rounded-lg transition-all mt-3 sm:mt-0"
                        onClick={() => {
                            setIsSendOrientLink(false);
                        }}
                    >
                        NO
                    </button>
                </div>
            </NoticeModal>
            <NoticeModal
                isOpen={isOrientLinkEmail}
                setIsOpen={setIsOrientLinkEmail}
            >
                <h5 className="text-xl font-bold text-indigo-dye text-center pt-4">
                    Enter New Hire email to send the orientation link.
                </h5>
                <div className="my-8">
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter email..."
                        onChange={(e) => setOrientLinkEmail(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                </div>
                <button
                    type="button"
                    className="text-lg text-center block w-full font-bold leading-6 text-white bg-savoy-blue shadow-sm p-3 rounded-md transition-all"
                    onClick={() => {
                        if (orientLinkEmail) {
                            setIsOrientLinkEmail(false);
                            setIsSuccess(true);
                            const separationItemsCopy = JSON.parse(JSON.stringify(orientItems));
                            separationItemsCopy[0].isOrientationSent = true;
                            setOrientItems(separationItemsCopy)
                        }
                    }}
                >
                    CONTINUE
                </button>
            </NoticeModal>
            <SuccessModal
                isOpen={isSuccess}
                setIsOpen={setIsSuccess}
                message="You have successfully sent orientation link to the New Hire."
            />
            <NoticeModal
                isOpen={newHireOriented}
                setIsOpen={setNewHireOriented}
            >
                <h5 className="text-xl font-bold text-indigo-dye text-center pt-4">
                    Have you already oriented the New Hire?
                </h5>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:justify-between">
                    <button
                        type="button"
                        className="flex-1 sm:ml-10 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-white bg-savoy-blue shadow-sm py-3 px-6 rounded-md transition-all"
                        onClick={() => {
                            setNewHireOriented(false);
                            const separationItemsCopy = JSON.parse(JSON.stringify(orientItems));
                            separationItemsCopy[0].isNewHireOriented = true;
                            setOrientItems(separationItemsCopy)
                        }}
                    >
                        YES, I HAVE.
                    </button>
                    <button
                        type="submit"
                        className="flex-1 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-savoy-blue  shadow-sm border border-savoy-blue py-3 px-6 rounded-lg transition-all mt-3 sm:mt-0"
                        onClick={() => {
                            setNewHireOriented(false);
                        }}
                    >
                        NO, I DON{"'"}T.
                    </button>
                </div>
            </NoticeModal>
            <IntroduceModal
                orientItems={orientItems}
                setOrientItems={setOrientItems}
                setIsOpen={setIsIntroducedModalOpen}
                isOpen={isIntroducedModalOpen}
                setSuccessModal={setSuccessIsIntroducedModalOpen}
            />
            <SuccessModal
                isOpen={isSuccessIntroducedModalOpen}
                setIsOpen={setSuccessIsIntroducedModalOpen}
                message="You have successfully sent an email."
            />
            <NoticeModal
                isOpen={isSignInPayrollModalOpen}
                setIsOpen={setIsSignInPayrollModalOpen}
            >
                <h5 className="text-xl font-bold text-indigo-dye text-center pt-4">
                    It appears that you are not signed in to YAHSHUA.<br/><br/>Payroll Please sign in to YAHSHUA Payroll.
                </h5>
                <button
                    type="button"
                    className="text-lg text-center block w-full font-bold leading-6 text-white bg-savoy-blue shadow-sm p-3 rounded-md transition-all"
                    onClick={() => {
                        setIsSignInPayrollModalOpen(false);
                        setIsEnrollModalOpen(true);
                        const separationItemsCopy = JSON.parse(JSON.stringify(orientItems));
                        separationItemsCopy[0].isSingedInToPayroll = true;
                        separationItemsCopy[0].isNewHireEnrolled = true;
                        setOrientItems(separationItemsCopy)
                    }}
                >
                    SIGN IN TO YAHSHUA PAYROLL
                </button>
            </NoticeModal>
            <SuccessModal
                isOpen={isEnrollModalOpen}
                setIsOpen={setIsEnrollModalOpen}
                message="You have successfully enrolled New Hire to YAHSHUA Payroll."
            />
        </>
    );
};

export default Content;
