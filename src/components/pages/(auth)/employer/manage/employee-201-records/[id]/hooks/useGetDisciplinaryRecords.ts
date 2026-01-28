"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCookie } from "cookies-next";

export type DisciplinaryRecord = {
  id: number;
  nte_id: string;
  incident_date: string;
  place_of_incident: string;
  issue_type: string | null;
  brief_background: string;
  status: "pending" | "approved" | "disapproved";
  is_nte_sent: boolean;
  is_nte_received: boolean;
  incident_received_date: string | null;
  is_decision_sent: boolean;
  is_decision_received: boolean;
  decision_received_date: string | null;
  is_responded: boolean;
  prepared_by: string | null;
};

export type DisciplinaryListMeta = {
  total_records: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  starting: number;
  ending: number;
  records: DisciplinaryRecord[];
};

export type ListOptions = {
  current_page?: number;
  page_size?: number;
  start?: string;
  end?: string;
  status?: "pending" | "approved" | "disapproved" | "all";
  issue_type?: string;
};

function buildUrl(employeeId: number | string, opts: ListOptions): string {
  const base = `${process.env.NEXT_PUBLIC_API_URL}/api/employee-201/employees/${employeeId}/disciplinary-records/`;
  const params = new URLSearchParams();

  if (opts.current_page) params.append("current_page", String(opts.current_page));
  if (opts.page_size) params.append("page_size", String(opts.page_size));
  if (opts.start) params.append("start", opts.start);
  if (opts.end) params.append("end", opts.end);
  if (opts.status && opts.status !== "all") params.append("status", opts.status);
  if (opts.issue_type) params.append("issue_type", opts.issue_type);

  return params.toString() ? `${base}?${params}` : base;
}

export function useGetDisciplinaryRecords(
  employeeId?: number | string,
  initialOpts: ListOptions = {}
) {
  const [data, setData] = useState<DisciplinaryListMeta | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(!!employeeId);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [opts, setOpts] = useState<ListOptions>(initialOpts);

  const acRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => () => {
    mountedRef.current = false;
    acRef.current?.abort();
  }, []);

  const refetch = useCallback(async () => {
    if (!employeeId) return;

    acRef.current?.abort();
    const ac = new AbortController();
    acRef.current = ac;

    setIsLoading(true);
    setError(undefined);

    try {
      const token = getCookie("token") as string | undefined;
      const res = await fetch(buildUrl(employeeId, opts), {
        method: "GET",
        headers: {
          "content-type": "application/json",
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
        signal: ac.signal,
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

      if (payload?.data?.records && Array.isArray(payload.data.records)) {
        setData(payload.data);
      } else if (payload?.records && Array.isArray(payload.records)) {
        setData(payload);
      } else {
        setData({
          total_records: 0,
          total_pages: 1,
          current_page: 1,
          page_size: 0,
          starting: 0,
          ending: 0,
          records: [],
        });
      }
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setError(e instanceof Error ? e : new Error(String(e)));
      setData(undefined);
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, [employeeId, opts]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const setPage = useCallback((current_page: number) => {
    setOpts((o) => ({ ...o, current_page }));
  }, []);

  const setPageSize = useCallback((page_size: number) => {
    setOpts((o) => ({ ...o, page_size, current_page: 1 }));
  }, []);

  return { data, isLoading, error, refetch, setPage, setPageSize, setOpts } as const;
}
