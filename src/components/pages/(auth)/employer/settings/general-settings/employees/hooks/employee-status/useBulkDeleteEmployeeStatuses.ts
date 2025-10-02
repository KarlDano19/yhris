import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
}

const bulkDeleteEmployeeStatuses = async (employeeStatusIds: number[]): Promise<BulkDeleteResponse> => {
  const token = getCookie('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee-status/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ employee_status_ids: employeeStatusIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete employee statuses');
  }

  const data = await response.json();
  return data;
};

export default function useBulkDeleteEmployeeStatuses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteEmployeeStatuses,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeStatusItems'] });
    },
  });
} 