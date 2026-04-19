import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface SeedBusinessJobsParams {
  count?: number;
  budget_type?: 'fixed_rate' | 'hourly_rate' | 'mix';
}

async function seedBusinessJobs(params: SeedBusinessJobsParams) {
  try {
    const { count = 5, budget_type = 'mix' } = params;
    const token = getCookie('token');

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/seeder/`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ count, budget_type }),
      }
    );

    if (!response.ok) {
      throw response.json();
    }

    return response.json();
  } catch (err: any) {
    const resolvedError = await err;
    if (Object.hasOwn(resolvedError, 'response')) {
      throw resolvedError.response.data.message;
    }
    throw resolvedError.message ?? 'Failed to seed business jobs';
  }
}

function useSeedBusinessJobs() {
  return useMutation({
    mutationFn: (params: SeedBusinessJobsParams) => seedBusinessJobs(params),
  });
}

export default useSeedBusinessJobs;
