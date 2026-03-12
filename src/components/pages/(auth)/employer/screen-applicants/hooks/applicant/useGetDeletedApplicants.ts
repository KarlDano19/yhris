import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getDeletedApplicants(jobPostingId: string) {
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobPostingId}/applicants/?is_deleted=true`,
        config
      );
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

function useGetDeletedApplicants(jobPostingId: string) {
  const query = useQuery(
    ['deletedApplicants', jobPostingId],
    () => getDeletedApplicants(jobPostingId),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetDeletedApplicants;
