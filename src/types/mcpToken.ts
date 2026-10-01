export type T_McpToken = {
  id: number;
  label: string;
  token_prefix: string;
  is_active: boolean;
  expires_at: string | null;
  last_used_at: string | null;
  created_at: string;
};

// Returned only on creation — the raw token is shown once and never again.
export type T_McpTokenCreateResponse = T_McpToken & { token: string };

export type T_McpTokenCreatePayload = {
  label: string;
  expires_in_days?: number | null;
};
