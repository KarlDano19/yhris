import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface SeedEvaluationsParams {
  count?: number;
  schedulerId?: number;
}

async function seedEvaluations(params: SeedEvaluationsParams) {
  try {
    const { count = 5, schedulerId } = params;
    const token = getCookie('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-history/seeder/`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ count, scheduler_id: schedulerId }),
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
    throw resolvedError.message ?? 'Failed to seed evaluation history';
  }
}

function useSeedEvaluations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SeedEvaluationsParams) => seedEvaluations(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluationHistoryListItemsCache'] });
      queryClient.invalidateQueries({ queryKey: ['templateResponsesCache'] });
    },
  });
}

export default useSeedEvaluations;

