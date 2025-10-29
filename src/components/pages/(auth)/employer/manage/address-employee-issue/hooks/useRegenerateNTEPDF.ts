import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface RegenerateNTEPayload {
  id: number;
}

async function regenerateNTEPDF(payload: RegenerateNTEPayload) {
  try {
    const token = getCookie('token');
    const data = {
      action: 'regenerate_nte'
    };

    const config = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/employee-issues/${payload.id}/`,
      config
    );

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

const useRegenerateNTEPDF = () => {
  return useMutation({
    mutationFn: regenerateNTEPDF,
  });
};

export default useRegenerateNTEPDF;
