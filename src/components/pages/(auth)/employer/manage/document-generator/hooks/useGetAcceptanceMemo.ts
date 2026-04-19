import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export type T_ExistingMemo = {
  company_name: string;
  start_date: string;
  end_date: string;
  authority_name: string;
  authority_position: string;
  authority_date: string;
  signature: string | null;
  pdf_file: string | null;
  submitted_at: string | null;
};

async function getAcceptanceMemo(): Promise<T_ExistingMemo | null> {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employer-onboarding/memo-form/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch acceptance memo.');
  }
  const json = await res.json();
  // Backend returns null if no memo exists yet
  if (!json) return null;
  // Map backend field names to frontend expected names
  return {
    company_name: json.company_name,
    start_date: json.starting_date,
    end_date: json.ending_date,
    authority_name: json.employer_name,
    authority_position: json.position,
    authority_date: json.date,
    signature: json.signature ?? null,
    pdf_file: json.pdf_file ?? null,
    submitted_at: json.submitted_at ?? null,
  };
}

function useGetAcceptanceMemo() {
  return useQuery(['acceptanceMemoCache'], () => getAcceptanceMemo(), {
    refetchOnWindowFocus: false,
  });
}

export default useGetAcceptanceMemo;
