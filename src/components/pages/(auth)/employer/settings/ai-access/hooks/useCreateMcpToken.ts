import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_McpTokenCreatePayload, T_McpTokenCreateResponse } from '@/types/mcpToken';

async function createMcpToken(data: T_McpTokenCreatePayload): Promise<T_McpTokenCreateResponse> {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mcp/personal-tokens/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create token.');
  }
  const responseData = await res.json();
  return responseData.data || responseData;
}

export function useCreateMcpToken() {
  const queryClient = useQueryClient();
  return useMutation<T_McpTokenCreateResponse, Error, T_McpTokenCreatePayload>(
    (data) => createMcpToken(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['mcpTokensCache']);
      },
    }
  );
}
