"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

import type { SalaryHistoryEntry } from "./useGetSalaryHistory";

type UpdateSalaryPayload = {
  salaryId: number;
  salary: number;
  effectiveDate: string; // ISO YYYY-MM-DD
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

async function updateSalaryHistory(
  employeeId: number | string,
  { salaryId, salary, effectiveDate }: UpdateSalaryPayload
): Promise<SalaryHistoryEntry> {
  const token = getCookie("token") as string | undefined;
  const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
    String(employeeId)
  )}/salary-history/${salaryId}/`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ salary, effective_date: effectiveDate }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || errorData.detail || "Failed to update salary record.");
  }

  const data = await res.json();
  return {
    id: data.id,
    position: data.position ?? "",
    salary: typeof data.salary === "string" ? Number(data.salary) : Number(data.salary ?? 0),
    effectiveDate: data.effective_date,
  };
}

export function useUpdateSalaryHistory(employeeId?: number | string) {
  const queryClient = useQueryClient();

  return useMutation<SalaryHistoryEntry, Error, UpdateSalaryPayload>(
    (payload) => updateSalaryHistory(employeeId!, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["salaryHistoryCache", employeeId]);
        queryClient.invalidateQueries(["salaryAnalysisCache", employeeId]);
      },
    }
  );
}
