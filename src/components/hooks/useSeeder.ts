import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export type SeederViewType =
  | 'applicant'
  | 'employee'
  | 'employee_issue'
  | 'job_posting'
  | 'screen_applicant'
  | 'evaluation_template'
  | 'evaluation_scheduler'
  | 'evaluation_history'
  | 'email_template'
  | 'onboarding';

export interface SeederParams {
  view_type: SeederViewType;
  count?: number;
  job_posting_id?: number;
  emails?: string[];
  scheduler_id?: number;
}

const viewTypeInvalidations: Partial<Record<SeederViewType, string[]>> = {
  evaluation_template:  ['evaluationTemplateListItemsCache'],
  evaluation_scheduler: ['evaluationSchedulerListItemsCache', 'evaluationSchedulerItems'],
  evaluation_history:   ['evaluationHistoryListItemsCache', 'templateResponsesCache'],
  onboarding:           ['hiredApplicantCache'],
};

async function seed(params: SeederParams) {
  try {
    const token = getCookie('token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seeder/`, {
      method: 'POST',
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
    throw resolvedError.message ?? 'Failed to seed data';
  }
}

function useSeeder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: SeederParams) => seed(params),
    onSuccess: (_, params) => {
      const keys = viewTypeInvalidations[params.view_type] ?? [];
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
    },
  });
}

export default useSeeder;
