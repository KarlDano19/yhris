import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function unseedEvaluationTemplates() {
  try {
    const token = getCookie('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-templates/seeder/`, {
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
    throw resolvedError.message ?? 'Failed to unseed evaluation templates';
  }
}

function useUnseedEvaluationTemplates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unseedEvaluationTemplates(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluationTemplateListItemsCache'] });
    },
  });
}

export default useUnseedEvaluationTemplates;

