import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function unseedEvaluationSchedulers() {
  try {
    const token = getCookie('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-schedulers/seeder/`, {
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
    throw resolvedError.message ?? 'Failed to unseed evaluation schedulers';
  }
}

function useUnseedEvaluationSchedulers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unseedEvaluationSchedulers(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluationSchedulerListItemsCache'] });
      queryClient.invalidateQueries({ queryKey: ['evaluationSchedulerItems'] });
    },
  });
}

export default useUnseedEvaluationSchedulers;

