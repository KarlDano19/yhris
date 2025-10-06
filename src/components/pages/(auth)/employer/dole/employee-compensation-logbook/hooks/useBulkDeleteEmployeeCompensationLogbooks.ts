import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
}

const bulkDeleteEmployeeCompensationLogbooks = async (logbookIds: number[]): Promise<BulkDeleteResponse> => {
  const token = getCookie('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee-compensation-logbooks/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ employee_compensation_logbook_ids: logbookIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete employee compensation logbooks');
  }

  const data = await response.json();
  return data;
};

export default function useBulkDeleteEmployeeCompensationLogbooks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteEmployeeCompensationLogbooks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeCompensationLogbooks'] });
    },
  });
} 