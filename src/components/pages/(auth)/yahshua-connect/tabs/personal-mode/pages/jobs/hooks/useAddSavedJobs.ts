import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addSavedJob(jobPostingId: number) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ job_posting: jobPostingId }),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saved-jobs/`, config);
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

function useAddSavedJobs() {
  const query = useMutation((jobPostingId: number) => addSavedJob(jobPostingId));
  return query;
}

export default useAddSavedJobs;

