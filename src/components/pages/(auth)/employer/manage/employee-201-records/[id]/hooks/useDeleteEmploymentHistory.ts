"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

type DeleteEmploymentHistoryParams = {
  employeeId: number | string;
  histId: number;
};

async function deleteEmploymentHistory(
  params: DeleteEmploymentHistoryParams
): Promise<void> {
  const token = getCookie("token");
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
    String(params.employeeId)
  )}/employment-history/${params.histId}/`;

  const config = {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
    },
  };

  const res = await fetch(url, config);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.detail || errorData?.message || "Failed to delete employment history."
    );
  }
}

export function useDeleteEmploymentHistory(employeeId?: number | string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>(
    (histId: number) => {
      if (!employeeId) {
        throw new Error("No employee ID provided");
      }
      return deleteEmploymentHistory({ employeeId, histId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["employmentHistoryCache", employeeId]);
        queryClient.invalidateQueries(["employee", employeeId]);
      },
    }
  );
}
