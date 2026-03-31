import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function unseedEvaluations() {
  try {
    const token = getCookie('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-history/seeder/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw response.json();
    }

    return response.json();
  } catch (err: any) {
    const resolvedError = await err;
    if (Object.hasOwn(resolvedError, 'response')) {
      throw resolvedError.response.data.message;
    }
    throw resolvedError.message ?? 'Failed to unseed evaluation history';
  }
}

function useUnseedEvaluations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unseedEvaluations(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluationHistoryListItemsCache'] });
      queryClient.invalidateQueries({ queryKey: ['templateResponsesCache'] });
    },
  });
}

export default useUnseedEvaluations;

