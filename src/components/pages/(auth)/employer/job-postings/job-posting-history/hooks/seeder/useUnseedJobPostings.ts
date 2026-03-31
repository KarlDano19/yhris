import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function unseedJobPostings() {
  try {
    const token = getCookie('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/seeder/`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
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
    throw resolvedError.message ?? 'Failed to unseed job postings';
  }
}

function useUnseedJobPostings() {
  const mutation = useMutation({
    mutationFn: () => unseedJobPostings(),
  });

  return mutation;
}

export default useUnseedJobPostings;

