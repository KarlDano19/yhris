import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
}

const bulkDeleteEvaluationSchedulers = async (evaluationSchedulerIds: number[]): Promise<BulkDeleteResponse> => {
  const token = getCookie('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-schedulers/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ evaluation_scheduler_ids: evaluationSchedulerIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete evaluation schedulers');
  }

  const data = await response.json();
  return data;
};

export default function useBulkDeleteEvaluationSchedulers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteEvaluationSchedulers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluationSchedulerItems'] });
    },
  });
} 