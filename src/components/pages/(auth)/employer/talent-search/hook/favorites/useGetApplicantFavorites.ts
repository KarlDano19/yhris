import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getApplicantFavorites(search?: string) {
  try {
    const token = getCookie('token');
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicants/favorites/${params}`, config);
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

function useGetApplicantFavorites(search?: string) {
  const query = useQuery({
    queryKey: ['applicant-favorites', search],
    queryFn: () => getApplicantFavorites(search),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  return query;
}

export default useGetApplicantFavorites; 