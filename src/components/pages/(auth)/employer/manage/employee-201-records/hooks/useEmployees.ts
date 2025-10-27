"use client";
import { useCallback, useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import type { Employee } from "@/types/employee-201-records/employee";

export type EmployeeQuery = {
  q: string;
  location: string;       
  department: string;     
  position: string;       
  recordStatus: string;
  isActive: string[];     // Array of 'true' and/or 'false'
  page: number;           
  pageSize: number;       
};

const DEFAULT_QUERY: EmployeeQuery = {
  q: "",
  location: "ALL",
  department: "ALL",
  position: "ALL",
  recordStatus: "ALL",
  isActive: ["true"],     // Active only by default
  page: 1,
  pageSize: 12,
};

type Meta = { total: number; totalPages: number };

function buildParams(q: EmployeeQuery) {
  const params = new URLSearchParams();
  if (q.q.trim()) params.set("search", q.q.trim());

  const setIfNotAll = (key: "department" | "position" | "location" | "recordStatus", val: string) => {
    const s = (val || "").trim();
    if (s && s.toLowerCase() !== "all") params.set(key, s);
  };
  setIfNotAll("location", q.location);
  setIfNotAll("department", q.department);
  setIfNotAll("position", q.position);
  setIfNotAll("recordStatus", q.recordStatus);

  // Handle isActive array
  if (q.isActive && q.isActive.length > 0) {
    params.set("is_active", q.isActive.join(','));
  }

  params.set("current_page", String(q.page));
  params.set("page_size", String(q.pageSize));
  return params;
}

export function useEmployees(initial: Partial<EmployeeQuery> = {}) {
  const [query, setQuery] = useState<EmployeeQuery>({ ...DEFAULT_QUERY, ...initial });
  const [data, setData] = useState<Partial<Employee>[] | null>(null);
  const [meta, setMeta] = useState<Meta>({ total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEmployees = useCallback(async (q: EmployeeQuery) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getCookie("token") as string | undefined;
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
      const url = `${baseUrl}/api/employee-201/employees/?${buildParams(q).toString()}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
      });

      if (!res.ok) {
        let errMessage = `Request failed (${res.status})`;
        try {
          const problem = await res.json();
          errMessage = typeof problem === "string" ? problem : problem?.message || JSON.stringify(problem);
        } catch {}
        throw new Error(errMessage);
      }

      const payload = await res.json();

      // Accept common list shapes
      const recordsRaw =
        (payload?.records as Partial<Employee>[]) ??
        (payload?.results as Partial<Employee>[]) ??
        (payload?.data as Partial<Employee>[]) ??
        [];

      // Use API shape directly (no mapping)
      const list = Array.isArray(recordsRaw) ? recordsRaw : [];

      const total =
        Number(payload?.total_records) ??
        Number(payload?.total) ??
        Number(payload?.count) ??
        Number(payload?.records_total) ??
        list.length;

      const totalPages =
        Number(payload?.total_pages) ??
        Number(payload?.totalPages) ??
        Math.max(1, Math.ceil(total / q.pageSize));

      setData(list);
      setMeta({ total, totalPages });
    } catch (e: any) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setData(null);
      setMeta({ total: 0, totalPages: 1 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees(query);
  }, [fetchEmployees, query]);

  const setSearch = useCallback((qstr: string) => {
    setQuery((prev) => ({ ...prev, q: qstr, page: 1 }));
  }, []);

  const applyFilters = useCallback(
    (filters: Pick<EmployeeQuery, "location" | "department" | "position" | "recordStatus" | "isActive">) => {
      setQuery((prev) => ({ ...prev, ...filters, page: 1 }));
    },
    []
  );

  const setPage = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const refetch = useCallback(() => fetchEmployees(query), [fetchEmployees, query]);

  return {
    data,         // Partial<Employee>[] in API field names
    meta,         // { total, totalPages }
    isLoading,
    error,
    refetch,
    query,
    setSearch,
    applyFilters,
    setPage,
    setPageSize,
  };
}
