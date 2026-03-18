import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_ApplicantVsHired } from '@/types/analytics';

async function getApplicantVsHired(jobId?: number, from?: string, to?: string): Promise<T_ApplicantVsHired> {
  const token = getCookie('token');
  const config = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  if (token) {
    const searchParams = new URLSearchParams();
    if (jobId) searchParams.set('job_id', String(jobId));
    if (from) searchParams.set('from', from);
    if (to) searchParams.set('to', to);
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/workforce-overview/applicant-vs-hired/${qs}`,
      config
    );
    if (!res.ok) throw res.json();
    const json = await res.json();
    return json;
  }
  return {} as T_ApplicantVsHired;
}

function useGetApplicantVsHired(enabled = true, jobId?: number, from?: string, to?: string) {
  return useQuery(
    ['analyticsApplicantVsHired', jobId, from, to],
    () => getApplicantVsHired(jobId, from, to),
    {
      keepPreviousData: true,
      enabled,
      refetchOnWindowFocus: false
    }
  );
}

export default useGetApplicantVsHired;
