"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

import type { Employee } from "@/types/employee-201-records/employee";

export type EmploymentPatch = Partial<
  Pick<
    Employee,
    | "system_id"
    | "date_hired"
    | "employment_status"
    | "location"
    | "position"
    | "department"
  >
>;

type PatchEmploymentDetailsParams = {
  employeeId: string;
  payload: EmploymentPatch;
};

async function patchEmploymentDetails(
  params: PatchEmploymentDetailsParams
): Promise<EmploymentPatch> {
  const token = getCookie("token");
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
    params.employeeId
  )}/employment-details/`;

  const config: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(params.payload),
  };

  const res = await fetch(url, config);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.detail || errorData?.message || "Failed to update employment details."
    );
  }

  return res.json().catch(() => params.payload);
}

export function useEmploymentDetailsPatch(employeeId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation<EmploymentPatch, Error, EmploymentPatch>(
    (payload: EmploymentPatch) => {
      if (!employeeId) {
        throw new Error("Missing employeeId");
      }
      return patchEmploymentDetails({ employeeId, payload });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["employee", employeeId]);
        queryClient.invalidateQueries(["employeesCache"]);
      },
    }
  );

  const save = async (
    payload: EmploymentPatch
  ): Promise<{ ok: boolean; error?: Error }> => {
    try {
      await mutation.mutateAsync(payload);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error as Error };
    }
  };

  return { ...mutation, save };
}
