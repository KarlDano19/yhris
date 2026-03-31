"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

import type { HRNote } from "./useGetHRNotes";

type AddHRNoteParams = {
  employeeId: number | string;
  noteContent: string;
};

async function addHRNote(params: AddHRNoteParams): Promise<HRNote> {
  const trimmed = (params.noteContent || "").trim();
  if (!trimmed) {
    throw new Error("Note content cannot be empty.");
  }

  const token = getCookie("token");
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  const url = `${baseUrl}/api/employee-201/employees/${encodeURIComponent(
    String(params.employeeId)
  )}/hr-notes/`;

  const config: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ note_content: trimmed }),
  };

  const res = await fetch(url, config);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.message || errorData?.detail || "Failed to add HR note."
    );
  }

  return res.json();
}

export function useAddHRNote(employeeId?: number | string) {
  const queryClient = useQueryClient();

  return useMutation<HRNote, Error, string>(
    (noteContent: string) => {
      if (!employeeId) {
        throw new Error("Missing employeeId");
      }
      return addHRNote({ employeeId, noteContent });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["hrNotesCache", employeeId]);
        queryClient.invalidateQueries(["employee", employeeId]);
      },
    }
  );
}
