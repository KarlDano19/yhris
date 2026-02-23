"use client";

import { useQuery } from "@tanstack/react-query";
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

async function getSalaryHistory(
  employeeId: number | string,
  opts: UseGetSalaryHistoryOptions = {}
): Promise<{
  entries: SalaryHistoryEntry[];
  meta?: UseGetSalaryHistoryResult["meta"];
}> {
  try {
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

    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
    };

    if (token) {
      const res = await fetch(url, config);
      if (!res.ok) {
        throw res.json();
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

      return { entries: mapped, meta: metaOut };
    }

    return { entries: [], meta: undefined };
  } catch (error: any) {
    let errStringify = await error;
    if (Object.hasOwn(errStringify, "response")) {
      throw errStringify.response.data.detail;
    }
    if (Object.hasOwn(errStringify, "detail")) {
      throw errStringify;
    }
    if (Object.hasOwn(errStringify, "message")) {
      throw errStringify.message;
    }
    throw new Error("Failed to fetch salary history.");
  }
}

export function useGetSalaryHistory(
  employeeId?: number | string,
  opts: UseGetSalaryHistoryOptions = {}
): UseGetSalaryHistoryResult {
  const queryResult = useQuery(
    ["salaryHistoryCache", employeeId, opts.pageSize, opts.page, opts.start, opts.end],
    () => getSalaryHistory(employeeId!, opts),
    {
      enabled: !!employeeId,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return {
    entries: queryResult.data?.entries ?? [],
    meta: queryResult.data?.meta,
    isLoading: queryResult.isLoading,
    error: queryResult.error as Error | undefined,
    refetch: queryResult.refetch,
  };
}
