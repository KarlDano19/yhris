import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
}

const bulkDeleteWorkAccidentIllnessReport = async (workAccidentIllnessReportIds: number[]): Promise<BulkDeleteResponse> => {
  const token = getCookie('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/work-accident-illness-reports/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      work_accident_illness_report_ids: workAccidentIllnessReportIds
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete work accident illness reports');
  }

  return response.json();
};

export const useBulkDeleteWorkAccidentIllnessReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteWorkAccidentIllnessReport,
    onSuccess: () => {
      // Invalidate and refetch work accident illness reports
      queryClient.invalidateQueries({ queryKey: ['workAccidentIllnessReports'] });
    },
  });
}; 