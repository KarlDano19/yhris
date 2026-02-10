"use client";

// 1. React imports (none needed)

// 2. Third-party library imports
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export type EmploymentHistoryEntry = {
  id: number;
  company: string;
  position: string;
  start_date: string; // ISO
  end_date: string | null; // ISO or null
  description?: string;
};

type UpdateEmploymentHistoryData = {
  histId: number;
  updates: Partial<Omit<EmploymentHistoryEntry, "id">>;
};

type UpdateEmploymentHistoryParams = {
  employeeId: number | string;
  histId: number;
  updates: Partial<Omit<EmploymentHistoryEntry, "id">>;
};

async function updateEmploymentHistory(
  params: UpdateEmploymentHistoryParams
): Promise<EmploymentHistoryEntry> {
  const token = getCookie("token");
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
    String(params.employeeId)
  )}/employment-history/${params.histId}/`;

  const config: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(params.updates),
  };

  const res = await fetch(url, config);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.detail || errorData?.message || "Failed to update employment history."
    );
  }

  return res.json();
}

export function useUpdateEmploymentHistory(employeeId?: number | string) {
  const queryClient = useQueryClient();

  return useMutation<EmploymentHistoryEntry, Error, UpdateEmploymentHistoryData>(
    (data: UpdateEmploymentHistoryData) => {
      if (!employeeId) {
        throw new Error("No employee ID provided");
      }
      return updateEmploymentHistory({
        employeeId,
        histId: data.histId,
        updates: data.updates,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["employmentHistoryCache", employeeId]);
        queryClient.invalidateQueries(["employee", employeeId]);
      },
    }
  );
}
