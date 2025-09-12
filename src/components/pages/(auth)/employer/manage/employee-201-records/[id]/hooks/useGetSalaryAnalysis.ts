"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCookie } from "cookies-next";

export type SalaryAnalysis = {
  currentSalary: number;
  lastAdjustmentAmount: number;
  daysBetweenChanges: number;
  entries: Array<{
    position?: string | null;
    salary: number;
    effectiveDate: string;
  }>;
};

type Options = {
  start?: string;
  end?: string;
};

export function useGetSalaryAnalysis(employeeId?: number | string, opts: Options = {}) {
  const [data, setData] = useState<SalaryAnalysis | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  // keep a ref to abort in-flight request & guard against state set after unmount
  const acRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      acRef.current?.abort();
    };
  }, []);

  const fetchAnalysis = useCallback(async () => {
    if (!employeeId) return;

    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
    const token = getCookie("token") as string | undefined;

    const params = new URLSearchParams();
    if (opts.start) params.set("start", opts.start);
    if (opts.end) params.set("end", opts.end);

    const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
      String(employeeId)
    )}/salary-history/analysis/${params.toString() ? `?${params.toString()}` : ""}`;

    // cancel any in-flight request
    acRef.current?.abort();
    const ac = new AbortController();
    acRef.current = ac;

    setIsLoading(true);
    setError(undefined);

    try {
      const res = await fetch(url, {
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
              : problem?.detail || problem?.message || JSON.stringify(problem);
        } catch {}
        throw new Error(msg);
      }

      // passthrough: trust the server shape exactly as provided
      const payload: SalaryAnalysis = await res.json();

      if (mountedRef.current) setData(payload);
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      if (mountedRef.current) setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, [employeeId, opts.start, opts.end]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  return { data, isLoading, error, refetch: fetchAnalysis };
}
