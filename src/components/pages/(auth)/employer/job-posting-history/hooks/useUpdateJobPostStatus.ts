import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateJobPostStatus(data: any) {
  try {
    const jobId = data['jobId'];
    const payload = {
      is_active: data['is_active'],
    };
    const token = getCookie('token');
    const config = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}/`, config);
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return {};
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useUpdateJobPostStatus() {
  const query = useMutation((data: any) => updateJobPostStatus(data));
  return query;
}

export default useUpdateJobPostStatus;
