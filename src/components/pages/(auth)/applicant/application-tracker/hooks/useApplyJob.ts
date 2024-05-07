import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_ApplyJob } from '@/types/globals';

async function applyJob(job: T_ApplyJob) {
  try {
    const token = getCookie('token');
    const data = {
      applicant: job.applicantId,
      status: null,
      job_stages: null
    };
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applied-jobs`, config); //change uri
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

function useApplyJob() {
  const query = useMutation((job: T_ApplyJob) =>
    applyJob(job)
  );

  return query;
}

export default useApplyJob;
