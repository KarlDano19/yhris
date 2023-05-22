"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState, useRef, Fragment } from "react";
import ClipIcon from "@/svg/ClipIcon";
import { createMemoPolicyItems as testData } from "@/helpers/testData";
import DateCalendar from "@/svg/DateCalendar";
import CreateMemoModal from "./modals/CreateMemoModal";
import CreatePolicyModal from "./modals/CreatePolicyModal";
import CreateMemoChevronLogo from "@/svg/CreateMemoChevronLogo";
import { Menu, Transition } from '@headlessui/react'
import classNames from "@/helpers/classNames";
import DeleteMemoLogo from "@/svg/DeleteMemoLogo";

const Content = () => {
  const [createMemoPolicyItems, setCreateMemoPolicyItems] = useState(testData);
  const [filteredItems, setFilteredItems] = useState(testData);
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [isCreateMemoModalOpen, setIsCreateMemoModalOpen] = useState(false);
  const [isCreatePolicyModalOpen, setIsCreatePolicyModalOpen] = useState(false);
  const date1InputRef = useRef(null);
  const date2InputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

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

  function deleteMemo(id: number): void {
    const updatedItems = createMemoPolicyItems.map((item) => {
      return item.id !== id ? item : {
        ...item,
        isDeleted: true,
      };
    });
    setCreateMemoPolicyItems([...updatedItems])
  }

  const renderRows = () => {
    const deletedCount = createMemoPolicyItems.filter((item) => item.isDeleted).length;
    if (
      !dateFilter.from &&
      !dateFilter.to &&
      createMemoPolicyItems &&
      createMemoPolicyItems.length > 0 &&
      createMemoPolicyItems.length !== deletedCount
    ) {
      return createMemoPolicyItems.map((item, index) => { 
        return !item.isDeleted && (
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
                onClick={(e) => {
                  e.preventDefault(); 
                  e.stopPropagation() 
                }}
              />
            </td>
            <td className="whitespace-nowrap px-3 py-5 text-sm text-savoy-blue align-top">
              <p className="font-bold hover:underline cursor-pointer" onClick={() => alert("View responses clicked")}>View Responses</p>
            </td>
            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top">
              <span className="cursor-pointer" onClick={() => deleteMemo(item.id)}><DeleteMemoLogo/></span>
            </td>
          </tr>
        )
      }).filter((item) => item);
    } else if (
      dateFilter.from &&
      dateFilter.to &&
      filteredItems &&
      filteredItems.length > 0 &&
      createMemoPolicyItems.length !== deletedCount
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
              onClick={(e) => {
                e.preventDefault(); 
                e.stopPropagation() 
              }}
            />
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-savoy-blue align-top">
            <p className="font-bold">View Responses</p>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top">
            <span onClick={() => deleteMemo(item.id)}><DeleteMemoLogo/></span>
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
              Please click create to add memo/policy.
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
            Create Memo/Policy
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
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex w-full justify-center gap-x-4 items-center rounded-md bg-green-500 px-5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-green-500 hover:opacity-90">
                    CREATE
                    <CreateMemoChevronLogo />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-green-500 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm cursor-pointer'
                            )}
                            onClick={() => {
                              setIsCreateMemoModalOpen(true);
                              setIsOpen(!isOpen);
                            }}
                          >
                            Create Memo
                          </span>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm cursor-pointer'
                            )}
                            onClick={() => {
                              setIsCreatePolicyModalOpen(true);
                              setIsOpen(!isOpen);
                            }}
                          >
                            Create Policy
                          </span>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="min-w-full py-2 sm:px-6 lg:px-8">
                <table
                  className={`min-w-full divide-y divide-gray-300 ${createMemoPolicyItems.length === 0 && "mb-6"
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
                  Total record/s: {createMemoPolicyItems.filter((item) => !item.isDeleted).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateMemoModal
        isOpen={isCreateMemoModalOpen}
        setIsOpen={setIsCreateMemoModalOpen}
        setCreateMemoPolicyItems={setCreateMemoPolicyItems}
        createMemoPolicyItems={createMemoPolicyItems}
      />
      <CreatePolicyModal
        setCreateMemoPolicyItems={setCreateMemoPolicyItems}
        createMemoPolicyItems={createMemoPolicyItems}
        isOpen={isCreatePolicyModalOpen}
        setIsOpen={setIsCreatePolicyModalOpen}
      />
    </>
  );
};

export default Content;
