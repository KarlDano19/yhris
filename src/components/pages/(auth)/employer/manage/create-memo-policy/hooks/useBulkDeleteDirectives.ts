import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
}

const bulkDeleteDirectives = async (directiveIds: number[]): Promise<BulkDeleteResponse> => {
  const token = getCookie('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/directives/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ directive_ids: directiveIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete directives');
  }

  const data = await response.json();
  return data;
};

export default function useBulkDeleteDirectives() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteDirectives,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['directivesItems'] });
    },
  });
} 