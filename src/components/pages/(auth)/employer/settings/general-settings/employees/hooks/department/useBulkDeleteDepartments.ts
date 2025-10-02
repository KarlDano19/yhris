import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
}

const bulkDeleteDepartments = async (departmentIds: number[]): Promise<BulkDeleteResponse> => {
  const token = getCookie('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/departments/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ department_ids: departmentIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete departments');
  }

  const data = await response.json();
  return data;
};

export default function useBulkDeleteDepartments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteDepartments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departmentItems'] });
    },
  });
} 