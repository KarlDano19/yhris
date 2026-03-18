import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_OnboardingRecord } from '../modal/dummyData';

async function getOnboardingList(search: string): Promise<T_OnboardingRecord[]> {
  try {
    const token = getCookie('token');
    const params = new URLSearchParams({ search });
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/employer-onboarding/?${params}`, config);
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }

    return [];
  } catch (err: any) {
    return [];
  }
}

function useGetOnboardingList(search: string) {
  return useQuery(['onboardingListCache', search], () => getOnboardingList(search), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
}

export default useGetOnboardingList;
