import React, { Dispatch, useState, Fragment } from "react";
import CopyJob from "./CopyJob";
import { T_CreateJob } from "@/types/globals";
import { Menu, Transition } from '@headlessui/react'

const SetJob = ({
  id,
  jobTitle,
  setIsSetJobInactiveModalOpen,
  item,
}: {
  id: number;
  jobTitle: string;
  setIsSetJobInactiveModalOpen: Dispatch<boolean>;
  item: T_CreateJob | any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="inline-flex">
        <Menu as="div" className="relative -ml-px">
          <Menu.Button className="underline">
          <span
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            {jobTitle}
          </span>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute -right-14 z-10 -mr-1 mt-2 w-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item key={1}>
                  <button
                    className="block px-8 py-2 text-sm text-gray-800 hover:bg-green-500 hover:text-white"
                    onClick={() => {
                      setIsSetJobInactiveModalOpen(true);
                      setIsOpen(false);
                    }}
                  >
                    Set Job to Inactive
                  </button>
                </Menu.Item>
                <Menu.Item key={2}>
                  <CopyJob item={item} setIsOpen={setIsOpen} />
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </>
  );
};

export default SetJob;
