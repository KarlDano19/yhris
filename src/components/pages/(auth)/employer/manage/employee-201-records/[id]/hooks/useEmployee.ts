"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
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

async function getEmployee(id: string): Promise<Employee> {
  try {
    const token = getCookie("token") as string | undefined;
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
    const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(id)}`;

    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
    };

    if (token) {
      const res = await fetch(url, config);
      if (!res.ok) {
        throw res.json();
      }

      const payload = await res.json();
      const item = (payload?.data ?? payload) as Employee;

      if (!item || typeof item !== "object" || (item as any).id == null) {
        throw new Error("Invalid employee payload");
      }

      return item;
    }

    throw new Error("No authentication token");
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
    throw new Error("Failed to fetch employee.");
  }
}

export function useEmployee(
  id?: string,
  _opts: UseEmployeeOptions = {}
): UseEmployeeResult {
  // Fetch employee data
  const {
    data: emp,
    isLoading: isEmpLoading,
    error: empError,
    refetch: refetchEmp,
  } = useQuery(["employee", id], () => getEmployee(id!), {
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

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

  const isLoading =
    isEmpLoading ||
    isLocLoading ||
    isDeptLoading ||
    isPosLoading ||
    isEstLoading;

  // Combine errors - prioritize employee error, then list errors
  const error = empError || locError || deptError || posError || estError;

  // composite refetch: employee + all option lists
  const refetch = () => {
    void Promise.all([
      refetchEmp(),
      refetchLoc(),
      refetchDept(),
      refetchPos(),
      refetchEst(),
    ]);
  };

  return { data, isLoading, error: error as Error | undefined, refetch };
}
