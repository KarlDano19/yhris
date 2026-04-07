import { useInfiniteQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface UseGetMyBusinessJobsParams {
  status?: string;
  page_size?: number;
}

async function fetchMyBusinessJobs(params: UseGetMyBusinessJobsParams, pageParam: number = 1) {
  const token = getCookie('token');

  const searchParams = new URLSearchParams();
  searchParams.append('current_page', pageParam.toString());
  searchParams.append('page_size', String(params?.page_size || 10));
  if (params?.status) searchParams.append('status', params.status);

  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  const queryString = searchParams.toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/my-jobs/${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch business jobs.');
  }

  const responseData = await res.json();
  const data = responseData.data || responseData;

  return {
    records: data.records || [],
    total_records: data.total_records || 0,
    total_pages: data.total_pages || 1,
    current_page: pageParam,
  };
}

export function useGetMyBusinessJobs(params: UseGetMyBusinessJobsParams = {}, enabled: boolean = true) {
  const query = useInfiniteQuery(
    ['myBusinessJobsCache', params.status, params.page_size],
    ({ pageParam = 1 }) => fetchMyBusinessJobs(params, pageParam),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage && lastPage.current_page !== undefined && lastPage.total_pages !== undefined) {
          if (lastPage.current_page < lastPage.total_pages) {
            return lastPage.current_page + 1;
          }
        }
        return undefined;
      },
      enabled,
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
