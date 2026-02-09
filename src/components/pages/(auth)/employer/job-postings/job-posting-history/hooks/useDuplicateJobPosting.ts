import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function duplicateJobPosting(job_posting_id: number) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${job_posting_id}/duplicate/`, config);
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

function useDuplicateJobPosting() {
  const query = useMutation((job_posting_id: number) => duplicateJobPosting(job_posting_id));
  return query;
}

export default useDuplicateJobPosting;

