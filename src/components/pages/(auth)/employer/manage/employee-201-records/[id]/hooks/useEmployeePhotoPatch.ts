"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

import type { Employee } from "@/types/employee-201-records/employee";

type UploadPhotoParams = {
  employeeId: string;
  file: File;
};

type RemovePhotoParams = {
  employeeId: string;
};

async function uploadPhoto(params: UploadPhotoParams): Promise<Partial<Employee>> {
  if (!params.file) {
    throw new Error("No file selected.");
  }
  if (!/^image\//.test(params.file.type)) {
    throw new Error("Please select an image file.");
  }
  if (params.file.size > 10 * 1024 * 1024) {
    throw new Error("Max file size is 10MB.");
  }

  const token = getCookie("token");
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
    params.employeeId
  )}/personal-info/`;

  const form = new FormData();
  form.append("photo", params.file);

  const config: RequestInit = {
    method: "PATCH",
    headers: {
      Authorization: `Token ${token}`,
      // NO Content-Type for FormData
    },
    body: form,
  };

  const res = await fetch(url, config);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.detail || errorData?.message || "Failed to upload photo."
    );
  }

  return res.json().catch(() => ({}));
}

async function removePhoto(params: RemovePhotoParams): Promise<Partial<Employee>> {
  const token = getCookie("token");
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
    params.employeeId
  )}/personal-info/`;

  const form = new FormData();
  form.append("remove", "1");

  const config: RequestInit = {
    method: "PATCH",
    headers: {
      Authorization: `Token ${token}`,
    },
    body: form,
  };

  const res = await fetch(url, config);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.detail || errorData?.message || "Failed to remove photo."
    );
  }

  return res.json().catch(() => ({}));
}

export function useEmployeePhotoPatch(employeeId?: string) {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation<Partial<Employee>, Error, File>(
    (file: File) => {
      if (!employeeId) {
        throw new Error("Missing employeeId");
      }
      return uploadPhoto({ employeeId, file });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["employee", employeeId]);
        queryClient.invalidateQueries(["employeesCache"]);
      },
    }
  );

  const removeMutation = useMutation<Partial<Employee>, Error, void>(
    () => {
      if (!employeeId) {
        throw new Error("Missing employeeId");
      }
      return removePhoto({ employeeId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["employee", employeeId]);
        queryClient.invalidateQueries(["employeesCache"]);
      },
    }
  );

  return {
    isSaving: uploadMutation.isLoading || removeMutation.isLoading,
    error: uploadMutation.error || removeMutation.error,
    upload: uploadMutation.mutateAsync,
    remove: removeMutation.mutateAsync,
  } as const;
}
