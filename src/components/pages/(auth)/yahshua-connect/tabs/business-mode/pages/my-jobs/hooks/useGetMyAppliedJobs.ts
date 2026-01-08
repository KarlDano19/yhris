import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface GetMyAppliedJobsParams {
  application_status?: string;
  job_status?: string;
  page_size?: number;
  current_page?: number;
}

async function getMyAppliedJobs(params?: GetMyAppliedJobsParams) {
  try {
    const token = getCookie('token');
    
    // Build query string
    const queryParams = new URLSearchParams();
    if (params?.application_status) queryParams.append('application_status', params.application_status);
    if (params?.job_status) queryParams.append('job_status', params.job_status);
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.current_page) queryParams.append('current_page', params.current_page.toString());
    
    const queryString = queryParams.toString();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/my-applications/${queryString ? `?${queryString}` : ''}`;
    
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    
    if (token) {
      const res = await fetch(url, config);
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

function useGetMyAppliedJobs(params?: GetMyAppliedJobsParams) {
  const query = useQuery(
    ['myAppliedBusinessJobs', params],
    () => getMyAppliedJobs(params),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  return query;
}

export default useGetMyAppliedJobs;

