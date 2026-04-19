import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

type T_OnboardingChecklist = {
  id: number;
  name: string;
  description: string;
  video_url?: string;
  is_completed: boolean;
};

type T_OnboardingPhase = {
  id: number;
  name: string;
  description: string;
  total_items: number;
  completed_items: number;
  checklists: T_OnboardingChecklist[];
};

type T_OnboardingDetail = {
  id: number;
  employer_name: string;
  status: string;
  phases: T_OnboardingPhase[];
  total_items: number;
  completed_items: number;
  progress_pct: number;
};

async function getOnboardingDetail(recordId: string): Promise<T_OnboardingDetail> {
  const token = getCookie('token');
  const config = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };
  if (token) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/employer-onboarding/${recordId}/`,
      config
    );
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  }

  throw new Error('Onboarding record not found.');
}

function useGetOnboardingDetail(recordId: string) {
  return useQuery(['onboardingDetailCache', recordId], () => getOnboardingDetail(recordId), {
    refetchOnWindowFocus: false,
    enabled: !!recordId,
  });
}

export default useGetOnboardingDetail;
