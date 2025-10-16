import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
  cancelled_count: number;
}

const bulkDeleteEmailMonitoring = async (monitoringIds: number[]): Promise<BulkDeleteResponse> => {
  const token = getCookie('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicants/talent-email-monitoring/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ monitoring_ids: monitoringIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete email monitoring records');
  }

  const data = await response.json();
  return data;
};

export default function useBulkDeleteEmailMonitoring() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteEmailMonitoring,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-monitoring'] });
    },
  });
}
