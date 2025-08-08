import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateJobRolesStatus(data: any) {
  try {
    const jobId = data['jobId'];
    // Ensure the boolean value is correctly converted to string
    const boolValue = data['is_show_roles'] === true || data['is_show_roles'] === 'true';
    
    const payload = {
      is_show_roles: boolValue ? 'true' : 'false',
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

function useUpdateJobRolesStatus() {
  const query = useMutation((data: any) => updateJobRolesStatus(data));
  return query;
}

export default useUpdateJobRolesStatus;
