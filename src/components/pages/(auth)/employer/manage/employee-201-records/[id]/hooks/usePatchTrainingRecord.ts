"use client";

import { useCallback, useState } from "react";
import { getCookie } from "cookies-next";

import { detailUrl, toFormData } from "../utils/trainingRecordUtils";
import type { TrainingRecord, UpdateTrainingInput } from "../types/trainingRecords";

export function usePatchTrainingRecord() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const update = useCallback(
    async (
      employeeId: number | string,
      recordId: number | string,
      input: UpdateTrainingInput
    ): Promise<TrainingRecord> => {
      setIsLoading(true);
      setError(undefined);
      try {
        const url = detailUrl(employeeId, recordId, Boolean(input.clear_file));
        const fd = toFormData({
          training_title: input.training_title,
          date_completed: input.date_completed,
          training_provider: input.training_provider,
          ...(input.proof_of_completion ? { proof_of_completion: input.proof_of_completion } : {}),
        });

        const token = getCookie("token") as string | undefined;

        const res = await fetch(url, {
          method: "PATCH",
          headers: {
            ...(token ? { Authorization: `Token ${token}` } : {}),
          },
          body: fd,
        });

        if (!res.ok) {
          let msg = `Request failed (${res.status})`;
          try {
            const problem = await res.json();
            msg =
              typeof problem === "string"
                ? problem
                : problem?.message || problem?.detail || JSON.stringify(problem);
          } catch {}
          throw new Error(msg);
        }

        return (await res.json()) as TrainingRecord;
      } catch (e: any) {
        setError(e instanceof Error ? e : new Error(String(e)));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { update, isLoading, error } as const;
}
