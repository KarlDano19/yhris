import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function restoreDeletedApplication(appliedJobId: number) {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/soft-delete/${appliedJobId}/`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to restore application');
  }

  return await res.json();
}

function useRestoreDeletedApplication() {
  const query = useMutation({
    mutationFn: (appliedJobId: number) => restoreDeletedApplication(appliedJobId),
  });

  return query;
}

export default useRestoreDeletedApplication;
