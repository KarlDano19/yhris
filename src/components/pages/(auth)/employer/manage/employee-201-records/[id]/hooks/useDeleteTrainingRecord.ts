"use client";

// 1. React imports
import { useCallback } from "react";

// 2. Third-party library imports
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

// 3. Internal imports
import { detailUrl } from "../utils/trainingRecordUtils";

type DeleteTrainingParams = {
  employeeId: number | string;
  recordId: number | string;
};

async function deleteTrainingRecord(params: DeleteTrainingParams): Promise<void> {
  const token = getCookie("token");
  const config = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  const res = await fetch(detailUrl(params.employeeId, params.recordId), config);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.message || errorData?.detail || "Failed to delete training record."
    );
  }
}

export function useDeleteTrainingRecord() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteTrainingParams>(
    (params: DeleteTrainingParams) => deleteTrainingRecord(params),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["trainingRecordsCache", variables.employeeId]);
        queryClient.invalidateQueries(["employee", variables.employeeId]);
      },
    }
  );
}
