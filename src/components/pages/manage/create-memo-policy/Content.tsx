"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState, useRef } from "react";
import ClipIcon from "@/svg/ClipIcon";
import SelectChevronDown from "@/svg/SelectChevronDown";

import { createMemoPolicyItems as testData } from "@/helpers/testData";
import toast from "react-hot-toast";
import CustomToast from "@/components/CustomToast";
import DateCalendar from "@/svg/DateCalendar";
import CreateMemoModal from "./modals/CreateMemoModal";
import CreatePolicyModal from "./modals/CreatePolicyModal";

const Content = () => {
  // const { data: separationItems, isLoading: isSeparationItemsLoading } = useGetSeparationItems();
  const [createMemoPolicyItems, setCreateMemoPolicyItems] = useState(testData);
  const [filteredItems, setFilteredItems] = useState(testData);
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [isCreateMemoModalOpen, setIsCreateMemoModalOpen] = useState(false);
  const [isCreatePolicyModalOpen, setIsCreatePolicyModalOpen] = useState(false);
  const date1InputRef = useRef(null);
  const date2InputRef = useRef(null);

  // Button for Create
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  // const releaseLastPay = () => {
  //   if (isLastPayModalOpen && isLastPayModalOpen.id) {
  //     const itemIndex = employeeIssueItems.findIndex(
  //       (item: any) => item.id === isLastPayModalOpen.id
  //     );
  //     const separationItemsCopy = JSON.parse(
  //       JSON.stringify(employeeIssueItems)
  //     );
  //     separationItemsCopy[itemIndex].isLastPayReleased = true;
  //     setCreateMemoPolicyItems([...separationItemsCopy]);
  //     toast.custom(
  //       () => (
  //         <CustomToast message="Last pay marked as release." type="success" />
  //       ),
  //       { duration: 4000 }
  //     );
  //     setIsLastPayModalOpen(null);
  //   } else {
  //     toast.custom(
  //       () => <CustomToast message="Incomplete information." type="error" />,
  //       { duration: 4000 }
  //     );
  //   }
  // };
  // const updateReleaseModal = (value: boolean) => {
  //   if (!value) {
  //     setIsLastPayModalOpen(null);
  //   }
  // };
  console.log(dateFilter);

  useEffect(() => {
    if (dateFilter.from && dateFilter.to) {
      const filteredByDate = createMemoPolicyItems.filter((item) => {
        let date = new Date(item.date);
        let start = new Date(dateFilter.from);
        let end = new Date(dateFilter.to);
        return date >= end && date <= start;
      });
      setFilteredItems([...filteredByDate]);
    }
  }, [dateFilter, createMemoPolicyItems]);

  const renderRows = () => {
    if (
      !dateFilter.from &&
      !dateFilter.to &&
      createMemoPolicyItems &&
      createMemoPolicyItems.length > 0
    ) {
      return createMemoPolicyItems.map((item, index) => (
        <tr key={index}>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {item.date}
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <div className="flex gap-2">
              <span>{item.title}</span> <ClipIcon />
            </div>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <input
              type="checkbox"
              defaultChecked={item.withResponse}
              className="form-checkbox h-5 w-5 border border-gray-300 rounded-md text-indigo-600 bg-white"
            />
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-savoy-blue align-top">
            <p className="font-bold">View Responses</p>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top">
            Action
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
              <span>{item.title}</span> <ClipIcon />
            </div>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <input
              type="checkbox"
              defaultChecked={item.withResponse}
              className="form-checkbox h-5 w-5 border border-gray-300 rounded-md text-indigo-600 bg-white"
            />
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-savoy-blue align-top">
            <p className="font-bold">View Responses</p>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top">
            Action
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
        <div className="p-2 md:p-8 lg:p-4">
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
            <div className="flex-1 flex justify-end relative">
              <div className="inline-block text-left">
                <button
                  type="button"
                  className="bg-green-500 rounded-md py-2 pl-8 pr-16 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none focus:opacity-80"
                  id="options-menu"
                  aria-expanded="true"
                  aria-haspopup="true"
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                >
                  {selectedOption || "CREATE"}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <SelectChevronDown />
                  </div>
                </button>
              </div>
              {isOpen && (
                <div className=" absolute top-8 right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1 "
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <button
                      className="block px-8 py-2 text-sm text-gray-800 hover:bg-green-500 hover:text-white"
                      role="menuitem"
                      onClick={() => {
                        setIsCreateMemoModalOpen(true);
                        setIsOpen(!isOpen);
                      }}
                    >
                      Create Memo
                    </button>
                    <button
                      className="block px-8 py-2 text-sm text-gray-800 hover:bg-green-500 hover:text-white"
                      role="menuitem"
                      onClick={() => {
                        setIsCreatePolicyModalOpen(true);
                        setIsOpen(!isOpen);
                      }}
                    >
                      Create Policy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="min-w-full py-2 sm:px-6 lg:px-8">
                <table
                  className={`min-w-full divide-y divide-gray-300 ${
                    createMemoPolicyItems.length === 0 && "mb-6"
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
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        With Response
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Response/s
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {renderRows()}
                  </tbody>
                </table>
                <hr />
                <p className="text-xs text-gray-500 mt-2">
                  Total record/s: {createMemoPolicyItems.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateMemoModal
        isOpen={isCreateMemoModalOpen}
        setIsOpen={setIsCreateMemoModalOpen}
      />
      <CreatePolicyModal
        isOpen={isCreatePolicyModalOpen}
        setIsOpen={setIsCreatePolicyModalOpen}
      />
      {/* <SendNTEModal
        isOpen={isSendNTEModalOpen}
        setIsOpen={setIsSendNTEModalOpen}
        createMemoPolicyItems={createMemoPolicyItems}
        setcreateMemoPolicyItems={setcreateMemoPolicyItems}
      />
      <InvestigationModal
        isOpen={isInvestigateModalOpen}
        setIsOpen={setIsInvestigateModalOpen}
      /> */}
    </>
  );
};

export default Content;
