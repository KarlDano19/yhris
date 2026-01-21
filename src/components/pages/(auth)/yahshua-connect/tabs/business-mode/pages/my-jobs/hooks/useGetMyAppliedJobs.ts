import { useInfiniteQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface GetMyAppliedJobsParams {
  application_status?: string;
  job_status?: string;
  page_size?: number;
}

async function getMyAppliedJobs(params: GetMyAppliedJobsParams = {}, pageParam: number = 1) {
  try {
    const token = getCookie('token');

    // Build query string
    const queryParams = new URLSearchParams();
    if (params.application_status) queryParams.append('application_status', params.application_status);
    if (params.job_status) queryParams.append('job_status', params.job_status);
    queryParams.append('page_size', String(params.page_size || 10));
    queryParams.append('current_page', String(pageParam));

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
      const response = await res.json();
      const data = response.data || response;

      return {
        records: data.records || [],
        total_records: data.total_records || 0,
        total_pages: data.total_pages || 1,
        current_page: pageParam,
      };
    }
    return {
      records: [],
      total_records: 0,
      total_pages: 1,
      current_page: pageParam,
    };
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
  const query = useInfiniteQuery(
    ['myAppliedBusinessJobs', params?.application_status, params?.job_status, params?.page_size],
    ({ pageParam = 1 }) => getMyAppliedJobs(params || {}, pageParam),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage && lastPage.current_page !== undefined && lastPage.total_pages !== undefined) {
          if (lastPage.current_page < lastPage.total_pages) {
            return lastPage.current_page + 1;
          }
        }
        return undefined;
      },
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  // Flatten all pages into a single array
  const allJobs = query.data?.pages.flatMap(page => page.records) || [];
  const totalRecords = query.data?.pages[0]?.total_records || 0;

  return {
    ...query,
    data: { records: allJobs, total_records: totalRecords },
    totalRecords,
  };
}

export default useGetMyAppliedJobs;

