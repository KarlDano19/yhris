"use client";
import { ArrowLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import { T_JobPreviewModal } from "@/types/globals";
import JobPreview from "./JobPreview";
import {
  Facebook,
  Indeed,
  LinkedIn,
  Instagram,
  Twitter,
} from "@/svg/SocialMedia";
import { jobPostHistory as testData } from "@/helpers/testData";
import JobPreviewModal from "./modals/JobPreviewModal";
import SetJob from "./SetJob";
import SetJobInactiveModal from "./modals/SetJobInactiveModal";
import Link from "next/link";
import DateCalendar from "@/svg/DateCalendar";
import getMinDate from "@/helpers/getMinDate";

type ComponentMap = {
  [key: string]: React.ElementType;
};
const Content = () => {
  const [jobPostHistoryItems, setJobPostHistoryItems] = useState(testData);
  const [filteredItems, setFilteredItems] = useState(testData);
  const [itemsFilter, setItemsFilter] = useState({ from: "", to: "", search: "" });
  const [isJobPreviewOpen, setIsJobPreviewOpen] =
    useState<T_JobPreviewModal | null>(null);
  const [isSetJobInactiveModalOpen, setIsSetJobInactiveModalOpen] =
    useState(false);
  const date1InputRef = useRef(null);
  const date2InputRef = useRef(null);

  const componentMap: ComponentMap = {
    Facebook,
    Indeed,
    LinkedIn,
    Instagram,
    Twitter,
    // Add other components here if needed
  };

  useEffect(() => {
    if (itemsFilter.from && itemsFilter.to) {
      const filteredByDate = jobPostHistoryItems.filter((item) => {
        let date = new Date(item.hireDate);
        let start = new Date(itemsFilter.from);
        let end = new Date(itemsFilter.to);
        return date >= start && date <= end;
      });
      setFilteredItems([...filteredByDate]);
    }
  }, [itemsFilter, jobPostHistoryItems]);

  const renderRows = () => {
    if (
      (!itemsFilter.from ||
      !itemsFilter.to) &&
      jobPostHistoryItems &&
      jobPostHistoryItems.length > 0
    ) {
      return jobPostHistoryItems.map((item, index) => (
        <tr key={index} className="text-center">
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${item.isActive ? "text-red-500" : "text-gray-500"
              }`}
          >
            <JobPreview
              id={item.id}
              jobNumber={item.JobNo}
              setIsJobPreviewOpen={setIsJobPreviewOpen}
            />
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${item.isActive ? "text-red-500" : "text-gray-500"
              }`}
          >
            <SetJob
              item={item}
              id={item.id}
              jobTitle={item.jobTitle}
              setIsSetJobInactiveModalOpen={setIsSetJobInactiveModalOpen}
              setIsJobPreviewOpen={setIsJobPreviewOpen}
            />
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${item.isActive ? "text-red-500" : "text-gray-500"
              }`}
          >
            {item.jobType}
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${item.isActive ? "text-red-500" : "text-gray-500"
              }`}
          >
            {item.schedule}
          </td>
          <td
            className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${item.isActive ? "text-red-500" : "text-gray-500"
              }`}
          >
            {item.hireCount}
          </td>
          <td className="flex gap-2 justify-center whitespace-nowrap px-3 py-5 text-sm text-gray-500">
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
      itemsFilter.from &&
      itemsFilter.to &&
      filteredItems &&
      filteredItems.length > 0
    ) {
      return filteredItems.map((item, index) => (
        <tr key={index}>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <JobPreview
              id={item.id}
              jobNumber={item.JobNo}
              setIsJobPreviewOpen={setIsJobPreviewOpen}
            />
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <SetJob
              item={item}
              id={item.id}
              jobTitle={item.jobTitle}
              setIsSetJobInactiveModalOpen={setIsSetJobInactiveModalOpen}
              setIsJobPreviewOpen={setIsJobPreviewOpen}
            />
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
            <h4 className="text-center text-gray-300 text-sm my-4">
              There{`'`}s no data yet.
            </h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex p-4">
          <Link href="/post-job" className="flex-none flex gap-3 items-center hover:bg-gray-200">
            <ArrowLeftIcon className="h-5 w-5" />
            <h4>Post Job</h4>
          </Link>
        </div>
        <div className="px-2 md:px-8 lg:px-4">
          <h2 className="text-xl font-bold text-indigo-dye">
            Job Posting History
          </h2>
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
                  min={!itemsFilter?.from ? getMinDate() : getMinDate(itemsFilter.from)}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <DateCalendar />
                </div>
              </div>
            </div>
            <div className="flex-none lg:w-72">
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
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 h-[75vh]">
                <table
                  className={`min-w-full divide-y divide-gray-300 ${jobPostHistoryItems.length === 0 && "mb-6"
                    }`}
                >
                  <thead>
                    <tr className="text-center">
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Job No.
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Job Title
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Job Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        Job Schedule
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
                      >
                        No. of Hires Needed
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900"
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
        id={isJobPreviewOpen?.id ? isJobPreviewOpen?.id : null}
        jobPostHistoryItems={jobPostHistoryItems}
        isOpen={isJobPreviewOpen}
        setIsOpen={setIsJobPreviewOpen}
      />
      <SetJobInactiveModal
        isOpen={isSetJobInactiveModalOpen}
        setIsOpen={setIsSetJobInactiveModalOpen}
      />
    </div>
  );
};

export default Content;
