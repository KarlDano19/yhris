"use client";

import { useState } from "react";
import { getCookie } from "cookies-next";

const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

export type EmploymentHistoryEntry = {
  id: number;
  company: string;
  position: string;
  start_date: string; 
  end_date: string | null; 
  description?: string;
};

export function useAddEmploymentHistory(employeeId?: number | string) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const addEntry = async (
    entry: Omit<EmploymentHistoryEntry, "id" | "employee_id">
  ): Promise<{ ok: boolean; data?: EmploymentHistoryEntry; error?: Error }> => {
    if (!employeeId) return { ok: false, error: new Error("No employee ID provided") };
    setIsSaving(true);
    setError(undefined);

    const token = getCookie("token") as string | undefined;
    const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(String(employeeId))}/employment-history/`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
        body: JSON.stringify(entry),
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
      setIsSaving(false);
    }
  };

  return { isSaving, error, addEntry };
}
