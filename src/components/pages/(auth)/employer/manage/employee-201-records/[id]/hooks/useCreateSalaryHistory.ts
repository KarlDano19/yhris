"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

/** UI shape you already use elsewhere */
export type SalaryHistoryEntry = {
  position: string;
  salary: number;
  effectiveDate: string; // ISO YYYY-MM-DD
};

type ApiSalaryRecord = {
  id: number;
  salary: string | number;
  position: string;
  effective_date: string; // ISO
};

export type CreateResult<T = unknown> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: Error; status?: number };

const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

/** minimal guard */
function validate(entry: SalaryHistoryEntry) {
  if (!entry.position?.trim()) throw new Error("Position is required.");
  if (!Number.isFinite(entry.salary) || entry.salary <= 0) throw new Error("Salary must be > 0.");
  if (!entry.effectiveDate || Number.isNaN(new Date(entry.effectiveDate).getTime())) {
    throw new Error("A valid effective date (YYYY-MM-DD) is required.");
  }
}

function toApiPayload(entry: SalaryHistoryEntry): Record<string, any> {
  return {
    position: entry.position,
    salary: Number(entry.salary),
    effective_date: entry.effectiveDate,
  };
}

function fromApiPayload(api: ApiSalaryRecord): SalaryHistoryEntry {
  return {
    position: api.position ?? "",
    salary: typeof api.salary === "string" ? Number(api.salary) : Number(api.salary ?? 0),
    effectiveDate: api.effective_date,
  };
}

async function createSalaryHistory(
  employeeId: number | string,
  entry: SalaryHistoryEntry
): Promise<SalaryHistoryEntry> {
  validate(entry);

  const token = getCookie("token") as string | undefined;
  const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
    String(employeeId)
  )}/salary-history/`;

  const config: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(toApiPayload(entry)),
  };

  const res = await fetch(url, config);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || errorData.detail || "Failed to create salary history.");
  }

  const responseData = await res.json();

  // If server returns the created record -> map it; else fallback to the submitted entry
  const created =
    responseData && typeof responseData === "object" && ("effective_date" in responseData || "position" in responseData)
      ? fromApiPayload(responseData as ApiSalaryRecord)
      : entry;

  return created;
}

export function useCreateSalaryHistory(employeeId?: number | string) {
  const queryClient = useQueryClient();

  return useMutation<SalaryHistoryEntry, Error, SalaryHistoryEntry>(
    (entry: SalaryHistoryEntry) => createSalaryHistory(employeeId!, entry),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["salaryHistoryCache", employeeId]);
        queryClient.invalidateQueries(["salaryAnalysisCache", employeeId]);
      },
    }
  );
}
