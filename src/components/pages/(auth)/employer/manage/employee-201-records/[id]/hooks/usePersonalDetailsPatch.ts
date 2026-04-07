import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

import type { Employee } from "@/types/employee-201-records/employee";

type PatchPersonalDetailsParams = {
  employeeId: string;
  payload: Partial<Employee>;
};

async function patchPersonalDetails(
  params: PatchPersonalDetailsParams
): Promise<Partial<Employee>> {
  const token = getCookie("token");
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
    params.employeeId
  )}/personal-info/`;

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

    // Handle Django serializer validation errors
    if (
      typeof errorData === "object" &&
      errorData !== null &&
      !Array.isArray(errorData)
    ) {
      const errors: string[] = [];

      for (const [field, fieldErrors] of Object.entries(errorData)) {
        if (field === "detail" || field === "message") {
          continue;
        }

        if (Array.isArray(fieldErrors)) {
          errors.push(...(fieldErrors as string[]));
        } else if (typeof fieldErrors === "string") {
          errors.push(fieldErrors);
        }
      }

      if (errors.length > 0) {
        throw new Error(errors.join(" "));
      }
    }

    throw new Error(
      errorData?.detail || errorData?.message || "Failed to update personal details."
    );
  }

  return res.json().catch(() => ({}));
}

export function usePersonalDetailsPatch(employeeId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Partial<Employee>, Error, Partial<Employee>>(
    (payload: Partial<Employee>) => {
      if (!employeeId) {
        throw new Error("Missing employeeId");
      }
      return patchPersonalDetails({ employeeId, payload });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["employee", employeeId]);
        queryClient.invalidateQueries(["employeesCache"]);
      },
    }
  );

  const save = async (
    payload: Partial<Employee>
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

