"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCookie } from "cookies-next";

/* ========================== Types ========================== */

export type TrainingRecord = {
  id: number;
  employee: number;
  employee_id?: string;
  training_title: string;
  date_completed: string | null;
  training_provider?: string | null;
  proof_of_completion?: string | null; // URL
};

export type TrainingListMeta = {
  total_records: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  starting: number;
  ending: number;
  records: TrainingRecord[];
};

export type ListOptions = {
  start?: string;
  end?: string;
  provider?: string;
  current_page?: number;
  page_size?: number;
};

export type CreateTrainingInput = {
  training_title: string;
  date_completed?: string | null;
  training_provider?: string | null;
  proof_of_completion?: File | null;
};

export type UpdateTrainingInput = {
  training_title?: string;
  date_completed?: string | null;
  training_provider?: string | null;
  proof_of_completion?: File | null;
  clear_file?: boolean;
};

/* ========================== helpers ========================== */

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

const toFormData = (input: Record<string, any>) => {
  const fd = new FormData();
  Object.entries(input).forEach(([k, v]) => {
    if (v === undefined) return;
    if (v === null) {
      if (!(v instanceof File)) fd.append(k, "");
      return;
    }
    if (v instanceof File) fd.append(k, v, v.name);
    else fd.append(k, String(v));
  });
  return fd;
};

const listUrl = (employeeId: number | string, opts?: ListOptions) => {
  const q = new URLSearchParams();
  if (opts?.start) q.set("start", opts.start);
  if (opts?.end) q.set("end", opts.end);
  if (opts?.provider) q.set("provider", opts.provider);
  if (opts?.current_page) q.set("current_page", String(opts.current_page));
  if (opts?.page_size) q.set("page_size", String(opts.page_size));
  const qs = q.toString();
  return `${API_BASE}/api/employee-201/employees/${encodeURIComponent(
    String(employeeId)
  )}/training-records/${qs ? `?${qs}` : ""}`;
};

const detailUrl = (employeeId: number | string, id: number | string, clear?: boolean) => {
  const base = `${API_BASE}/api/employee-201/employees/${encodeURIComponent(
    String(employeeId)
  )}/training-records/${encodeURIComponent(String(id))}/`;
  return clear ? `${base}?clear_file=1` : base;
};

/* ========================== Hooks ========================== */

export function useListTrainingRecords(
  employeeId?: number | string,
  initialOpts: ListOptions = {}
) {
  const [data, setData] = useState<TrainingListMeta | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(!!employeeId);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [opts, setOpts] = useState<ListOptions>(initialOpts);

  const acRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      acRef.current?.abort();
    };
  }, []);

  const refetch = useCallback(async () => {
    if (!employeeId) return;

    acRef.current?.abort();
    const ac = new AbortController();
    acRef.current = ac;

    setIsLoading(true);
    setError(undefined);

    try {
      const token = getCookie("token") as string | undefined;

      const res = await fetch(listUrl(employeeId, opts), {
        method: "GET",
        headers: {
          "content-type": "application/json",
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
        signal: ac.signal,
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

      if (Array.isArray(payload)) {
        setData({
          total_records: payload.length,
          total_pages: 1,
          current_page: 1,
          page_size: payload.length,
          starting: 0,
          ending: payload.length,
          records: payload as TrainingRecord[],
        });
      } else if (payload?.records && Array.isArray(payload.records)) {
        setData(payload as TrainingListMeta);
      } else if (payload?.data && Array.isArray(payload.data)) {
        setData({
          total_records: payload.data.length,
          total_pages: 1,
          current_page: 1,
          page_size: payload.data.length,
          starting: 0,
          ending: payload.data.length,
          records: payload.data as TrainingRecord[],
        });
      } else {
        setData({
          total_records: 0,
          total_pages: 1,
          current_page: 1,
          page_size: 0,
          starting: 0,
          ending: 0,
          records: [],
        });
      }
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setError(e instanceof Error ? e : new Error(String(e)));
      setData(undefined);
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, [employeeId, opts]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const setPage = useCallback((current_page: number) => {
    setOpts((o) => ({ ...o, current_page }));
  }, []);
  const setPageSize = useCallback((page_size: number) => {
    setOpts((o) => ({ ...o, page_size, current_page: 1 }));
  }, []);

  return { data, isLoading, error, refetch, setPage, setPageSize, setOpts };
}

export function useCreateTrainingRecord() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const create = useCallback(
    async (employeeId: number | string, input: CreateTrainingInput): Promise<TrainingRecord> => {
      setIsLoading(true);
      setError(undefined);
      try {
        const url = `${API_BASE}/api/employee-201/employees/${encodeURIComponent(
          String(employeeId)
        )}/training-records/`;

        const fd = toFormData({
          training_title: input.training_title,
          date_completed: input.date_completed ?? "",
          training_provider: input.training_provider ?? "",
          ...(input.proof_of_completion ? { proof_of_completion: input.proof_of_completion } : {}),
        });

        const token = getCookie("token") as string | undefined;

        const res = await fetch(url, {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Token ${token}` } : {}),
          },
          body: fd,
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

        return (await res.json()) as TrainingRecord;
      } catch (e: any) {
        setError(e instanceof Error ? e : new Error(String(e)));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { create, isLoading, error };
}

export function useUpdateTrainingRecord() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const update = useCallback(
    async (
      employeeId: number | string,
      recordId: number | string,
      input: UpdateTrainingInput
    ): Promise<TrainingRecord> => {
      setIsLoading(true);
      setError(undefined);
      try {
        const url = detailUrl(employeeId, recordId, Boolean(input.clear_file));
        const fd = toFormData({
          training_title: input.training_title,
          date_completed: input.date_completed,
          training_provider: input.training_provider,
          ...(input.proof_of_completion ? { proof_of_completion: input.proof_of_completion } : {}),
        });

        const token = getCookie("token") as string | undefined;

        const res = await fetch(url, {
          method: "PATCH",
          headers: {
            ...(token ? { Authorization: `Token ${token}` } : {}),
          },
          body: fd,
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

        return (await res.json()) as TrainingRecord;
      } catch (e: any) {
        setError(e instanceof Error ? e : new Error(String(e)));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { update, isLoading, error };
}

export function useDeleteTrainingRecord() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const remove = useCallback(
    async (employeeId: number | string, recordId: number | string): Promise<void> => {
      setIsLoading(true);
      setError(undefined);
      try {
        const token = getCookie("token") as string | undefined;

        const res = await fetch(detailUrl(employeeId, recordId), {
          method: "DELETE",
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
      } catch (e: any) {
        setError(e instanceof Error ? e : new Error(String(e)));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { remove, isLoading, error };
}
