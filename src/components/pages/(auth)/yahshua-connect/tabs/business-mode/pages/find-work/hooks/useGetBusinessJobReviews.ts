import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_BusinessJobReviewsResponse } from '@/types/business-mode';

async function getBusinessJobReviews(
  jobId: number,
  filters: { currentPage: number; pageSize: number }
): Promise<T_BusinessJobReviewsResponse> {
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
      // Build query parameters
      const params = new URLSearchParams({
        current_page: filters.currentPage.toString(),
        page_size: filters.pageSize.toString(),
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/${jobId}/reviews/?${params.toString()}`,
        config
      );
      if (!res.ok) {
        throw await res.json();
      }
      return res.json();
    }
    return {
      records: [],
      total_records: 0,
      total_pages: 0,
      starting: 0,
      ending: 0,
      average_rating: null,
      reviews_count: 0,
      job_title: '',
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

function useGetBusinessJobReviews(
  jobId: number | null,
  filters: { currentPage: number; pageSize: number },
  enabled: boolean = true
) {
  const query = useQuery(
    ['businessJobReviews', jobId, filters.currentPage, filters.pageSize],
    () => getBusinessJobReviews(jobId!, filters),
    {
      enabled: enabled && jobId !== null,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  return query;
}

export default useGetBusinessJobReviews;
