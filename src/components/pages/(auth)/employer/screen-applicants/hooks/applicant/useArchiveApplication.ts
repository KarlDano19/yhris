import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function archiveApplication(appliedJobId: number) {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/archive/${appliedJobId}/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to archive application');
  }
  
  return await res.json();
}

function useArchiveApplication() {
  const query = useMutation({
    mutationFn: (appliedJobId: number) => archiveApplication(appliedJobId),
  });

  return query;
}

export default useArchiveApplication;

