import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getOnboardingSettings(): Promise<{ is_onboarding_enabled: boolean }> {
  const token = getCookie('token');
  if (!token) return { is_onboarding_enabled: true };
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/onboarding-settings/`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  if (!res.ok) return { is_onboarding_enabled: true };
  return res.json();
}

function useGetOnboardingSettings() {
  return useQuery(['onboardingSettingsCache'], () => getOnboardingSettings(), {
    refetchOnWindowFocus: false,
  });
}

export default useGetOnboardingSettings;
