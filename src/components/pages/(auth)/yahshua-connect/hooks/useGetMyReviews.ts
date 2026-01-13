import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getMyReviews(applicantId?: number) {
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
      // If applicantId is provided, fetch reviews for that specific applicant
      // Otherwise, fetch reviews for the authenticated applicant
      const url = applicantId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/applicants/${applicantId}/reviews/`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/applicants/my-reviews/`;
      
      const res = await fetch(url, config);
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return null;
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetMyReviews(applicantId?: number, enabled: boolean = true) {
  const query = useQuery(
    ['myReviews', applicantId], 
    () => getMyReviews(applicantId), 
    {
      enabled: enabled,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetMyReviews;

