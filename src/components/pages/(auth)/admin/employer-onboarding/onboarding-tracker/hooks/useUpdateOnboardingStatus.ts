import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

type T_UpdateOnboardingStatus = {
  recordId: number;
  status: string;
  marked_completed_by?: string;
};

async function updateOnboardingStatus({ recordId, ...data }: T_UpdateOnboardingStatus) {
  const token = getCookie('token');
  const config = {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/employer-onboarding/${recordId}/`, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update onboarding status.');
  }
  return res.json();
}

function useUpdateOnboardingStatus() {
  const queryClient = useQueryClient();
  return useMutation(updateOnboardingStatus, {
    onSuccess: (_: any, variables: T_UpdateOnboardingStatus) => {
      queryClient.invalidateQueries(['onboardingDetailCache', String(variables.recordId)]);
      queryClient.invalidateQueries(['onboardingListCache']);
    },
  });
}

export default useUpdateOnboardingStatus;
