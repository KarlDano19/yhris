"use client";

import { useQuery } from "@tanstack/react-query";
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

async function getSalaryAnalysis(
  employeeId: number | string,
  opts: Options = {}
): Promise<SalaryAnalysis> {
  try {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
    const token = getCookie("token") as string | undefined;

    const params = new URLSearchParams();
    if (opts.start) params.set("start", opts.start);
    if (opts.end) params.set("end", opts.end);

    const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
      String(employeeId)
    )}/salary-history/analysis/${params.toString() ? `?${params.toString()}` : ""}`;

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
    throw new Error("Failed to fetch salary analysis.");
  }
}

export function useGetSalaryAnalysis(employeeId?: number | string, opts: Options = {}) {
  const queryResult = useQuery(
    ["salaryAnalysisCache", employeeId, opts.start, opts.end],
    () => getSalaryAnalysis(employeeId!, opts),
    {
      enabled: !!employeeId,
      refetchOnWindowFocus: false,
    }
  );

  return {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error as Error | undefined,
    refetch: queryResult.refetch,
  };
}
