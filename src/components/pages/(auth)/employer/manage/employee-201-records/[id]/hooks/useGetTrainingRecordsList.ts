"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCookie } from "cookies-next";

import { listUrl } from "../utils/trainingRecordUtils";
import type { ListOptions, TrainingListMeta } from "../types/trainingRecords";

export function useGetTrainingRecordsList(
  employeeId?: number | string,
  initialOpts: ListOptions = {}
) {
  const [data, setData] = useState<TrainingListMeta | undefined>(undefined);
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
      const res = await fetch(listUrl(employeeId, opts), {
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

      if (Array.isArray(payload)) {
        setData({
          total_records: payload.length,
          total_pages: 1,
          current_page: 1,
          page_size: payload.length,
          starting: 0,
          ending: payload.length,
          records: payload,
        });
      } else if (payload?.records && Array.isArray(payload.records)) {
        setData(payload);
      } else if (payload?.data && Array.isArray(payload.data)) {
        setData({
          total_records: payload.data.length,
          total_pages: 1,
          current_page: 1,
          page_size: payload.data.length,
          starting: 0,
          ending: payload.data.length,
          records: payload.data,
        });
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
