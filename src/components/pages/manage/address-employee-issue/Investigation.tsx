import classNames from "@/helpers/classNames";
import ClipIcon from "@/svg/ClipIcon";
import { T_InvestigationModal } from "@/types/globals";
import React, { Dispatch } from "react";

const Investigation = ({
  id,
  isInvestigated,
  investigatedDate,
  setIsInvestigateModalOpen,
}: {
  id: number;
  isInvestigated: boolean;
  investigatedDate: string;
  setIsInvestigateModalOpen: Dispatch<T_InvestigationModal>;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <button
          className={classNames(
            isInvestigated
              ? "bg-red-500 border-[1px] border-red-500 text-white"
              : "border-[1px] border-red-500 text-red-500",
            "items-center rounded-md px-2 py-1 focus:z-10 w-24"
          )}
          onClick={() =>
            setIsInvestigateModalOpen({
              isOpen: true,
              id,
            })
          }
        >
          {isInvestigated ? "Investigated" : "Investigate"}
        </button>
      </div>
      {/* <div>
        <button
          className={classNames(
            isNTEReceived
              ? "bg-savoy-blue text-white"
              : "bg-blue-100 text-gray-400",
            "items-center rounded-md px-auto py-1 focus:z-10 w-24"
          )}
        >
          Received
        </button>
      </div> */}
      {isInvestigated ? (
        <div>
          <div className="flex gap-1 items-center mt-2">
            <ClipIcon />
            <p className="text-xs">{investigatedDate}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Investigation;
