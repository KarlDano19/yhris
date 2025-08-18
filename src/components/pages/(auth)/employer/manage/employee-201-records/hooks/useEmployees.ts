"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Employee } from "@/types/employee-201-records/employee";
import { MOCK_EMPLOYEES } from "../data/mockEmployees";

export type EmployeeQuery = {
  q: string;
  location: string;
  department: string;
  position: string;
  onlyIncomplete: boolean;
  page: number;       // <-- NEW
  pageSize: number;   // <-- NEW
};

const DEFAULT_QUERY: EmployeeQuery = {
  q: "",
  location: "ALL",
  department: "ALL",
  position: "ALL",
  onlyIncomplete: false,
  page: 1,
  pageSize: 15,
};

type Meta = { total: number; totalPages: number };

export function useEmployees(initial: Partial<EmployeeQuery> = {}) {
  const [query, setQuery] = useState<EmployeeQuery>({ ...DEFAULT_QUERY, ...initial });
  const [data, setData] = useState<Employee[] | null>(null);
  const [meta, setMeta] = useState<Meta>({ total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchEmployees = useCallback(async (q: EmployeeQuery) => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate network latency
      await new Promise((res) => setTimeout(res, 800));

      // --- server-side filtering ---
      const qNorm = q.q.trim().toLowerCase();
      let base = MOCK_EMPLOYEES.filter((e) => e.name.toLowerCase().includes(qNorm));

      const getOr = <T extends keyof Employee>(e: Employee, k: T, fallback = "Unspecified") =>
        ((e[k] as string | undefined) ?? fallback);

      if (q.onlyIncomplete) base = base.filter((e) => !e.complete);
      if (q.location !== "ALL")   base = base.filter((e) => getOr(e, "location")   === q.location);
      if (q.department !== "ALL") base = base.filter((e) => getOr(e, "department") === q.department);
      if (q.position !== "ALL")   base = base.filter((e) => getOr(e, "position")   === q.position);

      // --- server-side pagination ---
      const total = base.length;
      const totalPages = Math.max(1, Math.ceil(total / q.pageSize));
      const safePage = Math.min(Math.max(1, q.page), totalPages);
      const start = (safePage - 1) * q.pageSize;
      const paged = base.slice(start, start + q.pageSize);

      if (ac.signal.aborted) return;
      setData(paged);
      setMeta({ total, totalPages });
    } catch (e) {
      if ((e as any)?.name === "AbortError") return;
      setError(e as Error);
    } finally {
      if (!ac.signal.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees(query);
  }, [fetchEmployees, query]);

  // setters
  const setSearch = useCallback((qstr: string) => {
    // typing resets to page 1
    setQuery((prev) => ({ ...prev, q: qstr, page: 1 }));
  }, []);

  const applyFilters = useCallback((
    filters: Pick<EmployeeQuery, "location" | "department" | "position" | "onlyIncomplete">
  ) => {
    // applying filters resets to page 1
    setQuery((prev) => ({ ...prev, ...filters, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    // changing page size resets to page 1
    setQuery((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const refetch = useCallback(() => fetchEmployees(query), [fetchEmployees, query]);

  return {
    data,
    meta,             // { total, totalPages }
    isLoading,
    error,
    refetch,
    query,            // includes page & pageSize
    setSearch,
    applyFilters,
    setPage,
    setPageSize,
  };
}
