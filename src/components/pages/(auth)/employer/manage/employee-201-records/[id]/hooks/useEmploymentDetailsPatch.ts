import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Employment Details PATCH (mirrors the Personal Details hook style)
 * — No salary/employment history in this version —
 */
export type EmploymentDetailsPayload = {
  systemId?: string;
  hireDate?: string; // ISO yyyy-mm-dd
  employmentStatus?: "Active" | "Probationary" | "Contract" | "On Leave" | "Terminated" | string;
  location?: string;
  salary?: number; // numeric amount
};

export type PatchSimOptions = {
  /** Artificial delay range in ms (inclusive). Default: [700, 1500] */
  delayRangeMs?: [number, number];
  /** Failure probability (0..1). Default: 0 */
  failRate?: number;
  /** Force deterministic outcome for tests */
  forceResult?: "success" | "error";
};

export type PatchResult<T = unknown> =
  | { ok: true; data: T; status: number; savedAt: number }
  | { ok: false; error: Error; status?: number };

export type UseEmploymentDetailsPatchOptions = {
  /** If provided, real API base URL; if omitted, a simulated call is used. */
  apiBaseUrl?: string; // e.g. "/api"
  /** Endpoint override; default: `/employees/:id/employment-details` */
  endpoint?: string | ((employeeId: string) => string);
  /** Include credentials in fetch (when apiBaseUrl is set) */
  credentials?: RequestCredentials;
  /** Additional headers for real fetch */
  headers?: Record<string, string>;
  /** Simulation knobs (used when apiBaseUrl is not set) */
  sim?: PatchSimOptions;
};

// ------------------- Helpers -------------------

function toIsoDate(input?: string | Date | null): string | undefined {
  if (!input) return undefined;
  const d = input instanceof Date ? input : new Date(String(input));
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10); // yyyy-mm-dd
}

function parseMoney(input?: string | number | null): number | undefined {
  if (input === null || input === undefined || input === "") return undefined;
  if (typeof input === "number") return input;
  const n = Number(String(input).replace(/[^0-9.-]/g, ""));
  return Number.isNaN(n) ? undefined : n;
}

/** Optional minimal validation */
function validatePayload(p: EmploymentDetailsPayload) {
  if (p.hireDate && !/^\d{4}-\d{2}-\d{2}$/.test(p.hireDate)) {
    throw new Error("hireDate must be ISO yyyy-mm-dd");
  }
  if (p.salary != null && (typeof p.salary !== "number" || Number.isNaN(p.salary))) {
    throw new Error("salary must be a number");
  }
  return true;
}

/**
 * Normalize a loose patch object from the form
 * Accepts Date/"MM/DD/YYYY"/ISO for hireDate and money strings for salary.
 */
export function buildEmploymentDetailsPayload(patch: Record<string, any>): EmploymentDetailsPayload {
  const out: EmploymentDetailsPayload = {};

  if (patch.systemId !== undefined) out.systemId = String(patch.systemId);
  if (patch.hireDate !== undefined) out.hireDate = toIsoDate(patch.hireDate);
  if (patch.employmentStatus !== undefined) out.employmentStatus = String(patch.employmentStatus);
  if (patch.location !== undefined) out.location = String(patch.location);
  if (patch.salary !== undefined) out.salary = parseMoney(patch.salary);

  return out;
}

// ------------------- Hook -------------------

export function useEmploymentDetailsPatch(
  employeeId?: string,
  options: UseEmploymentDetailsPatchOptions = {}
) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const save = useCallback(
    async (payload: EmploymentDetailsPayload): Promise<PatchResult<EmploymentDetailsPayload>> => {
      if (!employeeId) {
        const err = new Error("Missing employeeId");
        setError(err);
        return { ok: false, error: err };
      }

      try {
        validatePayload(payload);
      } catch (e: any) {
        setError(e);
        return { ok: false, error: e };
      }

      // Abort any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsSaving(true);
      setError(null);

      const { apiBaseUrl, endpoint, headers, credentials, sim } = options;

      try {
        if (apiBaseUrl) {
          // --- Real API mode ---
          const resolved =
            typeof endpoint === "function"
              ? endpoint(employeeId)
              : endpoint || `/employees/${employeeId}/employment-details`;

          const res = await fetch(`${apiBaseUrl}${resolved}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", ...(headers || {}) },
            credentials,
            body: JSON.stringify(payload),
            signal: controller.signal,
          });

          if (!res.ok) {
            const text = await res.text().catch(() => res.statusText);
            throw new Error(text || `HTTP ${res.status}`);
          }

          const data = (await res.json().catch(() => ({}))) as EmploymentDetailsPayload;
          const savedAt = Date.now();
          setLastSavedAt(savedAt);
          setIsSaving(false);
          return { ok: true, data: data || payload, status: res.status, savedAt };
        } else {
          // --- Simulated mode ---
          const { delayRangeMs = [700, 1500], failRate = 0, forceResult } = sim || {};
          const delay =
            Math.floor(Math.random() * (delayRangeMs[1] - delayRangeMs[0])) + delayRangeMs[0];

          await new Promise<void>((resolve, reject) => {
            const id = setTimeout(resolve, delay);
            controller.signal.addEventListener("abort", () => {
              clearTimeout(id);
              reject(new DOMException("Aborted", "AbortError"));
            });
          });

          const shouldFail =
            forceResult === "error"
              ? true
              : forceResult === "success"
              ? false
              : Math.random() < failRate;

          if (shouldFail) throw new Error("Simulated network error");

          const savedAt = Date.now();
          setLastSavedAt(savedAt);
          setIsSaving(false);
          return { ok: true, data: payload, status: 200, savedAt };
        }
      } catch (e: any) {
        if (e?.name === "AbortError") {
          setIsSaving(false);
          return { ok: false, error: e };
        }
        setError(e);
        setIsSaving(false);
        return { ok: false, error: e };
      }
    },
    [employeeId, options]
  );

  const abort = useCallback(() => abortRef.current?.abort(), []);

  return { isSaving, error, lastSavedAt, save, abort } as const;
}
