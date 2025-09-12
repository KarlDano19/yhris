"use client";

import { useCallback, useState } from "react";

import { getCookie } from "cookies-next";
import { detailUrl } from "../utils/trainingRecordUtils";

export function useDeleteTrainingRecord() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const remove = useCallback(
    async (employeeId: number | string, recordId: number | string): Promise<void> => {
      setIsLoading(true);
      setError(undefined);
      try {
        const token = getCookie("token") as string | undefined;

        const res = await fetch(detailUrl(employeeId, recordId), {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            ...(token ? { Authorization: `Token ${token}` } : {}),
          },
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
      } catch (e: any) {
        setError(e instanceof Error ? e : new Error(String(e)));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { remove, isLoading, error } as const;
}
