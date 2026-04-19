import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_EAFData } from '../types';

async function getEAF(appliedJobId: number): Promise<T_EAFData> {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/eaf/${appliedJobId}/`,
    {
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'EAF not found.');
  }
  const json = await res.json();
  return json.data || json;
}

function useGetEAF(appliedJobId: number, enabled: boolean = true) {
  return useQuery(['eaf', appliedJobId], () => getEAF(appliedJobId), {
    enabled: enabled && !!appliedJobId,
    refetchOnWindowFocus: false,
  });
}

export default useGetEAF;
