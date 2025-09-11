"use client";

import { useState } from "react";
import { getCookie } from "cookies-next";

export type EmploymentHistoryEntry = {
  id: number;
  company: string;
  position: string;
  start_date: string; // ISO
  end_date: string | null; // ISO or null
  description?: string;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

export function useUpdateEmploymentHistory(employeeId?: number | string) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const updateEntry = async (
    histId: number,
    updates: Partial<Omit<EmploymentHistoryEntry, "id">>
  ): Promise<{ ok: boolean; data?: EmploymentHistoryEntry; error?: Error }> => {
    if (!employeeId) return { ok: false, error: new Error("No employee ID provided") };
    setIsUpdating(true);
    setError(undefined);

    const token = getCookie("token") as string | undefined;
    const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(String(employeeId))}/employment-history/${histId}/`;

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const problem = await res.json().catch(() => ({}));
        throw new Error(problem?.detail || problem?.message || `Request failed (${res.status})`);
      }

      const data: EmploymentHistoryEntry = await res.json();
      return { ok: true, data };
    } catch (e: any) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      return { ok: false, error: err };
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, error, updateEntry };
}
