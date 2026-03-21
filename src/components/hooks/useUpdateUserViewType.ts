import { useMutation } from '@tanstack/react-query';

import { apiFetch } from '@/helpers/api';

async function updateUserViewType(viewType: string): Promise<void> {
  const res = await apiFetch('/api/user-accounts/details/', {
    method: 'PATCH',
    body: JSON.stringify({ view_type: viewType }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || 'Failed to update view type.');
  }

  // Refresh iron-session flags from backend after the PATCH succeeds.
  // This must complete before the caller redirects so the middleware gate
  // reads the updated hasCompletedOnboarding value.
  await fetch('/api/refresh-onboarding-session', { method: 'POST' });
}

export function useUpdateUserViewType() {
  return useMutation((viewType: string) => updateUserViewType(viewType));
}
