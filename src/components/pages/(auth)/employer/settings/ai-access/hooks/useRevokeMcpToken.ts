import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function revokeMcpToken(id: number): Promise<{ message: string }> {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mcp/personal-tokens/${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to revoke token.');
  }
  return res.json();
}

export function useRevokeMcpToken() {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, number>((id) => revokeMcpToken(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['mcpTokensCache']);
    },
  });
}
