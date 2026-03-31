"use client";

import { useCallback, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

import type { Employee } from "@/types/employee-201-records/employee";

export type EmployeeQuery = {
  q: string;
  location: string;
  department: string;
  position: string;
  recordStatus: string;
  isActive: string[]; // Array of 'true' and/or 'false'
  page: number;
  pageSize: number;
};

const DEFAULT_QUERY: EmployeeQuery = {
  q: "",
  location: "ALL",
  department: "ALL",
  position: "ALL",
  recordStatus: "ALL",
  isActive: ["true"], // Active only by default
  page: 1,
  pageSize: 12,
};

type Meta = { total: number; totalPages: number };

type EmployeesResponse = {
  data: Partial<Employee>[];
  meta: Meta;
};

function buildParams(q: EmployeeQuery) {
  const params = new URLSearchParams();
  if (q.q.trim()) params.set("search", q.q.trim());

  const setIfNotAll = (
    key: "department" | "position" | "location" | "recordStatus",
    val: string
  ) => {
    const s = (val || "").trim();
    if (s && s.toLowerCase() !== "all") params.set(key, s);
  };
  setIfNotAll("location", q.location);
  setIfNotAll("department", q.department);
  setIfNotAll("position", q.position);
  setIfNotAll("recordStatus", q.recordStatus);

  // Handle isActive array
  if (q.isActive && q.isActive.length > 0) {
    params.set("is_active", q.isActive.join(","));
  }

  params.set("current_page", String(q.page));
  params.set("page_size", String(q.pageSize));
  return params;
}

async function getEmployees(q: EmployeeQuery): Promise<EmployeesResponse> {
  try {
    const token = getCookie("token");
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };

    if (token) {
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(
        /\/+$/,
        ""
      );
      const url = `${baseUrl}/api/employee-201/employees/?${buildParams(
        q
      ).toString()}`;

      const res = await fetch(url, config);
      if (!res.ok) {
        throw res.json();
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

      return {
        data: list,
        meta: { total, totalPages },
      };
    }

    return {
      data: [],
      meta: { total: 0, totalPages: 1 },
    };
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
    throw new Error("Failed to fetch employees.");
  }
}

export function useEmployees(initial: Partial<EmployeeQuery> = {}) {
  const [query, setQuery] = useState<EmployeeQuery>({
    ...DEFAULT_QUERY,
    ...initial,
  });

  const queryResult = useQuery(
    ["employeesCache", query],
    () => getEmployees(query),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  const setSearch = useCallback((qstr: string) => {
    setQuery((prev) => ({ ...prev, q: qstr, page: 1 }));
  }, []);

  const applyFilters = useCallback(
    (
      filters: Pick<
        EmployeeQuery,
        "location" | "department" | "position" | "recordStatus" | "isActive"
      >
    ) => {
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

  return {
    data: queryResult.data?.data ?? null,
    meta: queryResult.data?.meta ?? { total: 0, totalPages: 1 },
    isLoading: queryResult.isLoading,
    error: queryResult.error as Error | null,
    refetch: queryResult.refetch,
    query,
    setSearch,
    applyFilters,
    setPage,
    setPageSize,
  };
}
