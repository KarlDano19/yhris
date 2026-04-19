import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_MyReviewsResponse } from '@/types/personal-mode';

async function getMyReviews(
  applicantId: number | undefined,
  filters: { currentPage: number; pageSize: number }
): Promise<T_MyReviewsResponse> {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    if (token) {
      // Build query parameters
      const params = new URLSearchParams({
        current_page: filters.currentPage.toString(),
        page_size: filters.pageSize.toString(),
      });

      // If applicantId is provided, fetch reviews for that specific applicant
      // Otherwise, fetch reviews for the authenticated applicant
      const url = applicantId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/applicants/${applicantId}/reviews/?${params.toString()}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/applicants/my-reviews/?${params.toString()}`;

      const res = await fetch(url, config);
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
      applicant_id: 0,
      applicant_name: '',
      average_rating: null,
      reviews_count: 0,
    };
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetMyReviews(
  applicantId: number | undefined,
  filters: { currentPage: number; pageSize: number },
  enabled: boolean = true
) {
  const query = useQuery(
    ['myReviews', applicantId, filters.currentPage, filters.pageSize],
    () => getMyReviews(applicantId, filters),
    {
      enabled: enabled,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetMyReviews;

