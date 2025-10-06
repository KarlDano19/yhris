import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
}

const bulkDeleteSeparations = async (separationIds: number[]): Promise<BulkDeleteResponse> => {
  const token = getCookie('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/separations/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ separation_ids: separationIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete separations');
  }

  const data = await response.json();
  return data;
};

export default function useBulkDeleteSeparations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteSeparations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['separationItems'] });
    },
  });
} 