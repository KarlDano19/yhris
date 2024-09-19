import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getApplicantRecentApplication() {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/recent/`, config);
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return {};
  } catch (error: any) {
    let errStringify = await error;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.detail;
    }
    if (Object.hasOwn(errStringify, 'detail')) {
      throw errStringify;
    }
    throw errStringify.message;
  }
}

function useGetApplicantRecentApplication() {
  const query = useQuery(['applicantRecentApplicationCache'], () => getApplicantRecentApplication(), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  return query;
}

export default useGetApplicantRecentApplication;
