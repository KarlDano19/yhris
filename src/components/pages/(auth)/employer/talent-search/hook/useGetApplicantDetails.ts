import { useMutation, useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getApplicantDetails(applicantId: number) {
  try {
    const token = getCookie('token');

    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicants/${applicantId}/`, config);
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

function useGetApplicantDetails(applicantId: number) {
  const query = useQuery({
    queryKey: ['applicantDetails', applicantId],
    queryFn: () => getApplicantDetails(applicantId),
    enabled: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useGetApplicantDetails;
