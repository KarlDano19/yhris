"use client";

import { useQuery } from "@tanstack/react-query";
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

async function getEmploymentHistoryAnalysis(
  employeeId: number | string,
  params?: AnalysisParams
): Promise<EmploymentHistoryAnalysis> {
  try {
    const token = getCookie("token") as string | undefined;

    const qs = new URLSearchParams();
    if (params?.as_of) qs.set("as_of", params.as_of);
    if (params?.include_details) qs.set("include_details", "1");
    const q = qs.toString();

    const url = `${API_URL}/api/employee-201/employees/${encodeURIComponent(
      String(employeeId)
    )}/employment-history/analysis/${q ? `?${q}` : ""}`;

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
      return res.json();
    }

    throw new Error("No authentication token");
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
    throw new Error("Failed to fetch employment history analysis.");
  }
}

/** ---------- Hook (backwards compatible) ---------- */
export function useEmploymentHistoryAnalysis(
  employeeId?: number | string,
  params?: AnalysisParams
) {
  const queryResult = useQuery(
    ["employmentAnalysisCache", employeeId, params?.as_of, params?.include_details],
    () => getEmploymentHistoryAnalysis(employeeId!, params),
    {
      enabled: !!employeeId,
      refetchOnWindowFocus: false,
    }
  );

  return {
    data: queryResult.data ?? null,
    error: queryResult.error ? (queryResult.error as Error).message : null,
    loading: queryResult.isLoading,
    fetchAnalysis: queryResult.refetch,
    reset: () => queryResult.remove(),
  };
}
