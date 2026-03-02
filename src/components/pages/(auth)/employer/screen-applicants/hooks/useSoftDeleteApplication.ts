import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function softDeleteApplication(appliedJobId: number) {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/soft-delete/${appliedJobId}/`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to delete application');
  }

  return await res.json();
}

function useSoftDeleteApplication() {
  const query = useMutation({
    mutationFn: (appliedJobId: number) => softDeleteApplication(appliedJobId),
  });

  return query;
}

export default useSoftDeleteApplication;
