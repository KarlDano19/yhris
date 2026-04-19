import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export type T_OnboardingChecklist = {
  id: number;
  name: string;
  description: string;
  video_url?: string;
  is_completed: boolean;
};

export type T_OnboardingPhase = {
  id: number;
  name: string;
  description: string;
  checklists: T_OnboardingChecklist[];
  total_items: number;
  completed_items: number;
  phase_number: number | null;
};

export type T_EmployerChecklist = {
  id: number | null;
  employer_id: number | null;
  employer_name: string | null;
  status: string;
  phases: T_OnboardingPhase[];
  created_at: string | null;
  completed_at: string | null;
  total_items: number;
  completed_items: number;
  progress_pct: number;
};

async function getChecklist(): Promise<T_EmployerChecklist> {
  const token = getCookie('token');
  const config = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };
  if (token) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employer-onboarding/checklist/`, config);
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  }

  throw new Error('Employer checklist not found.');
}

function useGetChecklist() {
  return useQuery(['employerChecklistCache'], () => getChecklist(), {
    refetchOnWindowFocus: false,
  });
}

export default useGetChecklist;
