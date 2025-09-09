"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getCookie } from "cookies-next";

import useGetLocationItems from "@/components/hooks/useGetLocationItems";
import useGetDepartmentItems from "@/components/hooks/useGetDepartmentItems";
import useGetPositionItems from "@/components/hooks/useGetPositionItems";
import useGetEmployeeStatusItems from "@/components/hooks/useGetEmployeeStatusItems";

import type { Employee } from "@/types/employee-201-records/employee";

type UseEmployeeOptions = { noCache?: boolean };
type UseEmployeeResult = {
  data?: Employee;
  isLoading: boolean;
  error?: Error;
  refetch: () => void; // refetches employee + all option lists
};

const uniqSorted = (xs: string[]) =>
  Array.from(new Set(xs.filter(Boolean))).sort((a, b) => a.localeCompare(b));

export function useEmployee(
  id?: string,
  _opts: UseEmployeeOptions = {}
): UseEmployeeResult {
  const [emp, setEmp] = useState<Employee | undefined>(undefined);
  const [isEmpLoading, setIsEmpLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<Error | undefined>(undefined);

  // option lists (also grab their refetch functions)
  const {
    data: locItems = [],
    isLoading: isLocLoading,
    error: locError,
    refetch: refetchLoc,
  } = useGetLocationItems();

  const {
    data: deptItems = [],
    isLoading: isDeptLoading,
    error: deptError,
    refetch: refetchDept,
  } = useGetDepartmentItems();

  const {
    data: posItems = [],
    isLoading: isPosLoading,
    error: posError,
    refetch: refetchPos,
  } = useGetPositionItems();

  const {
    data: estItems = [],
    isLoading: isEstLoading,
    error: estError,
    refetch: refetchEst,
  } = useGetEmployeeStatusItems();

  const fetchEmployee = useCallback(async () => {
    if (!id) return;
    setIsEmpLoading(true);
    setError(undefined);

    const token = getCookie("token") as string | undefined;
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
    const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
      id
    )}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
      });

      if (!res.ok) {
        let msg = `Request failed (${res.status})`;
        try {
          const problem = await res.json();
          msg =
            typeof problem === "string"
              ? problem
              : problem?.message || problem?.detail || JSON.stringify(problem);
        } catch {}
        throw new Error(msg);
      }

      const payload = await res.json();
      const item = (payload?.data ?? payload) as Employee;

      if (!item || typeof item !== "object" || (item as any).id == null) {
        throw new Error("Invalid employee payload");
      }

      setEmp(item);
    } catch (e: any) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setEmp(undefined);
    } finally {
      setIsEmpLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  // merge API option hooks into the employee (fallback to inline lists if hooks empty)
  const data = useMemo(() => {
    if (!emp) return undefined;

    const hookPositions = uniqSorted((posItems as any[]).map((i) => i?.name));
    const hookDepartments = uniqSorted(
      (deptItems as any[]).map((i) => i?.name)
    );
    const hookLocations = uniqSorted((locItems as any[]).map((i) => i?.name));
    const hookEmpStatus = uniqSorted((estItems as any[]).map((i) => i?.name));

    const fromInline = (arr?: Employee["positions_list"]): string[] => {
      if (!arr) return [];
      if (Array.isArray(arr) && typeof (arr as any[])[0] === "string")
        return arr as string[];
      return ((arr as any[]) || []).map((x) => x?.name).filter(Boolean);
    };

    const positions_list =
      (hookPositions.length ? hookPositions : fromInline(emp.positions_list)) ||
      null;
    const departments_list =
      (hookDepartments.length
        ? hookDepartments
        : fromInline(emp.departments_list)) || null;
    const locations_list =
      (hookLocations.length ? hookLocations : fromInline(emp.locations_list)) ||
      null;
    const employment_status_list =
      (hookEmpStatus.length
        ? hookEmpStatus
        : fromInline((emp as any).employment_status_list)) || null;

    return {
      ...emp,
      positions_list,
      departments_list,
      locations_list,
      employment_status_list,
    } as Employee;
  }, [emp, posItems, deptItems, locItems, estItems]);

  // bubble list-fetch errors if employee isn’t set yet
  useEffect(() => {
    if (!data) {
      const listErr = locError || deptError || posError || estError;
      if (listErr && !error) setError(listErr as Error);
    }
  }, [data, locError, deptError, posError, estError, error]);

  const isLoading =
    isEmpLoading ||
    isLocLoading ||
    isDeptLoading ||
    isPosLoading ||
    isEstLoading;

  // composite refetch: employee + all option lists
  const refetch = useCallback(() => {
    void Promise.all([
      fetchEmployee(),
      refetchLoc(),
      refetchDept(),
      refetchPos(),
      refetchEst(),
    ]);
  }, [fetchEmployee, refetchLoc, refetchDept, refetchPos, refetchEst]);

  return { data, isLoading, error, refetch };
}
