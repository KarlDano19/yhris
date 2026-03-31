import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
}

const bulkDeleteEvaluationTemplates = async (evaluationTemplateIds: number[]): Promise<BulkDeleteResponse> => {
  const token = getCookie('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-templates/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ evaluation_template_ids: evaluationTemplateIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete evaluation templates');
  }

  const data = await response.json();
  return data;
};

export default function useBulkDeleteEvaluationTemplates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteEvaluationTemplates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluationTemplateItems'] });
    },
  });
} 