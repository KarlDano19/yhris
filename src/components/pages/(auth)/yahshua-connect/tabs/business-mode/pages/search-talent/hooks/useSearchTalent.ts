import { useInfiniteQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export interface TalentSearchResult {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  address: string;
  photo: string | null;
  skills: string[];
  education: string;
  average_rating: number;
  reviews_count: number;
  jobs_done_count: number;
  available_for_bookings: boolean;
  expected_salary: number | null;
  portfolio_url: string | null;
  description: string | null;
  setup_preference: string | null;
}

interface SearchTalentParams {
  search?: string;
  location?: string[];
  gender?: string;
  salary?: string;
  from?: string;
  to?: string;
  pageSize?: number;
}

async function searchTalent(params: SearchTalentParams, pageParam: number = 1) {
  try {
    const token = getCookie('token');

    // Build query params
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.location && params.location.length > 0) {
      params.location.forEach(loc => queryParams.append('location', loc));
    }
    if (params.gender) queryParams.append('gender', params.gender);
    if (params.salary) queryParams.append('salary', params.salary);
    if (params.from) queryParams.append('from', params.from);
    if (params.to) queryParams.append('to', params.to);
    queryParams.append('pageSize', String(params.pageSize || 10));
    queryParams.append('currentPage', String(pageParam));

    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    if (token) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicants/talent-search/?${queryParams.toString()}`,
        config
      );
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

export function useSearchTalent(params: SearchTalentParams = {}) {
  const query = useInfiniteQuery(
    ['talentSearchCache', params.search, params.location, params.gender, params.salary, params.from, params.to, params.pageSize],
    ({ pageParam = 1 }) => searchTalent(params, pageParam),
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
      staleTime: 3 * 60 * 1000, // Cache for 3 minutes
    }
  );

  // Flatten all pages into a single array
  const allTalents = query.data?.pages.flatMap(page => page.records) || [];
  const totalRecords = query.data?.pages[0]?.total_records || 0;

  return {
    ...query,
    data: { records: allTalents, total_records: totalRecords },
    totalRecords,
  };
}

export default useSearchTalent;
