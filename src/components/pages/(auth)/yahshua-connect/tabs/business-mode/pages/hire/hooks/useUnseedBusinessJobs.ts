import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function unseedBusinessJobs() {
  try {
    const token = getCookie('token');

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/seeder/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
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
    throw resolvedError.message ?? 'Failed to unseed business jobs';
  }
}

function useUnseedBusinessJobs() {
  return useMutation({
    mutationFn: () => unseedBusinessJobs(),
  });
}

export default useUnseedBusinessJobs;
