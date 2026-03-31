import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface SeedEvaluationSchedulersParams {
  count?: number;
}

async function seedEvaluationSchedulers(params: SeedEvaluationSchedulersParams) {
  try {
    const { count = 5 } = params;
    const token = getCookie('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-schedulers/seeder/`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ count }),
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
    throw resolvedError.message ?? 'Failed to seed evaluation schedulers';
  }
}

function useSeedEvaluationSchedulers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SeedEvaluationSchedulersParams) => seedEvaluationSchedulers(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluationSchedulerListItemsCache'] });
      queryClient.invalidateQueries({ queryKey: ['evaluationSchedulerItems'] });
    },
  });
}

export default useSeedEvaluationSchedulers;

