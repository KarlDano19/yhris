import classNames from "@/helpers/classNames";
import ClipIcon from "@/svg/ClipIcon";
import { T_SendNTEModal } from "@/types/globals";
import React, { Dispatch } from "react";

const SendNTE = ({
  id,
  isNTESent,
  isNTEReceived,
  incidentReceivedDate,
  setIsSendNTEModalOpen,
}: {
  id: number;
  isNTESent: boolean;
  isNTEReceived: boolean;
  incidentReceivedDate?: string;
  setIsSendNTEModalOpen: Dispatch<T_SendNTEModal>;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <button
          className={classNames(
            isNTESent
              ? "bg-red-500 border-[1px] border-red-500 text-white"
              : "border-[1px] border-red-500 text-red-500",
            "items-center rounded-md px-2 py-1 focus:z-10 w-24"
          )}
          onClick={() =>
            setIsSendNTEModalOpen({
              isOpen: true,
              id,
            })
          }
        >
          {isNTESent ? "Sent" : "Send"}
        </button>
      </div>
      <div>
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
      </div>
      {isNTEReceived ? (
        <div>
          <div className="flex gap-1 items-center mt-2">
            <ClipIcon />
            <p className="text-xs">{incidentReceivedDate}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SendNTE;
