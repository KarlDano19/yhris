"use client";

// 1. React imports (none needed)

// 2. Third-party library imports
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

type IncompleteCountResponse = {
  count: number;
};

async function getIncompleteEmployeeCount(): Promise<IncompleteCountResponse> {
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
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
      const res = await fetch(
        `${baseUrl}/api/employee-201/employee-incomplete-count/`,
        config
      );
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return { count: 0 };
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
    throw new Error("Failed to fetch incomplete employee count.");
  }
}

type Options = { enabled?: boolean };

export function useIncompleteEmployeeCount(options?: Options) {
  const { enabled = true } = options ?? {};

  const query = useQuery(
    ["incompleteEmployeeCountCache"],
    () => getIncompleteEmployeeCount(),
    {
      refetchOnWindowFocus: false,
      enabled,
    }
  );

  return {
    count: query.data?.count ?? 0,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
