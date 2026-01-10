import { useQuery } from '@tanstack/react-query';
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

interface TalentSearchResponse {
  records: TalentSearchResult[];
  total: number;
  page: number;
  pageSize: number;
  currentPage: number;
  starting: number;
  ending: number;
}

interface SearchTalentParams {
  search?: string;
  location?: string[];
  gender?: string;
  salary?: string;
  from?: string;
  to?: string;
  pageSize?: number;
  currentPage?: number;
}

async function searchTalent(params: SearchTalentParams = {}): Promise<TalentSearchResponse> {
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
    queryParams.append('pageSize', String(params.pageSize || 20));
    queryParams.append('currentPage', String(params.currentPage || 1));

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
      return response.data || response;
    }
    return {
      records: [],
      total: 0,
      page: 1,
      pageSize: 20,
      currentPage: 1,
      starting: 0,
      ending: 0,
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
  const query = useQuery(
    ['talentSearchCache', params],
    () => searchTalent(params),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      staleTime: 3 * 60 * 1000, // Cache for 3 minutes
    }
  );
  return query;
}

export default useSearchTalent;
