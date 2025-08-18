"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Employee } from "@/types/employee-201-records/employee";
import { MOCK_EMPLOYEES } from "../../data/mockEmployees";

type UseEmployeeOptions = {
  /** Simulated network latency in ms */
  delayMs?: number;
  /** If true, bypass the cache */
  noCache?: boolean;
};

type UseEmployeeResult = {
  data?: Employee;
  isLoading: boolean;
  error?: Error;
  /** Manually re-trigger the fetch (bypasses cache) */
  refetch: () => void;
};

// super simple in-memory cache (per tab/session)
const cache = new Map<string, Employee>();
const DEFAULT_DELAY = 1500;

function fakeFetchEmployee(
  id: string,
  signal?: AbortSignal,
  delay = DEFAULT_DELAY
): Promise<Employee> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (signal?.aborted) {
        return reject(new DOMException("Aborted", "AbortError"));
      }
      // Adjust this to how your mock data identifies employees
      const found = MOCK_EMPLOYEES.find((e: any) => String(e.id) === String(id));
      if (!found) return reject(new Error(`Employee ${id} not found`));
      resolve(found);
    }, delay);

    // Clean up if aborted before timeout fires
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });
}

export function useEmployee(
  id?: string,
  { delayMs = DEFAULT_DELAY, noCache = false }: UseEmployeeOptions = {}
): UseEmployeeResult {
  const [data, setData] = useState<Employee | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<Error | undefined>(undefined);

  const acRef = useRef<AbortController | null>(null);

  const load = useCallback(
    async (bypassCache = false) => {
      if (!id) return;
      setIsLoading(true);
      setError(undefined);

      // cache hit
      if (!bypassCache && !noCache && cache.has(id)) {
        setData(cache.get(id));
        setIsLoading(false);
        return;
      }

      // abort any in-flight request
      acRef.current?.abort();
      const ac = new AbortController();
      acRef.current = ac;

      try {
        const res = await fakeFetchEmployee(id, ac.signal, delayMs);
        cache.set(id, res);
        setData(res);
      } catch (e: any) {
        // ignore abort errors, surface others
        if (e?.name !== "AbortError") setError(e);
      } finally {
        if (!ac.signal.aborted) setIsLoading(false);
      }
    },
    [id, delayMs, noCache]
  );

  // initial + id-change load
  useEffect(() => {
    load();
    return () => acRef.current?.abort();
  }, [load]);

  const refetch = useCallback(() => load(true), [load]);

  return { data, isLoading, error, refetch };
}
