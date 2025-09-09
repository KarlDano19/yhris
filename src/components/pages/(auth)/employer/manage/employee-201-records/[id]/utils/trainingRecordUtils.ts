const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

export const toFormData = (input: Record<string, any>) => {
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

export const listUrl = (
  employeeId: number | string,
  opts?: { start?: string; end?: string; provider?: string; current_page?: number; page_size?: number }
) => {
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

export const detailUrl = (
  employeeId: number | string,
  id: number | string,
  clear?: boolean
) => {
  const base = `${API_BASE}/api/employee-201/employees/${encodeURIComponent(
    String(employeeId)
  )}/training-records/${encodeURIComponent(String(id))}/`;
  return clear ? `${base}?clear_file=1` : base;
};
