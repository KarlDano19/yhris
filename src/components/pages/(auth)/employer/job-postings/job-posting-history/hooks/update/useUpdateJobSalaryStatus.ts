import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_ToggleJobSalaryPayload } from '@/types/job_posting';

async function updateJobSalaryStatus(data: T_ToggleJobSalaryPayload) {
  try {
    const jobId = data['jobId'];
    const boolValue = data['is_show_salary'];
    
    const payload = {
      is_show_salary: boolValue ? 'true' : 'false',
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

function useUpdateJobSalaryStatus() {
  const query = useMutation((data: T_ToggleJobSalaryPayload) => updateJobSalaryStatus(data));
  return query;
}

export default useUpdateJobSalaryStatus;
