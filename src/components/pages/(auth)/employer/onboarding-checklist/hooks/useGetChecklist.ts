import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_EmployerChecklist } from '@/components/pages/(auth)/admin/employer-onboarding/onboarding-tracker/modal/dummyData';

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
