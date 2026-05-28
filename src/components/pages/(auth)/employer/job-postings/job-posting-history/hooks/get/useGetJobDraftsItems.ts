import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

type T_DraftItemsFilters = {
  currentPage: number;
  pageSize: number;
};

async function getJobDraftsItems(filters: T_DraftItemsFilters) {
  try {
    const token = getCookie('token');
    const params = new URLSearchParams();
    params.append('current_page', String(filters.currentPage));
    params.append('page_size', String(filters.pageSize));

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job-drafts/?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch drafts');
    }

    return res.json();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch drafts');
  }
}

function useGetJobDraftsItems(filters: T_DraftItemsFilters) {
  return useQuery(
    ['jobDraftsTableCache', filters.currentPage, filters.pageSize],
    () => getJobDraftsItems(filters),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
}

export default useGetJobDraftsItems;
