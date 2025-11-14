import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface SeedEmployeeIssuesParams {
  count?: number;
}

async function seedEmployeeIssues(params: SeedEmployeeIssuesParams) {
  try {
    const { count = 5 } = params;
    const token = getCookie('token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee-issues/seeder/`, {
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
    throw resolvedError.message ?? 'Failed to seed employee issues';
  }
}

function useSeedEmployeeIssues() {
  return useMutation({
    mutationFn: (params: SeedEmployeeIssuesParams) => seedEmployeeIssues(params),
  });
}

export default useSeedEmployeeIssues;

