"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

type UseCreateSalaryHistoryOptions = {
  /** Include Authorization header with cookie token (default: true) */
  withTokenHeader?: boolean;
  /** Extra headers (merged after defaults) */
  headers?: Record<string, string>;
  /** fetch credentials mode (e.g. "include") */
  credentials?: RequestCredentials;
};

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

export function useCreateSalaryHistory(
  employeeId?: number | string,
  options: UseCreateSalaryHistoryOptions = {}
) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastCreated, setLastCreated] = useState<SalaryHistoryEntry | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => () => abortRef.current?.abort(), []);

  const create = useCallback(
    async (entry: SalaryHistoryEntry): Promise<CreateResult<SalaryHistoryEntry>> => {
      if (!employeeId) {
        const err = new Error("Missing employeeId");
        setError(err);
        return { ok: false, error: err };
      }

      try {
        validate(entry);
      } catch (e: any) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        return { ok: false, error: err };
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsSaving(true);
      setError(null);

      const { withTokenHeader = true, headers, credentials } = options;

      try {
        const token = withTokenHeader ? (getCookie("token") as string | undefined) : undefined;
        const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
          String(employeeId)
        )}/salary-history/`;

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Token ${token}` } : {}),
            ...(headers || {}),
          },
          credentials,
          body: JSON.stringify(toApiPayload(entry)),
          signal: controller.signal,
        });

        if (!res.ok) {
          // Try JSON problem details; fallback to text
          let msg: string;
          try {
            const problem = await res.json();
            msg =
              typeof problem === "string"
                ? problem
                : problem?.detail || problem?.message || JSON.stringify(problem);
          } catch {
            msg = await res.text().catch(() => res.statusText || `HTTP ${res.status}`);
          }
          throw new Error(msg || `HTTP ${res.status}`);
        }

        // response can be serializer object (recommended)
        let dataObj: any = {};
        try {
          dataObj = await res.json();
        } catch {
          dataObj = {};
        }

        // If server returns the created record -> map it; else fallback to the submitted entry
        const created =
          dataObj && typeof dataObj === "object" && ("effective_date" in dataObj || "position" in dataObj)
            ? fromApiPayload(dataObj as ApiSalaryRecord)
            : entry;

        setLastCreated(created);
        setIsSaving(false);
        return { ok: true, data: created, status: res.status };
      } catch (e: any) {
        if (e?.name === "AbortError") {
          setIsSaving(false);
          return { ok: false, error: e };
        }
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        setIsSaving(false);
        return { ok: false, error: err };
      }
    },
    [employeeId, options]
  );

  const abort = useCallback(() => abortRef.current?.abort(), []);

  return { create, isSaving, error, lastCreated, abort } as const;
}
