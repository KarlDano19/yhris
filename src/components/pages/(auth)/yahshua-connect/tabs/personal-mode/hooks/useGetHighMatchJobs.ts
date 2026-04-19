import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_HighMatchJobsFilters } from '@/types/personal-mode';

async function getHighMatchJobs(filters?: T_HighMatchJobsFilters) {
  try {
    const token = getCookie('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const searchParams = new URLSearchParams();
    searchParams.append('view_type', 'applicant_personal_high_match');
    
    if (filters?.min_match_percentage !== undefined) {
      searchParams.append('min_match_percentage', filters.min_match_percentage.toString());
    }
    
    if (filters?.limit !== undefined) {
      searchParams.append('limit', filters.limit.toString());
    }

    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    const queryString = searchParams.toString();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/yahshua-connect/jobs/?${queryString}`;

    const res = await fetch(url, config);
    if (!res.ok) {
      throw res.json();
    }
    const responseData = await res.json();

    // Handle response structure
    const data = responseData.records ? responseData : (responseData.data || responseData);
    return data.records || [];
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetHighMatchJobs(filters?: T_HighMatchJobsFilters) {
  const query = useQuery(
    ['highMatchJobsCache', filters?.min_match_percentage, filters?.limit],
    () => getHighMatchJobs(filters),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetHighMatchJobs;

