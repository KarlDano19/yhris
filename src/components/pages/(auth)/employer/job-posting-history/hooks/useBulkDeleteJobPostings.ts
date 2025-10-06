import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
}

const bulkDeleteJobPostings = async (jobPostingIds: number[]): Promise<BulkDeleteResponse> => {
  const token = getCookie('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ job_posting_ids: jobPostingIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete job postings');
  }

  const data = await response.json();
  return data;
};

export default function useBulkDeleteJobPostings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteJobPostings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPostItems'] });
    },
  });
} 