"use client";

import { useCallback, useState } from "react";

import { getCookie } from "cookies-next";
import { toFormData } from "../utils/trainingRecordUtils";

import type { CreateTrainingInput, TrainingRecord } from "../types/trainingRecords";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

export function useCreateTrainingRecord() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const create = useCallback(
    async (employeeId: number | string, input: CreateTrainingInput): Promise<TrainingRecord> => {
      setIsLoading(true);
      setError(undefined);
      try {
        const url = `${API_BASE}/api/employee-201/employees/${encodeURIComponent(
          String(employeeId)
        )}/training-records/`;

        const fd = toFormData({
          training_title: input.training_title,
          date_completed: input.date_completed ?? "",
          training_provider: input.training_provider ?? "",
          ...(input.proof_of_completion ? { proof_of_completion: input.proof_of_completion } : {}),
        });

        const token = getCookie("token") as string | undefined;

        const res = await fetch(url, {
          method: "POST",
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

  return { create, isLoading, error } as const;
}
