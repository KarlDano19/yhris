import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_AttritionRate } from '@/types/analytics';

async function getAttritionRate(filters: { from?: string; to?: string }): Promise<T_AttritionRate> {
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/workforce-overview/attrition-rate/?${params}`,
      config
    );
    if (!res.ok) throw res.json();
    const json = await res.json();
    return json;
  }
  return { attrition_trend: [], exit_reasons: [] };
}

function useGetAttritionRate(filters: { from?: string; to?: string; enabled?: boolean } = {}) {
  const { enabled = true, ...queryFilters } = filters;
  return useQuery(
    ['analyticsAttritionRate', queryFilters.from, queryFilters.to],
    () => getAttritionRate(queryFilters),
    { 
      keepPreviousData: true, 
      enabled, 
      refetchOnWindowFocus: false 
    }
  );
}

export default useGetAttritionRate;
