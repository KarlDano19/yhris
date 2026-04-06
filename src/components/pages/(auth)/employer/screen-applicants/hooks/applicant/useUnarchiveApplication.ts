import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function unarchiveApplication(appliedJobId: number, fallbackStageId?: number) {
  const token = getCookie('token');
  const body = fallbackStageId ? { fallback_stage_id: fallbackStageId } : {};
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/archive/${appliedJobId}/`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to unarchive application');
  }
  
  return await res.json();
}

function useUnarchiveApplication() {
  const query = useMutation({
    mutationFn: ({ appliedJobId, fallbackStageId }: { appliedJobId: number; fallbackStageId?: number }) => 
      unarchiveApplication(appliedJobId, fallbackStageId),
  });

  return query;
}

export default useUnarchiveApplication;
