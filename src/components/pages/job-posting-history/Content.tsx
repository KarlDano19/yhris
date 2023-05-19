"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { T_JobPreviewModal } from "@/types/globals";
import JobPreview from "./JobPreview";
import {
  Facebook,
  Indeed,
  LinkedIn,
  Instagram,
  Twitter,
} from "@/svg/SocialMedia";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { jobPostHistory as testData } from "@/helpers/testData";

import toast from "react-hot-toast";
import JobPreviewModal from "./modals/JobPreviewModal";
import SetJob from "./SetJob";
import SetJobInactiveModal from "./modals/SetJobInactiveModal";

// import useGetSeparationItems from './hooks/useGetSeparationItems'
type ComponentMap = {
  [key: string]: React.ElementType;
};
const Content = () => {
  // const { data: separationItems, isLoading: isSeparationItemsLoading } = useGetSeparationItems();
  const [jobPostHistoryItems, setJobPostHistoryItems] = useState(testData);
  const [filteredItems, setFilteredItems] = useState(testData);
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });

  const [isJobPreviewOpen, setIsJobPreviewOpen] =
    useState<T_JobPreviewModal | null>(null);
  const [isSetJobInactiveModalOpen, setIsSetJobInactiveModalOpen] =
    useState(false);
  const componentMap: ComponentMap = {
    Facebook,
    Indeed,
    LinkedIn,
    Instagram,
    Twitter,
    // Add other components here if needed
  };

  useEffect(() => {
    if (dateFilter.from && dateFilter.to) {
      const filteredByDate = jobPostHistoryItems.filter((item) => {
        let date = new Date(item.date);
        let start = new Date(dateFilter.from);
        let end = new Date(dateFilter.to);
        return date >= end && date <= start;
      });
      setFilteredItems([...filteredByDate]);
    }
  }, [dateFilter, jobPostHistoryItems]);

  const renderRows = () => {
    if (
      !dateFilter.from &&
      !dateFilter.to &&
      jobPostHistoryItems &&
      jobPostHistoryItems.length > 0
    ) {
      return jobPostHistoryItems.map((item, index) => (
        <tr key={index}>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              item.isActive ? "text-red-500" : "text-gray-500"
            }`}
          >
            <JobPreview
              id={item.id}
              jobNumber={item.JobNo}
              setIsJobPreviewOpen={setIsJobPreviewOpen}
            />
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              item.isActive ? "text-red-500" : "text-gray-500"
            }`}
          >
            <SetJob
              id={item.id}
              jobTitle={item.jobTitle}
              setIsSetJobInactiveModalOpen={setIsSetJobInactiveModalOpen}
            />
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              item.isActive ? "text-red-500" : "text-gray-500"
            }`}
          >
            {item.jobType}
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              item.isActive ? "text-red-500" : "text-gray-500"
            }`}
          >
            {item.schedule}
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${
              item.isActive ? "text-red-500" : "text-gray-500"
            }`}
          >
            {item.hireCount}
          </td>
          <td className="flex space-x-2 whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {item.postIn.map((item, index) => {
              const DynamicComponent = componentMap[item];
              return (
                <span key={index}>
                  <DynamicComponent />
                </span>
              );
            })}
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
            {item.JobNo}
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <span>{item.jobTitle}</span>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {item.jobType}
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {item.schedule}
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {item.hireCount}
          </td>
          <td className="flex space-x-2 whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {item.postIn.map((item, index) => {
              const DynamicComponent = componentMap[item];
              return (
                <span key={index}>
                  <DynamicComponent />
                </span>
              );
            })}
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
        <div className="p-2 md:p-8 lg:p-4">
          <h2 className="text-xl font-bold text-indigo-dye">
            Job Posting History
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
            <div className="flex">
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
                  className={`min-w-full divide-y divide-gray-300 ${
                    jobPostHistoryItems.length === 0 && "mb-6"
                  }`}
                >
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Job No.
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Job Title
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Job Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Job Schedule
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        No. of Hires Needed
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Platform/s Posted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {renderRows()}
                  </tbody>
                </table>
                <hr />
                <p className="text-xs text-gray-500 mt-2">
                  Total record/s: {jobPostHistoryItems.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <JobPreviewModal
        id={isJobPreviewOpen?.id}
        jobPostHistoryItems={jobPostHistoryItems}
        isOpen={isJobPreviewOpen}
        setIsOpen={setIsJobPreviewOpen}
      />
      <SetJobInactiveModal
        isOpen={isSetJobInactiveModalOpen}
        setIsOpen={setIsSetJobInactiveModalOpen}
      />
      {/* <AddSeparationModal
        separationItems={separationItems}
        setSeparationItems={setSeparationItems}
        isOpen={isAddSeparationModalOpen}
        setIsOpen={setIsAddSeparationModalOpen}
      />
      <LetterModal
        separationItems={separationItems}
        setSeparationItems={setSeparationItems}
        type={isLetterModalOpen?.type}
        isOpen={isLetterModalOpen}
        setIsOpen={setIsLetterModalOpen}
      />
      <SignDocumentsModal
        separationItems={separationItems}
        setSeparationItems={setSeparationItems}
        isOpen={isDocumentModalOpen}
        setIsOpen={setIsDocumentModalOpen}
      />
      <ConfirmModal
        message="Are you sure the employee’s Last Pay has been released?"
        isOpen={!!isLastPayModalOpen}
        setIsOpen={updateReleaseModal}
        confirmAction={releaseLastPay}
      />
      <QuitclaimModal
        separationItems={separationItems}
        setSeparationItems={setSeparationItems}
        isOpen={isQuitclaimModalOpen}
        setIsOpen={setIsQuitclaimModalOpen}
      /> */}
    </>
  );
};

export default Content;
