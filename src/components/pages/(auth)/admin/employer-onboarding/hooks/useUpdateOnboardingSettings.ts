import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateOnboardingSettings(is_onboarding_enabled: boolean): Promise<{ is_onboarding_enabled: boolean; message: string }> {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/onboarding-settings/`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ is_onboarding_enabled }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update onboarding settings.');
  }
  return res.json();
}

function useUpdateOnboardingSettings() {
  const queryClient = useQueryClient();
  return useMutation(
    (is_onboarding_enabled: boolean) => updateOnboardingSettings(is_onboarding_enabled),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['onboardingSettingsCache']);
      },
    }
  );
}

export default useUpdateOnboardingSettings;
