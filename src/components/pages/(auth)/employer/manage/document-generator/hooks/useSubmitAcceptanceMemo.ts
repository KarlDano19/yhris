import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

type T_SubmitMemoPayload = {
  company_name: string;
  start_date: string;
  end_date: string;
  authority_name: string;
  authority_position: string;
  authority_date: string;
  signature: string | null;
  checklist_item_id: number | null;
  checks: {
    systemSetup: boolean;
    employeeData: boolean;
    systemConfig: boolean;
    userTraining: boolean;
    systemNavigation: boolean;
  };
};

async function submitAcceptanceMemo(payload: T_SubmitMemoPayload): Promise<void> {
  const token = getCookie('token');

  const formData = new FormData();
  formData.append('company_name', payload.company_name);
  formData.append('starting_date', payload.start_date);
  formData.append('ending_date', payload.end_date);
  formData.append('employer_name', payload.authority_name);
  formData.append('position', payload.authority_position);
  formData.append('date', payload.authority_date);

  // Serialize checks as ordered boolean array matching backend CHECK_LABELS order
  const checklistArray = [
    payload.checks.systemSetup,
    payload.checks.employeeData,
    payload.checks.systemConfig,
    payload.checks.userTraining,
    payload.checks.systemNavigation,
  ];
  formData.append('checklist', JSON.stringify(checklistArray));

  // Convert base64 signature to file blob if present
  if (payload.signature && payload.signature.startsWith('data:')) {
    const res = await fetch(payload.signature);
    const blob = await res.blob();
    formData.append('signature', blob, 'signature.png');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employer-onboarding/memo-form/`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to submit acceptance memo.');
  }
}

export function useSubmitAcceptanceMemo() {
  const queryClient = useQueryClient();
  return useMutation((payload: T_SubmitMemoPayload) => submitAcceptanceMemo(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(['acceptanceMemoCache']);
    },
  });
}
