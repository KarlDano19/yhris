import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getArchivedApplicants(jobPostingId: string) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobPostingId}/applicants/archived/`, config);
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return [];
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetArchivedApplicants(jobPostingId: string) {
  const query = useQuery({
    queryKey: ['archivedApplicants', jobPostingId],
    queryFn: () => getArchivedApplicants(jobPostingId),
    enabled: !!jobPostingId,
  });

  return query;
}

export default useGetArchivedApplicants; 