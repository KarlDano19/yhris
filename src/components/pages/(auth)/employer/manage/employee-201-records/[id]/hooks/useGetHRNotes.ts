"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export type HRNote = {
  id: number;
  employee: number;
  employee_id?: string | null;
  note_content: string;
  date_created: string;
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

type HRNotesResponse = {
  notes: HRNote[];
  meta?: Omit<ObjectManagerMeta<HRNote>, "records"> & { count: number };
};

async function getHRNotes(
  employeeId: number | string,
  opts: UseGetHRNotesOptions
): Promise<HRNotesResponse> {
  try {
    const token = getCookie("token");
    const params = new URLSearchParams();
    if (opts.pageSize) params.set("page_size", String(opts.pageSize));
    if (opts.page) params.set("current_page", String(opts.page));

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
        )}/hr-notes/` + (params.toString() ? `?${params.toString()}` : "");

      const res = await fetch(url, config);
      if (!res.ok) {
        throw res.json();
      }

      const payload = await res.json();

      let records: HRNote[] = [];
      let meta: HRNotesResponse["meta"] | undefined;

      if (Array.isArray(payload)) {
        records = payload as HRNote[];
      } else if (payload?.records && Array.isArray(payload.records)) {
        records = payload.records as HRNote[];
        meta = {
          total_records: Number(
            payload.total_records ?? payload.totalRecords ?? records.length
          ),
          total_pages: Number(payload.total_pages ?? payload.totalPages ?? 1),
          current_page: Number(payload.current_page ?? payload.currentPage ?? 1),
          page_size: Number(
            payload.page_size ?? payload.pageSize ?? records.length
          ),
          starting: Number(payload.starting ?? 0),
          ending: Number(payload.ending ?? records.length),
          count: records.length,
        };
      } else if (payload?.data && Array.isArray(payload.data)) {
        records = payload.data as HRNote[];
      }

      return { notes: records, meta };
    }
    return { notes: [] };
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
    throw new Error("Failed to fetch HR notes.");
  }
}

export function useGetHRNotes(
  employeeId?: number | string,
  opts: UseGetHRNotesOptions = {}
) {
  const [options] = useState(opts);

  const query = useQuery(
    ["hrNotesCache", employeeId, options.pageSize, options.page],
    () => {
      if (!employeeId) throw new Error("Missing employeeId");
      return getHRNotes(employeeId, options);
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!employeeId,
    }
  );

  return {
    notes: query.data?.notes ?? [],
    isLoading: query.isLoading,
    error: query.error as Error | undefined,
    meta: query.data?.meta,
    refetch: query.refetch,
  };
}
