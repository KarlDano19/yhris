"use client";

import { useCallback, useEffect, useState } from "react";
import { getCookie } from "cookies-next";

export type EmploymentHistoryEntry = {
  id: number;
  company: string;
  position: string;
  start_date: string; // ISO
  end_date: string | null; // ISO or null
  description?: string;
};

export type ObjectManagerMeta<T> = {
  total_records: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  starting: number;
  ending: number;
  records: T[];
};

type Options = {
  pageSize?: number;
  page?: number;
  start?: string; // YYYY-MM-DD
  end?: string;   // YYYY-MM-DD
};

type Result = {
  entries: EmploymentHistoryEntry[];
  isLoading: boolean;
  error?: Error;
  meta?: Omit<ObjectManagerMeta<EmploymentHistoryEntry>, "records"> & { count: number };
  refetch: () => void;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

export function useGetEmploymentHistory(employeeId?: number | string, opts: Options = {}): Result {
  const [entries, setEntries] = useState<EmploymentHistoryEntry[]>([]);
  const [meta, setMeta] = useState<Result["meta"] | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(!!employeeId);
  const [error, setError] = useState<Error | undefined>();

  const fetchAll = useCallback(async () => {
    if (!employeeId) return;
    setIsLoading(true);
    setError(undefined);

    const token = getCookie("token") as string | undefined;
    const params = new URLSearchParams();
    if (opts.pageSize) params.set("page_size", String(opts.pageSize));
    if (opts.page) params.set("current_page", String(opts.page));
    if (opts.start) params.set("start", opts.start);
    if (opts.end) params.set("end", opts.end);

    const url =
      `${baseUrl}/api/employee-201/employees/${encodeURIComponent(String(employeeId))}/employment-history/` +
      (params.toString() ? `?${params.toString()}` : "");

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
      });
      console.log(res)
      if (!res.ok) {
        const problem = await res.json().catch(() => ({}));
        throw new Error(problem?.detail || problem?.message || `Request failed (${res.status})`);
      }

      const payload = await res.json();

      if (payload?.records && Array.isArray(payload.records)) {
        setEntries(payload.records);
        setMeta({
          total_records: Number(payload.total_records ?? payload.records.length),
          total_pages: Number(payload.total_pages ?? 1),
          current_page: Number(payload.current_page ?? 1),
          page_size: Number(payload.page_size ?? payload.records.length),
          starting: Number(payload.starting ?? 0),
          ending: Number(payload.ending ?? payload.records.length),
          count: payload.records.length,
        });
      } else if (Array.isArray(payload)) {
        setEntries(payload);
        setMeta(undefined);
      } else {
        setEntries([]);
        setMeta(undefined);
      }
    } catch (e: any) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setEntries([]);
      setMeta(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [employeeId, opts.pageSize, opts.page, opts.start, opts.end]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { entries, isLoading, error, meta, refetch: fetchAll };
}
