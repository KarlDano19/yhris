import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BusinessJobReview {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  applicant_name: string;
  applicant_photo: string | null;
}

interface BusinessJobReviewsResponse {
  data: {
    reviews: BusinessJobReview[];
    average_rating: number | null;
    reviews_count: number;
    job_title: string;
  };
}

async function getBusinessJobReviews(jobId: number): Promise<BusinessJobReviewsResponse> {
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/${jobId}/reviews/`,
        config
      );
      if (!res.ok) {
        throw await res.json();
      }
      return res.json();
    }
    return {
      data: {
        reviews: [],
        average_rating: null,
        reviews_count: 0,
        job_title: '',
      },
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

function useGetBusinessJobReviews(jobId: number | null, enabled: boolean = true) {
  const query = useQuery(
    ['businessJobReviews', jobId],
    () => getBusinessJobReviews(jobId!),
    {
      enabled: enabled && jobId !== null,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  return query;
}

export default useGetBusinessJobReviews;
