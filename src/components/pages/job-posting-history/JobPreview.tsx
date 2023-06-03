import classNames from "@/helpers/classNames";
import { T_JobPreviewModal } from "@/types/globals";
import React, { Dispatch } from "react";

const JobPreview = ({
  id,
  jobNumber,
  setIsJobPreviewOpen,
}: {
  id: number;
  jobNumber: string;

  setIsJobPreviewOpen: Dispatch<T_JobPreviewModal>;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <button
          className="underline"
          onClick={() =>
            setIsJobPreviewOpen({
              isOpen: true,
              id,
            })
          }
        >
          {jobNumber}
        </button>
      </div>
    </div>
  );
};

export default JobPreview;
