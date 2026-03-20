import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_WorkforceKPIs } from '@/types/analytics';

async function getWorkforceOverviewKPIs(filters: { from?: string; to?: string }): Promise<T_WorkforceKPIs> {
  const token = getCookie('token');
  const params = new URLSearchParams();
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);

  const config = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  if (token) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/workforce-overview/?${params}`,
      config
    );
    if (!res.ok) throw res.json();
    const json = await res.json();
    return json;
  }
  return {} as T_WorkforceKPIs;
}

function useGetWorkforceOverviewKPIs(filters: { from?: string; to?: string } = {}) {
  return useQuery(
    ['analyticsWorkforceKPIs', filters.from, filters.to],
    () => getWorkforceOverviewKPIs(filters),
    { 
      keepPreviousData: true, 
      refetchOnWindowFocus: false 
    }
  );
}

export default useGetWorkforceOverviewKPIs;
