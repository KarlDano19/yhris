"use client";

import { useCallback, useState } from "react";
import { getCookie } from "cookies-next";

const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

type DeleteResult =
  | { ok: true; status: number }
  | { ok: false; error: Error; status?: number };

export function useDeleteHRNote(employeeId?: number | string) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteNote = useCallback(
    async (noteId: number | string): Promise<DeleteResult> => {
      if (!employeeId) {
        const err = new Error("Missing employeeId");
        setError(err);
        return { ok: false, error: err };
      }
      if (!noteId && noteId !== 0) {
        const err = new Error("Missing note id");
        setError(err);
        return { ok: false, error: err };
      }

      setIsDeleting(true);
      setError(null);

      const token = getCookie("token") as string | undefined;
      const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
        String(employeeId)
      )}/hr-notes/${encodeURIComponent(String(noteId))}/`;

      try {
        const res = await fetch(url, {
          method: "DELETE",
          headers: {
            ...(token ? { Authorization: `Token ${token}` } : {}),
          },
        });

        if (!res.ok && res.status !== 204) {
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

        setIsDeleting(false);
        return { ok: true, status: res.status };
      } catch (e: any) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        setIsDeleting(false);
        return { ok: false, error: err };
      }
    },
    [employeeId]
  );

  return { isDeleting, error, deleteNote } as const;
}
