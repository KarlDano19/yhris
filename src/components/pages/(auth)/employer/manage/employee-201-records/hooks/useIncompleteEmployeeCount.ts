"use client";
import { useCallback, useEffect, useState } from "react";
import { getCookie } from "cookies-next";

type Options = { enabled?: boolean };

export function useIncompleteEmployeeCount(options?: Options) {
  const { enabled = true } = options ?? {};
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  const fetchCount = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = getCookie("token") as string | undefined;
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
      const res = await fetch(`${baseUrl}/api/employee-201/employee-incomplete-count/`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = await res.json();
      const c = Number(json?.count ?? 0);
      setCount(Number.isFinite(c) ? c : 0);
    } catch (e: any) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => { fetchCount(); }, [fetchCount]);

  return { count, isLoading, error, refetch: fetchCount };
}
