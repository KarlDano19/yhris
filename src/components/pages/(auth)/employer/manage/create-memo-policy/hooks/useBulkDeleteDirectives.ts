import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
}

const bulkDeleteDirectives = async (directiveIds: number[]): Promise<BulkDeleteResponse> => {
  try {
    const token = getCookie('token');
    
    const config = {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ directive_ids: directiveIds }),
    };
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/directives/`, config);
    
    if (!res.ok) {
      throw res.json();
    }
    
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
};

export default function useBulkDeleteDirectives() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteDirectives,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['directivesItems'] });
    },
  });
} 