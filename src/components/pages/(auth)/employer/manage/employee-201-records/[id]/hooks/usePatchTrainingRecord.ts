"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

import { detailUrl, toFormData } from "../utils/trainingRecordUtils";

import type {
  TrainingRecord,
  UpdateTrainingInput,
} from "../types/trainingRecords";

type PatchTrainingRecordParams = {
  employeeId: number | string;
  recordId: number | string;
  input: UpdateTrainingInput;
};

async function patchTrainingRecord(
  params: PatchTrainingRecordParams
): Promise<TrainingRecord> {
  const token = getCookie("token");
  const url = detailUrl(
    params.employeeId,
    params.recordId,
    Boolean(params.input.clear_file)
  );

  const fd = toFormData({
    training_title: params.input.training_title,
    date_completed: params.input.date_completed,
    training_provider: params.input.training_provider,
    ...(params.input.proof_of_completion
      ? { proof_of_completion: params.input.proof_of_completion }
      : {}),
  });

  const config: RequestInit = {
    method: "PATCH",
    headers: {
      Authorization: `Token ${token}`,
      // NO Content-Type for FormData
    },
    body: fd,
  };

  const res = await fetch(url, config);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.message || errorData?.detail || "Failed to update training record."
    );
  }

  return res.json();
}

export function usePatchTrainingRecord() {
  const queryClient = useQueryClient();

  return useMutation<TrainingRecord, Error, PatchTrainingRecordParams>(
    (params: PatchTrainingRecordParams) => patchTrainingRecord(params),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["trainingRecordsCache", variables.employeeId]);
        queryClient.invalidateQueries(["employee", variables.employeeId]);
      },
    }
  );
}
