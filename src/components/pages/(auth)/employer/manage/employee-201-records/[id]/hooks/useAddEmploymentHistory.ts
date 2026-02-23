"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export type EmploymentHistoryEntry = {
  id: number;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description?: string;
};

type AddEmploymentHistoryData = Omit<
  EmploymentHistoryEntry,
  "id" | "employee_id"
>;

type AddEmploymentHistoryParams = {
  employeeId: number | string;
  entry: AddEmploymentHistoryData;
};

async function addEmploymentHistory(
  params: AddEmploymentHistoryParams
): Promise<EmploymentHistoryEntry> {
  const token = getCookie("token");
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
    String(params.employeeId)
  )}/employment-history/`;

  const config: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(params.entry),
  };

  const res = await fetch(url, config);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.detail || errorData?.message || "Failed to add employment history."
    );
  }

  return res.json();
}

export function useAddEmploymentHistory(employeeId?: number | string) {
  const queryClient = useQueryClient();

  return useMutation<EmploymentHistoryEntry, Error, AddEmploymentHistoryData>(
    (entry: AddEmploymentHistoryData) => {
      if (!employeeId) {
        throw new Error("No employee ID provided");
      }
      return addEmploymentHistory({ employeeId, entry });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["employmentHistoryCache", employeeId]);
        queryClient.invalidateQueries(["employee", employeeId]);
      },
    }
  );
}
