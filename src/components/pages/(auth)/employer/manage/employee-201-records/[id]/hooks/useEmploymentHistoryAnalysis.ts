"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { getCookie } from "cookies-next";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

/** ---------- Types (snake_case to match backend) ---------- */
export type EmploymentHistoryAnalysisRecord = {
  id: number | string;
  title: string;
  company: string;
  start_date: string | null;
  end_date: string | null;
  duration_months: number;
  duration_pretty: string;
  rank: number | null;
  rank_key: string | null;
  industry?: string | null;
  department?: string | null;
};

export type EmploymentHistoryAnalysis = {
  employee_id: string;
  as_of: string;
  total_experience_months: number;
  total_experience: string;
  average_tenure_months: number;
  average_tenure: string;
  current_role: {
    title: string;
    company: string;
    tenure: string;
    tenure_months: number;
  } | null;
  longest_tenure: {
    title: string;
    company: string;
    tenure: string;
    tenure_months: number;
  } | null;
  stability_indicator: "Stable" | "Moderate" | "High Turnover Risk" | "Insufficient Data";
  career_progression: Array<{
    from: string;
    to: string;
    type: "Progression" | "Lateral Move" | "Regression" | "Unclassified / Career Shift";
  }>;
  overall_path: string;
  industry_consistency_pct?: number;
  top_industry?: string;
  details?: EmploymentHistoryAnalysisRecord[];
};

export type AnalysisParams = {
  as_of?: string;            // YYYY-MM-DD (optional)
  include_details?: boolean; // default false
};

type State<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

/** ---------- Hook (backwards compatible) ---------- */
export function useEmploymentHistoryAnalysis() {
  const [state, setState] = useState<State<EmploymentHistoryAnalysis>>({
    data: null,
    error: null,
    loading: false,
  });

  // optional: keep a ref to cancel ongoing request if caller passes no signal
  const acRef = useRef<AbortController | null>(null);

  const buildUrl = useCallback((employeeId: number | string, params?: AnalysisParams) => {
    const qs = new URLSearchParams();
    if (params?.as_of) qs.set("as_of", params.as_of);
    if (params?.include_details) qs.set("include_details", "1");
    const q = qs.toString();
    return `${API_URL}/api/employee-201/employees/${encodeURIComponent(
      String(employeeId)
    )}/employment-history/analysis/${q ? `?${q}` : ""}`;
  }, []);

  const getToken = useCallback(() => {
    return (getCookie("token") as string | undefined) || "";
  }, []);

  const fetchAnalysis = useCallback(
    async (employeeId: number | string, params?: AnalysisParams, signal?: AbortSignal) => {
      // If no external signal provided, manage our own AbortController
      if (!signal) {
        acRef.current?.abort();
        acRef.current = new AbortController();
        signal = acRef.current.signal;
      }

      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const url = buildUrl(employeeId, params);
        const token = getToken();

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            ...(token ? { Authorization: `Token ${token}` } : {}),
          },
          signal,
          cache: "no-store",
        });

        if (!res.ok) {
          let msg = `Request failed (${res.status})`;
          try {
            const problem = await res.json();
            msg =
              typeof problem === "string"
                ? problem
                : problem?.detail || problem?.message || JSON.stringify(problem);
          } catch {
            // fall back to text if JSON parsing fails
            try {
              const text = await res.text();
              if (text) msg = text;
            } catch {}
          }
          throw new Error(msg);
        }

        const json = (await res.json()) as EmploymentHistoryAnalysis;
        setState({ data: json, error: null, loading: false });
        return json;
      } catch (err: any) {
        if (err?.name === "AbortError") {
          // do not clobber state on abort; keep loading=false
          setState((s) => ({ ...s, loading: false }));
          return;
        }
        setState({ data: null, error: err?.message || "Failed to fetch analysis.", loading: false });
        throw err;
      }
    },
    [buildUrl, getToken]
  );

  const reset = useCallback(() => {
    // abort any inflight if we created it
    acRef.current?.abort();
    setState({ data: null, error: null, loading: false });
  }, []);

  return useMemo(
    () => ({
      ...state,
      fetchAnalysis, // <-- preserved
      reset,
    }),
    [state, fetchAnalysis, reset]
  );
}
