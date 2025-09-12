"use client";

import { useState } from "react";
import { getCookie } from "cookies-next";

const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

export function useDeleteEmploymentHistory(employeeId?: number | string) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const deleteEntry = async (
    histId: number
  ): Promise<{ ok: boolean; error?: Error }> => {
    if (!employeeId) return { ok: false, error: new Error("No employee ID provided") };
    setIsDeleting(true);
    setError(undefined);

    const token = getCookie("token") as string | undefined;
    const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(String(employeeId))}/employment-history/${histId}/`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const problem = await res.json().catch(() => ({}));
        throw new Error(problem?.detail || problem?.message || `Request failed (${res.status})`);
      }

      return { ok: true };
    } catch (e: any) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      return { ok: false, error: err };
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, error, deleteEntry };
}
