"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export type EmploymentHistoryEntry = {
  id: number;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
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
  start?: string;
  end?: string;
};

type EmploymentHistoryResponse = {
  entries: EmploymentHistoryEntry[];
  meta?: Omit<ObjectManagerMeta<EmploymentHistoryEntry>, "records"> & {
    count: number;
  };
};

async function getEmploymentHistory(
  employeeId: number | string,
  opts: Options
): Promise<EmploymentHistoryResponse> {
  try {
    const token = getCookie("token");
    const params = new URLSearchParams();
    if (opts.pageSize) params.set("page_size", String(opts.pageSize));
    if (opts.page) params.set("current_page", String(opts.page));
    if (opts.start) params.set("start", opts.start);
    if (opts.end) params.set("end", opts.end);

    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };

    if (token) {
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
      const url =
        `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
          String(employeeId)
        )}/employment-history/` + (params.toString() ? `?${params.toString()}` : "");

      const res = await fetch(url, config);
      if (!res.ok) {
        throw res.json();
      }

      const payload = await res.json();

      if (payload?.records && Array.isArray(payload.records)) {
        return {
          entries: payload.records,
          meta: {
            total_records: Number(
              payload.total_records ?? payload.records.length
            ),
            total_pages: Number(payload.total_pages ?? 1),
            current_page: Number(payload.current_page ?? 1),
            page_size: Number(payload.page_size ?? payload.records.length),
            starting: Number(payload.starting ?? 0),
            ending: Number(payload.ending ?? payload.records.length),
            count: payload.records.length,
          },
        };
      } else if (Array.isArray(payload)) {
        return { entries: payload };
      }

      return { entries: [] };
    }
    return { entries: [] };
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
    throw new Error("Failed to fetch employment history.");
  }
}

export function useGetEmploymentHistory(
  employeeId?: number | string,
  opts: Options = {}
) {
  const [options] = useState(opts);

  const query = useQuery(
    [
      "employmentHistoryCache",
      employeeId,
      options.pageSize,
      options.page,
      options.start,
      options.end,
    ],
    () => {
      if (!employeeId) throw new Error("Missing employeeId");
      return getEmploymentHistory(employeeId, options);
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!employeeId,
    }
  );

  return {
    entries: query.data?.entries ?? [],
    isLoading: query.isLoading,
    error: query.error as Error | undefined,
    meta: query.data?.meta,
    refetch: query.refetch,
  };
}
