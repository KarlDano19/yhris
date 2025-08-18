export const s = (v?: string | number | null) =>
  v === undefined || v === null ? "" : String(v);