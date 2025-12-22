import { useInfiniteQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface NotificationFilters {
  search?: string;
  page_size?: number;
  tab?: 'all' | 'unread';
}

async function getNotifications({ 
  pageParam = 1, 
  filters = {} 
}: { 
  pageParam?: number; 
  filters?: NotificationFilters 
}) {
  const token = getCookie('token');

  const searchParams = new URLSearchParams({
    current_page: String(pageParam),
    page_size: String(filters.page_size || 10),
    ...(filters.search && { search: filters.search }),
    ...(filters.tab && { tab: filters.tab }),
  });

  const config = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  if (token) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/?${searchParams}`,
      config
    );
    if (!res.ok) {
      throw await res.json();
    }
    const data = await res.json();
    // Add the current page to the response so we can track it
    return { ...data, current_page: pageParam };
  }
  return null;
}

function useGetNotification(filters: NotificationFilters = {}) {
  return useInfiniteQuery(
    ['notificationCache', filters],
    ({ pageParam = 1 }) => getNotifications({ pageParam, filters }),
    {
      getNextPageParam: (lastPage) => {
        // Check if there are more pages
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

export default useGetNotification;