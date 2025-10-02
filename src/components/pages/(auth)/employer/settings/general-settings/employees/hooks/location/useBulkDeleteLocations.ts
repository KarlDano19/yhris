import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
}

const bulkDeleteLocations = async (locationIds: number[]): Promise<BulkDeleteResponse> => {
  const token = getCookie('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ location_ids: locationIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete locations');
  }

  const data = await response.json();
  return data;
};

export default function useBulkDeleteLocations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteLocations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locationItems'] });
    },
  });
} 