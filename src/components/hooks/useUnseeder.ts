import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { SeederViewType } from './useSeeder';

export interface UnseederParams {
  view_type: SeederViewType;
  job_posting_id?: number;
}

const viewTypeInvalidations: Partial<Record<SeederViewType, string[]>> = {
  evaluation_template:  ['evaluationTemplateListItemsCache'],
  evaluation_scheduler: ['evaluationSchedulerListItemsCache', 'evaluationSchedulerItems'],
  evaluation_history:   ['evaluationHistoryListItemsCache', 'templateResponsesCache'],
  onboarding:           ['hiredApplicantCache'],
};

async function unseed(params: UnseederParams) {
  try {
    const token = getCookie('token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seeder/`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw response.json();
    return response.json();
  } catch (err: any) {
    const resolvedError = await err;
    if (Object.hasOwn(resolvedError, 'response')) throw resolvedError.response.data.message;
    throw resolvedError.message ?? 'Failed to unseed data';
  }
}

function useUnseeder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: UnseederParams) => unseed(params),
    onSuccess: (_, params) => {
      const keys = viewTypeInvalidations[params.view_type] ?? [];
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
    },
  });
}

export default useUnseeder;
