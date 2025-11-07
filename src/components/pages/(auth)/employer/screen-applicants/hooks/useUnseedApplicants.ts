import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function unseedApplicants(jobPostingId: string) {
  try {
    const token = getCookie('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobPostingId}/applicants/seeder/`, {
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
    throw resolvedError.message ?? 'Failed to unseed applicants';
  }
}

function useUnseedApplicants(jobPostingId: string) {
  const mutation = useMutation({
    mutationFn: () => unseedApplicants(jobPostingId),
  });

  return mutation;
}

export default useUnseedApplicants;

