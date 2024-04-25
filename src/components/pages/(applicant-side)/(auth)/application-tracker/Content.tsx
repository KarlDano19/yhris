"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useState, useRef } from "react";

import DateCalendar from "@/svg/DateCalendar";
import useGetApplicationByUser from "./hooks/useGetApplicationByUser";
interface Application{
  id:number;
  userId:number;
  applicationDate:string;
  jobTitle:string;
  company:string;
  status:string;
  statusUpdateDate:string;
}


const Content = () => {
  const date1InputRef = useRef(null);
  const date2InputRef = useRef(null);
  const [applications, setApplications] = useState<any>([]);

  const [isApply, setIsApply] = useState(false)
  const {data, isLoading} = useGetApplicationByUser(93);

  const renderRows = () => {
    if (isApply) {
      return (<>
         {!isLoading ?
        (
          applications.map((application:Application, index:number)=>(
        <tr key={index}>
          <td className="whitespace-nowrap px-3 pt-5 pb-9 text-center text-sm text-gray-500">
            {application.applicationDate}
          </td>
          <td className="whitespace-nowrap px-3 pt-5 pb-9 text-center text-sm text-gray-500">
           {application.jobTitle}
          </td>
          <td className="whitespace-nowrap px-3 pt-5 pb-9 text-center text-sm text-gray-500">
            {application.company}
          </td>
          <td className="whitespace-nowrap px-3 pt-5 pb-9 text-sm text-gray-500">
            <h6 className={`${application.status==="Hired"? "bg-green-500":"bg-[#6F829B]"} text-white text-center px-5 py-3 rounded-md`}>
             {application.status}
            </h6>
            <span className="flex justify-center">
              <p className="md:absolute mt-1 text-xs text-[#ACB9CB]">
                Status as of {application.statusUpdateDate}
              </p>
            </span>
          </td>
        </tr>
        ))):(<div className="text-center">Loading...</div>)};
      </>)
       
      
    } else {
      return (
        <tr>
          <td colSpan={7}>
            <h4 className="text-center text-gray-300 text-sm mt-4">{`There's no data yet.`}</h4>
            <h4 className="text-center text-gray-300 text-sm mb-4">
              Please click APPLY NOW! to apply for a job.
            </h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 `}
      >
        <div className="px-2 md:px-8 lg:px-4 mt-4">
          <h2 className="text-xl font-bold text-indigo-dye">
            Application Tracker
          </h2>
          <div className="mt-6 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-none flex flex-col lg:flex-row items-center gap-2">
              <div className="relative">
                <input
                  type="date"
                  name="to"
                  id="to"
                  className="appearance-none block w-44 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
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
                  ref={date2InputRef}
                  // @ts-expect-error
                  onClick={() => date2InputRef.current.showPicker()}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <DateCalendar />
                </div>
              </div>
            </div>
            <div className="flex-none lg:w-1/3">
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
                className="bg-savoy-blue rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none focus:opacity-80"
                onClick={() => setIsApply(true)}
              >
                APPLY NOW!
              </button>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="min-w-full py-2 sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-indigo-dye sm:pl-0"
                      >
                        Application Date
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-sm font-semibold text-indigo-dye"
                      >
                        Job Title
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-sm font-semibold text-indigo-dye"
                      >
                        Company
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-sm font-semibold text-indigo-dye"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {renderRows()}
                  </tbody>
                </table>
                <hr />
                <p className="text-xs text-gray-500 mt-2">
                  Total record/s: {isApply && !isLoading ? applications.length : 0}
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
