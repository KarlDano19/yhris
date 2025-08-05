import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateJobBenefitStatus(data: any) {
  try {
    const jobId = data['jobId'];
    // Ensure the boolean value is correctly converted to string
    const boolValue = data['is_show_benefits'] === true || data['is_show_benefits'] === 'true';
    
    const payload = {
      is_show_benefits: boolValue ? 'true' : 'false',
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

function useUpdateJobBenefitStatus() {
  const query = useMutation((data: any) => updateJobBenefitStatus(data));
  return query;
}

export default useUpdateJobBenefitStatus;
