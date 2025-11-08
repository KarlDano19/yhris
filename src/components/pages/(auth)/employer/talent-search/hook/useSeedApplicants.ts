import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface SeedApplicantsParams {
  count?: number;
}

async function seedApplicants(params: SeedApplicantsParams) {
  try {
    const { count = 5 } = params;
    const token = getCookie('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicants/seeder/`, {
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
    throw resolvedError.message ?? 'Failed to seed applicants';
  }
}

function useSeedApplicants() {
  return useMutation({
    mutationFn: (params: SeedApplicantsParams) => seedApplicants(params),
  });
}

export default useSeedApplicants;

