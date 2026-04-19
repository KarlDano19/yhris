import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function resetOnboarding(): Promise<void> {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-accounts/details/`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ has_onboarded: false }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to reset onboarding.');
  }
  await fetch('/api/refresh-onboarding-session', { method: 'POST' });
}

function useResetOnboarding() {
  return useMutation(() => resetOnboarding());
}

export default useResetOnboarding;
