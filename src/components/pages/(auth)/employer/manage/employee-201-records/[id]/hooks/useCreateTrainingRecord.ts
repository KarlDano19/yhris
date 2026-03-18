"use client";

// 1. React imports (none needed)

// 2. Third-party library imports
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

// 3. Internal imports
import { toFormData } from "../utils/trainingRecordUtils";

// 4. Type imports
import type {
  CreateTrainingInput,
  TrainingRecord,
} from "../types/trainingRecords";

type CreateTrainingRecordParams = {
  employeeId: number | string;
  input: CreateTrainingInput;
};

async function createTrainingRecord(
  params: CreateTrainingRecordParams
): Promise<TrainingRecord> {
  const token = getCookie("token");
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
    String(params.employeeId)
  )}/training-records/`;

  const fd = toFormData({
    training_title: params.input.training_title,
    date_completed: params.input.date_completed ?? "",
    training_provider: params.input.training_provider ?? "",
    ...(params.input.proof_of_completion
      ? { proof_of_completion: params.input.proof_of_completion }
      : {}),
  });

  const config: RequestInit = {
    method: "POST",
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
      errorData?.message || errorData?.detail || "Failed to create training record."
    );
  }

  return res.json();
}

export function useCreateTrainingRecord() {
  const queryClient = useQueryClient();

  return useMutation<TrainingRecord, Error, CreateTrainingRecordParams>(
    (params: CreateTrainingRecordParams) => createTrainingRecord(params),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["trainingRecordsCache", variables.employeeId]);
        queryClient.invalidateQueries(["employee", variables.employeeId]);
      },
    }
  );
}
