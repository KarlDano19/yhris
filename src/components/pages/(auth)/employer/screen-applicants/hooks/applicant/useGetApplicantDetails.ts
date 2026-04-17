import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getApplicantDetails(id: any) {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/profile/${id}/`, config);
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

function useGetApplicantDetails(id: any) {
  const query = useQuery(
    ['applicantDetailsCache', {}],
    () => getApplicantDetails(id)
  );

  return query;
}

export default useGetApplicantDetails;
