"use client";
import { ArrowLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState, useRef } from "react";
import {
  T_SendNTEModal,
  T_SendDecisionModal,
  T_InvestigationModal,
} from "@/types/globals";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { employeeIssueItems as testData } from "@/helpers/testData";
import DateCalendar from "@/svg/DateCalendar";
import IncidentReportModal from "./modals/IncidentReportModal";
import SendNTEModal from "./modals/SendNTEModal";
import SendNTE from "./SendNTE";
import Investigation from "./Investigation";
import InvestigationModal from "./modals/InvestigationModal";
import SendDecision from "./SendDecision";
import SendDecisionModal from "./modals/SendDecisionModal";
import Link from "next/link";

const Content = () => {
  const [employeeIssueItems, setEmployeeIssueItems] = useState(testData);
  const [filteredItems, setFilteredItems] = useState(testData);
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [isIncidentReportModalOpen, setIsIncidentReportModalOpen] =
    useState(false);
  const [isSendNTEModalOpen, setIsSendNTEModalOpen] =
    useState<T_SendNTEModal | null>(null);
  const [isInvestigateModalOpen, setIsInvestigateModalOpen] =
    useState<T_InvestigationModal | null>(null);
  const [isSendDecisionModalOpen, setIsSendDecisionModalOpen] =
    useState<T_SendDecisionModal | null>(null);
  const date1InputRef = useRef(null);
  const date2InputRef = useRef(null);

  useEffect(() => {
    if (dateFilter.from && dateFilter.to) {
      const filteredByDate = employeeIssueItems.filter((item) => {
        let date = new Date(item.incidentDate);
        let start = new Date(dateFilter.from);
        let end = new Date(dateFilter.to);
        return date >= end && date <= start;
      });
      setFilteredItems([...filteredByDate]);
    }
  }, [dateFilter, employeeIssueItems]);

  const renderRows = () => {
    if (
      !dateFilter.from &&
      !dateFilter.to &&
      employeeIssueItems &&
      employeeIssueItems.length > 0
    ) {
      return employeeIssueItems.map((item, index) => (
        <tr key={index} onClick={() => alert("Clicked Employee Issue Item")} className="hover:bg-gray-200/30 cursor-pointer">
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {item.incidentDate}
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <div className="flex gap-2">
              <span>{item.name}</span>{" "}
            </div>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <SendNTE
              id={item.id}
              isNTESent={item.isNTESent}
              isNTEReceived={item.isNTEReceived}
              incidentReceivedDate={item.incidentDate}
              setIsSendNTEModalOpen={setIsSendNTEModalOpen}
            />
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top">
            <Investigation
              id={item.id}
              investigatedDate={item.investigatedDate}
              isInvestigated={item.isInvestigated}
              setIsInvestigateModalOpen={setIsInvestigateModalOpen}
            />
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top">
            <SendDecision
              id={item.id}
              isDecisionSent={item.isDecisionSent}
              isDecisionReceived={item.isDecisionReceived}
              decisionSentDate={item.decisionSentDate}
              setIsSendDecisionModalOpen={setIsSendDecisionModalOpen}
            />
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
        <tr key={index} onClick={() => alert("Clicked")} className="hover:bg-gray-50">
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {item.incidentDate}
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <div className="flex gap-2">
              <span>{item.name}</span>{" "}
              <InformationCircleIcon className="text-yellow-500 h-5 w-5" />
            </div>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <SendNTE
              id={item.id}
              isNTESent={item.isNTESent}
              isNTEReceived={item.isNTEReceived}
              incidentReceivedDate={item.incidentDate}
              setIsSendNTEModalOpen={setIsSendNTEModalOpen}
            />
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top">
            <Investigation
              id={item.id}
              investigatedDate={item.investigatedDate}
              isInvestigated={item.isInvestigated}
              setIsInvestigateModalOpen={setIsInvestigateModalOpen}
            />
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top">
            <SendDecision
              id={item.id}
              isDecisionSent={item.isDecisionSent}
              isDecisionReceived={item.isDecisionReceived}
              decisionSentDate={item.decisionSentDate}
              setIsSendDecisionModalOpen={setIsSendDecisionModalOpen}
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
            <h4 className="text-center text-gray-300 text-sm mb-4">
              Please click create to add incident report.
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
          <Link href="/manage" className="flex-none flex gap-3 items-center hover:bg-gray-200">
            <ArrowLeftIcon className="h-5 w-5" />
            <h4>Manage</h4>
          </Link>
        </div>
        <div className="px-2 md:px-8 lg:px-4">
          <h2 className="text-xl font-bold text-indigo-dye">
            Address Employee Issue
          </h2>
          <div className="mt-6 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-none flex flex-col lg:flex-row items-center gap-2">
              <div className="relative">
                <input
                  type="date"
                  name="to"
                  id="to"
                  className="appearance-none block w-44 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  onChange={(e) =>
                    setDateFilter({ ...dateFilter, to: e.target.value })
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
                    setDateFilter({ ...dateFilter, from: e.target.value })
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
              <button
                className="bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none focus:opacity-80"
                onClick={() => setIsIncidentReportModalOpen(true)}
              >
                CREATE
              </button>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="min-w-full py-2 sm:px-6 lg:px-8">
                <table
                  className={`min-w-full divide-y divide-gray-300 ${employeeIssueItems.length === 0 && "mb-6"
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
                        Issue NTE
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Investigate
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Send Decision
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {renderRows()}
                  </tbody>
                </table>
                <hr />
                <p className="text-xs text-gray-500 mt-2">
                  Total record/s: {employeeIssueItems.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <IncidentReportModal
        employeeIssueItems={employeeIssueItems}
        setEmployeeIssueItems={setEmployeeIssueItems}
        isOpen={isIncidentReportModalOpen}
        setIsOpen={setIsIncidentReportModalOpen}
      />
      <SendNTEModal
        isOpen={isSendNTEModalOpen}
        setIsOpen={setIsSendNTEModalOpen}
        employeeIssueItems={employeeIssueItems}
        setEmployeeIssueItems={setEmployeeIssueItems}
      />
      <InvestigationModal
        employeeIssueItems={employeeIssueItems}
        setEmployeeIssueItems={setEmployeeIssueItems}
        isOpen={isInvestigateModalOpen}
        setIsOpen={setIsInvestigateModalOpen}
      />
      <SendDecisionModal
        isOpen={isSendDecisionModalOpen}
        setIsOpen={setIsSendDecisionModalOpen}
        employeeIssueItems={employeeIssueItems}
        setEmployeeIssueItems={setEmployeeIssueItems}
      />
    </>
  );
};

export default Content;
