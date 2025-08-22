import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Payload shape for the Personal Details section.
 * Keep fields aligned with your PersonalInfoForm.
 */
export type PersonalDetailsPayload = {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  contactNumber?: string;
  governmentIds?: {
    tin?: string;
    sss?: string;
    pagibig?: string;
    philhealth?: string;
  };
  emergencyContact?: {
    name?: string;
    relation?: string;
    contactNumber?: string;
    address?: string;
  };
};

export type PatchSimOptions = {
  /** Artificial delay range in ms (inclusive). Default: [700, 1500] */
  delayRangeMs?: [number, number];
  /** Failure probability (0..1). Default: 0 (always succeeds) */
  failRate?: number;
  /** Force deterministic outcome for tests */
  forceResult?: "success" | "error";
};

export type PatchResult<T = unknown> =
  | { ok: true; data: T; status: number; savedAt: number }
  | { ok: false; error: Error; status?: number };

export type UsePersonalDetailsPatchOptions = {
  /** If provided, real API base URL; if omitted, a simulated call is used. */
  apiBaseUrl?: string; // e.g. "/api"
  /** Endpoint override; default: `/employees/:id/personal-details` */
  endpoint?: string | ((employeeId: string) => string);
  /** Include credentials in fetch (when apiBaseUrl is set) */
  credentials?: RequestCredentials;
  /** Additional headers for real fetch */
  headers?: Record<string, string>;
  /** Simulation knobs (used when apiBaseUrl is not set) */
  sim?: PatchSimOptions;
};

/** Minimal runtime validation for common mistakes */
function validatePayload(p: PersonalDetailsPayload) {
  if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
    throw new Error("Invalid email address");
  }
  return true;
}

export function usePersonalDetailsPatch(
  employeeId?: string,
  options: UsePersonalDetailsPatchOptions = {}
) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const save = useCallback(
    async (
      payload: PersonalDetailsPayload
    ): Promise<PatchResult<PersonalDetailsPayload>> => {
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
              : endpoint || `/employees/${employeeId}/personal-details`;

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

          const data = (await res.json().catch(() => ({}))) as PersonalDetailsPayload;
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

// ---------- Optional helper to flatten dot-notated patches ----------
export function buildPersonalDetailsPayload(
  patch: Record<string, any>
): PersonalDetailsPayload {
  // Accepts keys like "governmentIds.tin" and builds nested objects.
  const out: PersonalDetailsPayload = {};
  for (const [k, v] of Object.entries(patch)) {
    if (k.includes(".")) {
      const [head, tail] = k.split(/\.(.+)/); // split first dot
      (out as any)[head] = { ...(out as any)[head], [tail]: v };
    } else {
      (out as any)[k] = v;
    }
  }
  return out;
}
