"use client";

import { useCallback, useState } from "react";

import { getCookie } from "cookies-next";
import type { Employee } from "@/types/employee-201-records/employee";

export type EmploymentPatch = Partial<
  Pick<Employee, "system_id" | "date_hired" | "employment_status" | "location" | "position" | "department">
>;

export type PatchResult<T = unknown> =
  | { ok: true; data: T; status: number; savedAt: number }
  | { ok: false; error: Error };

export function useEmploymentDetailsPatch(employeeId?: string) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const save = useCallback(
    async (payload: EmploymentPatch): Promise<PatchResult<EmploymentPatch>> => {
      if (!employeeId) return { ok: false, error: new Error("Missing employeeId") };
      // Build URL like the personal-details hook
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
      if (!baseUrl) return { ok: false, error: new Error("Missing NEXT_PUBLIC_API_URL") };

      const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(employeeId)}/employment-details/`;

      setIsSaving(true);
      setError(null);

      try {
        const token = getCookie("token") as string | undefined;

        const res = await fetch(url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Token ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          let msg = `HTTP ${res.status}`;
          try {
            const problem = await res.json();
            msg =
              typeof problem === "string"
                ? problem
                : problem?.detail || problem?.message || msg;
          } catch {}
          throw new Error(msg);
        }

        let data: any = {};
        try {
          data = await res.json();
        } catch {
          data = payload; 
        }

        setIsSaving(false);
        return { ok: true, data, status: res.status, savedAt: Date.now() };
      } catch (e: any) {
        const err = e instanceof Error ? e : new Error(String(e));
        setIsSaving(false);
        setError(err);
        return { ok: false, error: err };
      }
    },
    [employeeId]
  );

  return { isSaving, error, save } as const;
}
