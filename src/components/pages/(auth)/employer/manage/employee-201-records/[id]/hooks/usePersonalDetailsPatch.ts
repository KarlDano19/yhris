import { useCallback, useState } from "react";
import { getCookie } from "cookies-next";

import type { Employee } from "@/types/employee-201-records/employee";

export type PatchResult<T = unknown> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: Error; status?: number };

export function usePersonalDetailsPatch(employeeId?: string) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const save = useCallback(
    async (payload: Partial<Employee>): Promise<PatchResult<Partial<Employee>>> => {
      try {
        if (!employeeId) throw new Error("Missing employeeId");

        setIsSaving(true);
        setError(null);

        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
        if (!baseUrl) throw new Error("Missing NEXT_PUBLIC_API_URL");

        const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
          employeeId
        )}/personal-info/`;

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
          let msg: string;
          try {
            const problem = await res.json();
            msg =
              typeof problem === "string"
                ? problem
                : problem?.detail || problem?.message || JSON.stringify(problem);
          } catch {
            msg = res.statusText || `HTTP ${res.status}`;
          }
          throw new Error(msg);
        }

        const data = (await res.json().catch(() => ({}))) as Partial<Employee>;
        setIsSaving(false);
        return { ok: true, data, status: res.status };
      } catch (e: any) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        setIsSaving(false);
        return { ok: false, error: err };
      }
    },
    [employeeId]
  );

  return { isSaving, error, save } as const;
}

