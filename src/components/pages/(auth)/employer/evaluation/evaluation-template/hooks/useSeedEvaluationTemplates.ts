import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface SeedEvaluationTemplatesParams {
  count?: number;
}

async function seedEvaluationTemplates(params: SeedEvaluationTemplatesParams) {
  try {
    const { count = 5 } = params;
    const token = getCookie('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-templates/seeder/`, {
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
    throw resolvedError.message ?? 'Failed to seed evaluation templates';
  }
}

function useSeedEvaluationTemplates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SeedEvaluationTemplatesParams) => seedEvaluationTemplates(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluationTemplateListItemsCache'] });
    },
  });
}

export default useSeedEvaluationTemplates;

