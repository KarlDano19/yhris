import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateOnboardingStatus({ recordId, status }: { recordId: number; status: string }) {
  const token = getCookie('token');
  const config = {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ status }),
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/employer-onboarding/${recordId}/`, config);
  if (!res.ok) {
    throw res.json();
  }
  return res.json();
}

function useUpdateOnboardingStatus() {
  const queryClient = useQueryClient();
  return useMutation(updateOnboardingStatus, {
    onSuccess: (_: any, variables: { recordId: number; status: string }) => {
      queryClient.invalidateQueries(['onboardingDetailCache', String(variables.recordId)]);
      queryClient.invalidateQueries(['onboardingListCache']);
    },
  });
}

export default useUpdateOnboardingStatus;
