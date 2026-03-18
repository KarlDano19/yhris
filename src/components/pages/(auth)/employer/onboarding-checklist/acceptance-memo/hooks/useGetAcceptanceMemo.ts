import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export type T_AcceptanceMemoData = {
  id: number;
  company_name: string;
  start_date: string;
  end_date: string;
  authority_name: string;
  authority_position: string;
  authority_date: string;
  signature: string | null;
  submitted_at: string;
};

async function getAcceptanceMemo(): Promise<T_AcceptanceMemoData | null> {
  const token = getCookie('token');
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };
  if (token) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employer-onboarding/acceptance-memo/`, config);
    if (!res.ok) {
      throw res.json();
    }
    const json = await res.json();
    return json.data ?? null;
  }
  throw new Error('Not authenticated.');
}

function useGetAcceptanceMemo() {
  return useQuery(['acceptanceMemoCache'], () => getAcceptanceMemo(), {
    refetchOnWindowFocus: false,
  });
}

export default useGetAcceptanceMemo;
