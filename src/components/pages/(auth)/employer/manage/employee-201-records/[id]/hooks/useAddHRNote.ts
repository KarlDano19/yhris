"use client";

import { useCallback, useState } from "react";
import { getCookie } from "cookies-next";
import type { HRNote } from "./useGetHRNotes";

const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

type AddResult =
  | { ok: true; data: HRNote; status: number }
  | { ok: false; error: Error; status?: number };

export function useAddHRNote(employeeId?: number | string) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addNote = useCallback(
    async (noteContent: string): Promise<AddResult> => {
      if (!employeeId) {
        const err = new Error("Missing employeeId");
        setError(err);
        return { ok: false, error: err };
      }
      const trimmed = (noteContent || "").trim();
      if (!trimmed) {
        const err = new Error("Note content cannot be empty.");
        setError(err);
        return { ok: false, error: err };
      }

      setIsSaving(true);
      setError(null);

      const token = getCookie("token") as string | undefined;
      const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
        String(employeeId)
      )}/hr-notes/`;

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(token ? { Authorization: `Token ${token}` } : {}),
          },
          body: JSON.stringify({ note_content: trimmed }),
        });

        if (!res.ok) {
          let msg = `Request failed (${res.status})`;
          try {
            const problem = await res.json();
            msg =
              typeof problem === "string"
                ? problem
                : problem?.message ||
                  problem?.detail ||
                  JSON.stringify(problem);
          } catch {}
          throw new Error(msg);
        }

        const payload = (await res.json()) as HRNote;
        setIsSaving(false);
        return { ok: true, data: payload, status: res.status };
      } catch (e: any) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        setIsSaving(false);
        return { ok: false, error: err };
      }
    },
    [employeeId]
  );

  return { isSaving, error, addNote } as const;
}
