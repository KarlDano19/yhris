import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteSavedJob(jobPostingId: number) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'DELETE',
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

function useUpdateSavedJobs() {
  const queryClient = useQueryClient();

  const query = useMutation(
    (jobPostingId: number) => deleteSavedJob(jobPostingId),
    {
      onSuccess: (_, jobPostingId) => {
        queryClient.setQueryData(['savedJobsCache'], (old: any) => {
          if (!old) return old;
          const arr = Array.isArray(old) ? old : old?.data ?? old;
          const filtered = arr.filter((item: any) =>
            (item.job_posting?.id ?? item.job_posting_id ?? item.job_posting) !== jobPostingId
          );
          return Array.isArray(old) ? filtered : { ...old, data: filtered };
        });
      },
    }
  );

  return query;
}

export default useUpdateSavedJobs;

