"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getCookie } from "cookies-next";

/** UI shape you already use */
export type SalaryHistoryEntry = {
  position: string;
  salary: number;
  effectiveDate: string; // ISO
};

type ApiSalaryRecord = {
  id: number;
  salary: string | number;
  position: string;
  effective_date: string; // ISO
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

type UseGetSalaryHistoryOptions = {
  pageSize?: number;
  page?: number;
  start?: string; // YYYY-MM-DD
  end?: string;   // YYYY-MM-DD
};

type UseGetSalaryHistoryResult = {
  entries: SalaryHistoryEntry[];
  isLoading: boolean;
  error?: Error;
  /** pagination info if backend returns ObjectManager meta */
  meta?: Omit<ObjectManagerMeta<ApiSalaryRecord>, "records"> & { count: number };
  refetch: () => void;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

export function useGetSalaryHistory(
  employeeId?: number | string,
  opts: UseGetSalaryHistoryOptions = {}
): UseGetSalaryHistoryResult {
  const [entries, setEntries] = useState<SalaryHistoryEntry[]>([]);
  const [meta, setMeta] = useState<UseGetSalaryHistoryResult["meta"] | undefined>(undefined);
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
    if (opts.start) params.set("start", opts.start);
    if (opts.end) params.set("end", opts.end);

    const url =
      `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
        String(employeeId)
      )}/salary-history/` + (params.toString() ? `?${params.toString()}` : "");

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
              : problem?.message || problem?.detail || JSON.stringify(problem);
        } catch {}
        throw new Error(msg);
      }

      const payload = await res.json();

      // Support both shapes:
      // 1) ObjectManager meta envelope: { total_records, ..., records: [...] }
      // 2) Plain list: [ ... ]
      let records: ApiSalaryRecord[] = [];
      let metaOut: UseGetSalaryHistoryResult["meta"] | undefined;

      if (Array.isArray(payload)) {
        records = payload;
        metaOut = undefined;
      } else if (payload?.records && Array.isArray(payload.records)) {
        records = payload.records;
        metaOut = {
          total_records: Number(payload.total_records ?? records.length),
          total_pages: Number(payload.total_pages ?? 1),
          current_page: Number(payload.current_page ?? 1),
          page_size: Number(payload.page_size ?? records.length),
          starting: Number(payload.starting ?? 0),
          ending: Number(payload.ending ?? records.length),
          count: records.length,
        };
      } else if (payload?.data && Array.isArray(payload.data)) {
        // tolerate { data: [...] }
        records = payload.data;
      } else {
        // last resort: try payload as list
        if (payload && typeof payload === "object") {
          // no-op; but we can't map it
          records = [];
        }
      }

      const mapped: SalaryHistoryEntry[] = records.map((r) => ({
        position: r.position ?? "",
        salary: typeof r.salary === "string" ? Number(r.salary) : Number(r.salary ?? 0),
        effectiveDate: r.effective_date,
      }));

      setEntries(mapped);
      setMeta(metaOut);
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


  return {
    entries,
    isLoading,
    error,
    meta,
    refetch: fetchAll,
  };
}
