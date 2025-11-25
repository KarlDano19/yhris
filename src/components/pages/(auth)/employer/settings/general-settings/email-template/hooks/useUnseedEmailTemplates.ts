import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function unseedEmailTemplates() {
  try {
    const token = getCookie('token');
    const config = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
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

function useUnseedEmailTemplates() {
  const mutation = useMutation({
    mutationFn: () => unseedEmailTemplates(),
  });

  return mutation;
}

export default useUnseedEmailTemplates;
