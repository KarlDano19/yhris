"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

type DeleteHRNoteParams = {
  employeeId: number | string;
  noteId: number | string;
};

async function deleteHRNote(params: DeleteHRNoteParams): Promise<void> {
  const token = getCookie("token");
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
    String(params.employeeId)
  )}/hr-notes/${encodeURIComponent(String(params.noteId))}/`;

  const config = {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
    },
  };

  const res = await fetch(url, config);

  if (!res.ok && res.status !== 204) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.message || errorData?.detail || "Failed to delete HR note."
    );
  }
}

export function useDeleteHRNote(employeeId?: number | string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number | string>(
    (noteId: number | string) => {
      if (!employeeId) {
        throw new Error("Missing employeeId");
      }
      return deleteHRNote({ employeeId, noteId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["hrNotesCache", employeeId]);
        queryClient.invalidateQueries(["employee", employeeId]);
      },
    }
  );
}
