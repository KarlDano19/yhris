import { useInfiniteQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface NotificationFilters {
  search?: string;
  page_size?: number;
  tab?: 'all' | 'unread';
}

async function getApplicantNotifications({
  pageParam = 1,
  filters = {}
}: {
  pageParam?: number;
  filters?: NotificationFilters;
}) {
  const token = getCookie('token');

  const searchParams = new URLSearchParams({
    current_page: String(pageParam),
    page_size: String((filters as any).page_size || 10),
    ...(filters && (filters as any).search ? { search: (filters as any).search } : {}),
    ...(filters && (filters as any).tab ? { tab: (filters as any).tab } : {}),
  });

  const config: RequestInit = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  if (token) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/yahshua-connect/notifications/?${searchParams}`, config);
    if (!res.ok) {
      throw await res.json();
    }
    const data = await res.json();
    return { ...data, current_page: pageParam };
  }
  return null;
}

function useGetApplicantNotifications(filters: NotificationFilters = {}) {
  return useInfiniteQuery(
    ['applicantNotifications', filters],
    ({ pageParam = 1 }) => getApplicantNotifications({ pageParam, filters }),
    {
      getNextPageParam: (lastPage: any) => {
        if (lastPage && lastPage.current_page < lastPage.total_pages) {
          return lastPage.current_page + 1;
        }
        return undefined;
      },
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      refetchInterval: 30000,
    }
  );
}

export default useGetApplicantNotifications;