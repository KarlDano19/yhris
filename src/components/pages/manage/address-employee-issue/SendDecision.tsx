import classNames from "@/helpers/classNames";
import ClipIcon from "@/svg/ClipIcon";
import { T_SendDecisionModal } from "@/types/globals";
import React, { Dispatch } from "react";

const SendDecision = ({
  id,
  isDecisionSent,
  isDecisionReceived,
  decisionSentDate,
  setIsSendDecisionModalOpen,
}: {
  id: number;
  isDecisionSent: boolean;
  isDecisionReceived: boolean;
  decisionSentDate?: string;
  setIsSendDecisionModalOpen: Dispatch<T_SendDecisionModal>;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <button
          className={classNames(
            isDecisionSent
              ? "bg-red-500 border-[1px] border-red-500 text-white"
              : "border-[1px] border-red-500 text-red-500",
            "items-center rounded-md px-2 py-1 focus:z-10 w-24"
          )}
          onClick={(e) => {
              e.stopPropagation();
              if(!isDecisionSent) {
                setIsSendDecisionModalOpen({
                  isOpen: true,
                  id,
                })
              }
            }
          }
        >
          {isDecisionSent ? "Sent" : "Send"}
        </button>
      </div>
      <div>
        <button
          className={classNames(
            isDecisionReceived
              ? "bg-savoy-blue text-white"
              : "bg-blue-100 text-gray-400",
            "items-center rounded-md px-auto py-1 focus:z-10 w-24"
          )}
        >
          Received
        </button>
      </div>
      {isDecisionReceived ? (
        <div>
          <div className="flex gap-1 items-center mt-2">
            <ClipIcon />
            <p className="text-xs">{decisionSentDate}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SendDecision;
