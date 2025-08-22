import { useCallback, useEffect, useRef, useState } from "react";

/** What the backend receives (keep simple & API-ready) */
export type TrainingRecord = {
  title: string;
  dateCompleted?: string; // ISO yyyy-mm-dd
  provider?: string;
  // NOTE: we are NOT uploading files here; see comment below.
  proofFilename?: string | null; // optional metadata only
};

export type TrainingDevelopmentPayload = {
  trainings: TrainingRecord[];
};

export type PatchResult<T = unknown> =
  | { ok: true; data: T; status: number; savedAt: number }
  | { ok: false; error: Error; status?: number };

export type PatchSimOptions = {
  delayRangeMs?: [number, number]; // default [700, 1500]
  failRate?: number;               // default 0
  forceResult?: "success" | "error";
};

export type UseTrainingDevelopmentPatchOptions = {
  /** When provided, we do a real fetch PATCH; otherwise simulate */
  apiBaseUrl?: string; // e.g., "/api"
  /** Endpoint; default: `/employees/:id/training-development` */
  endpoint?: string | ((employeeId: string) => string);
  credentials?: RequestCredentials;
  headers?: Record<string, string>;
  sim?: PatchSimOptions;
};

// -------------------- helpers --------------------

function toISODate(d?: string | Date | null): string | undefined {
  if (!d) return undefined;
  const dd = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dd.getTime())) return undefined;
  return dd.toISOString().slice(0, 10);
}

/**
 * Build the final request payload from your form rows.
 * We only emit metadata about the proof file (filename). File upload can be handled separately.
 */
export function buildTrainingDevelopmentPayload(rows: Array<{
  id: string;
  title: string;
  dateCompleted: string;             // already yyyy-mm-dd in your form
  provider: string;
  proof?: File | null;
}>): TrainingDevelopmentPayload {
  const trainings: TrainingRecord[] = (rows || [])
    .filter(r => (r.title || "").trim().length > 0) // keep only meaningful rows
    .map(r => ({
      title: String(r.title ?? "").trim(),
      dateCompleted: toISODate(r.dateCompleted) ?? undefined,
      provider: r.provider ? String(r.provider) : undefined,
      proofFilename: r.proof?.name ?? null, // metadata only (no file upload here)
    }));

  return { trainings };
}

// -------------------- hook --------------------

export function useTrainingDevelopmentPatch(
  employeeId?: string,
  options: UseTrainingDevelopmentPatchOptions = {}
) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const save = useCallback(
    async (payload: TrainingDevelopmentPayload): Promise<PatchResult<TrainingDevelopmentPayload>> => {
      if (!employeeId) {
        const err = new Error("Missing employeeId");
        setError(err);
        return { ok: false, error: err };
      }

      // very light validation
      if (!Array.isArray(payload?.trainings)) {
        const err = new Error("Payload must include trainings[]");
        setError(err);
        return { ok: false, error: err };
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsSaving(true);
      setError(null);

      const { apiBaseUrl, endpoint, headers, credentials, sim } = options;

      try {
        if (apiBaseUrl) {
          // --- real API mode ---
          const resolved =
            typeof endpoint === "function"
              ? endpoint(employeeId)
              : endpoint || `/employees/${employeeId}/training-development`;

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

          const data = (await res.json().catch(() => ({}))) as TrainingDevelopmentPayload;
          const savedAt = Date.now();
          setLastSavedAt(savedAt);
          setIsSaving(false);
          return { ok: true, data: data || payload, status: res.status, savedAt };
        } else {
          // --- simulated mode ---
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
            forceResult === "error" ? true :
            forceResult === "success" ? false :
            Math.random() < failRate;

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

  return { save, isSaving, error, lastSavedAt, abort } as const;
}
