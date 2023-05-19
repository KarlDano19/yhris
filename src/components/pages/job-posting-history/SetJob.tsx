import React, { Dispatch, useState } from "react";
import classNames from "@/helpers/classNames";
import CopyJob from "./CopyJob";
import { T_CreateJob } from "@/types/globals";

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
  const [selectedOption, setSelectedOption] = useState("");
  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <button
          className="underline"
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {jobTitle}
        </button>
        {isOpen && (
          <div className="z-20 absolute top-8 right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div
              className="py-1 "
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <button
                className="block px-8 py-2 text-sm text-gray-800 hover:bg-green-500 hover:text-white"
                onClick={() => {
                  setIsSetJobInactiveModalOpen(true);
                  setIsOpen(false);
                }}
              >
                Set Job to Inactive
              </button>
              <CopyJob item={item} setIsOpen={setIsOpen} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetJob;
