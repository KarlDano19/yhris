"use client";

import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

import { listUrl } from "../utils/trainingRecordUtils";
import type { ListOptions, TrainingListMeta } from "../types/trainingRecords";

async function getTrainingRecordsList(
  employeeId: number | string,
  opts: ListOptions
): Promise<TrainingListMeta> {
  try {
    const token = getCookie("token") as string | undefined;
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
    };

    if (token) {
      const res = await fetch(listUrl(employeeId, opts), config);
      if (!res.ok) {
        throw res.json();
      }

      const payload = await res.json();

      if (Array.isArray(payload)) {
        return {
          total_records: payload.length,
          total_pages: 1,
          current_page: 1,
          page_size: payload.length,
          starting: 0,
          ending: payload.length,
          records: payload,
        };
      } else if (payload?.records && Array.isArray(payload.records)) {
        return payload;
      } else if (payload?.data && Array.isArray(payload.data)) {
        return {
          total_records: payload.data.length,
          total_pages: 1,
          current_page: 1,
          page_size: payload.data.length,
          starting: 0,
          ending: payload.data.length,
          records: payload.data,
        };
      } else {
        return {
          total_records: 0,
          total_pages: 1,
          current_page: 1,
          page_size: 0,
          starting: 0,
          ending: 0,
          records: [],
        };
      }
    }

    return {
      total_records: 0,
      total_pages: 1,
      current_page: 1,
      page_size: 0,
      starting: 0,
      ending: 0,
      records: [],
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
    throw new Error("Failed to fetch training records.");
  }
}

export function useGetTrainingRecordsList(
  employeeId?: number | string,
  initialOpts: ListOptions = {}
) {
  const queryResult = useQuery(
    ["trainingRecordsCache", employeeId, initialOpts],
    () => getTrainingRecordsList(employeeId!, initialOpts),
    {
      enabled: !!employeeId,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error as Error | undefined,
    refetch: queryResult.refetch,
  };
}
