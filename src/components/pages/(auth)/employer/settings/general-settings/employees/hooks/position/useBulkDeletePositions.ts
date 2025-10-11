import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
}

const bulkDeletePositions = async (positionIds: number[]): Promise<BulkDeleteResponse> => {
  const token = getCookie('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/positions/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ position_ids: positionIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete positions');
  }

  const data = await response.json();
  return data;
};

export default function useBulkDeletePositions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeletePositions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positionItems'] });
    },
  });
} 