
import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface SeedEmailTemplatesParams {
  count?: number;
}

async function seedEmailTemplates(params: SeedEmailTemplatesParams) {
  try {
    const { count = 5 } = params;
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        count,
      }),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email-templates/seeder/`, config);
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useSeedEmailTemplates() {
  const mutation = useMutation({
    mutationFn: (params: SeedEmailTemplatesParams) => seedEmailTemplates(params),
  });

  return mutation;
}

export default useSeedEmailTemplates;
