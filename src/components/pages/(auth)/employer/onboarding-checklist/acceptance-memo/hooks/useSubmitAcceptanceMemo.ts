import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export type T_SubmitAcceptanceMemoData = {
  company_name: string;
  start_date: string;
  end_date: string;
  authority_name: string;
  authority_position: string;
  authority_date: string;
  signature: string | null;
  checklist_item_id?: number | null;
};

async function submitAcceptanceMemo(data: T_SubmitAcceptanceMemoData) {
  const token = getCookie('token');
  const config: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  };
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/employer-onboarding/acceptance-memo/`,
    config
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to submit acceptance memo.');
  }
  return res.json();
}

export function useSubmitAcceptanceMemo() {
  const queryClient = useQueryClient();
  return useMutation(
    (data: T_SubmitAcceptanceMemoData) => submitAcceptanceMemo(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['acceptanceMemoCache']);
        queryClient.invalidateQueries(['employerChecklistCache']);
      },
    }
  );
}
