import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
}

const bulkDeleteAnnualMedicalReports = async (reportIds: number[]): Promise<BulkDeleteResponse> => {
  const token = getCookie('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/annual-medical-reports/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ annual_medical_report_ids: reportIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete annual medical reports');
  }

  const data = await response.json();
  return data;
};

export default function useBulkDeleteAnnualMedicalReports() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteAnnualMedicalReports,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annualMedicalReports'] });
    },
  });
} 