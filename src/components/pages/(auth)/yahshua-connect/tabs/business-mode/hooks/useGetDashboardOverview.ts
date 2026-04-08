import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface DashboardOverviewResponse {
  monthly_earnings: number;
  jobs_completed: number;
  urgent_requests: number;
  rating: number | null;
}

async function getDashboardOverview(): Promise<DashboardOverviewResponse> {
  try {
    const token = getCookie('token');
    const config: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    if (token) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/dashboard-overview/`,
        config
      );
      if (!res.ok) {
        throw res.json();
      }
      const data = await res.json();
      return data.data || data;
    }
    return {
      monthly_earnings: 0,
      jobs_completed: 0,
      urgent_requests: 0,
      rating: null,
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

function useGetDashboardOverview() {
  const query = useQuery(
    ['dashboardOverviewCache'],
    () => getDashboardOverview(),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    }
  );
  return query;
}

export default useGetDashboardOverview;
