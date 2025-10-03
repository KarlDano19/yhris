import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
}

const bulkDeleteHealthAndSafetyReports = async (reportIds: number[]): Promise<BulkDeleteResponse> => {
  const token = getCookie('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health-and-safety-reports/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ health_and_safety_report_ids: reportIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete health and safety reports');
  }

  const data = await response.json();
  return data;
};

export default function useBulkDeleteHealthAndSafetyReports() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteHealthAndSafetyReports,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthAndSafetyReports'] });
    },
  });
} 