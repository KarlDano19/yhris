"use client";

import { useCallback, useEffect, useState } from "react";
import { getCookie } from "cookies-next";

/* ---------- Types ---------- */

export type HRNote = {
  id: number;
  employee: number;              // pk
  employee_id?: string | null;   // public id (read-only)
  note_content: string;
  date_created: string;          // ISO
};

type ObjectManagerMeta<T> = {
  total_records: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  starting: number;
  ending: number;
  records: T[];
};

export type UseGetHRNotesOptions = {
  pageSize?: number;
  page?: number;
};

export type UseGetHRNotesResult = {
  notes: HRNote[];
  isLoading: boolean;
  error?: Error;
  /** Pagination meta (if backend returns ObjectManager envelope) */
  meta?: Omit<ObjectManagerMeta<HRNote>, "records"> & { count: number };
  refetch: () => void;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

/* ---------- Hook ---------- */

export function useGetHRNotes(
  employeeId?: number | string,
  opts: UseGetHRNotesOptions = {}
): UseGetHRNotesResult {
  const [notes, setNotes] = useState<HRNote[]>([]);
  const [meta, setMeta] =
    useState<UseGetHRNotesResult["meta"] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(!!employeeId);
  const [error, setError] = useState<Error | undefined>(undefined);

  const fetchAll = useCallback(async () => {
    if (!employeeId) return;
    setIsLoading(true);
    setError(undefined);

    const token = getCookie("token") as string | undefined;

    const params = new URLSearchParams();
    if (opts.pageSize) params.set("page_size", String(opts.pageSize));
    if (opts.page) params.set("current_page", String(opts.page));

    const url =
      `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
        String(employeeId)
      )}/hr-notes/` + (params.toString() ? `?${params.toString()}` : "");

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
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

      const payload = await res.json();

      // Accept either:
      // 1) ObjectManager envelope: { total_records, ..., records: [...] }
      // 2) Plain list: [ ... ]
      // 3) Your camel-case variant (totalRecords, totalPages, ...)
      let records: HRNote[] = [];
      let metaOut: UseGetHRNotesResult["meta"] | undefined;

      if (Array.isArray(payload)) {
        records = payload as HRNote[];
      } else if (payload?.records && Array.isArray(payload.records)) {
        records = payload.records as HRNote[];
        metaOut = {
          total_records: Number(payload.total_records ?? payload.totalRecords ?? records.length),
          total_pages: Number(payload.total_pages ?? payload.totalPages ?? 1),
          current_page: Number(payload.current_page ?? payload.currentPage ?? 1),
          page_size: Number(payload.page_size ?? payload.pageSize ?? records.length),
          starting: Number(payload.starting ?? 0),
          ending: Number(payload.ending ?? records.length),
          count: records.length,
        };
      } else if (payload?.data && Array.isArray(payload.data)) {
        records = payload.data as HRNote[];
      }

      setNotes(records);
      setMeta(metaOut);
    } catch (e: any) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setNotes([]);
      setMeta(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [employeeId, opts.pageSize, opts.page]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { notes, isLoading, error, meta, refetch: fetchAll };
}
