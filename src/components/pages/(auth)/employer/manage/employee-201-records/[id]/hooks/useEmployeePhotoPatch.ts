"use client";

import { useCallback, useState } from "react";
import { getCookie } from "cookies-next";
import type { Employee } from "@/types/employee-201-records/employee";

export type PatchResult<T = unknown> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: Error; status?: number };

export function useEmployeePhotoPatch(employeeId?: string) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const buildUrl = () => {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
    if (!baseUrl) throw new Error("Missing NEXT_PUBLIC_API_URL");
    if (!employeeId) throw new Error("Missing employeeId");
    // Same endpoint style as your personal-info API
    return `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
      employeeId
    )}/personal-info/`;
  };

  const upload = useCallback(
    async (file: File): Promise<PatchResult<Partial<Employee>>> => {
      try {
        const url = buildUrl();
        setIsSaving(true);
        setError(null);

        if (!file) throw new Error("No file selected.");
        // (Optional) lightweight guard here; UI already validates:
        if (!/^image\//.test(file.type))
          throw new Error("Please select an image file.");
        if (file.size > 10 * 1024 * 1024)
          throw new Error("Max file size is 10MB.");

        const form = new FormData();
        form.append("photo", file);

        const token = getCookie("token") as string | undefined;
        const res = await fetch(url, {
          method: "PATCH",
          headers: {
            ...(token ? { Authorization: `Token ${token}` } : {}),
            // do NOT set Content-Type for FormData
          },
          body: form,
        });

        if (!res.ok) {
          let msg: string;
          try {
            const problem = await res.json();
            msg =
              typeof problem === "string"
                ? problem
                : problem?.detail ||
                  problem?.message ||
                  JSON.stringify(problem);
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

  const remove = useCallback(async (): Promise<
    PatchResult<Partial<Employee>>
  > => {
    try {
      const url = buildUrl();
      setIsSaving(true);
      setError(null);

      const form = new FormData();
      form.append("remove", "1");

      const token = getCookie("token") as string | undefined;
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
        body: form,
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
  }, [employeeId]);

  return { isSaving, error, upload, remove } as const;
}
