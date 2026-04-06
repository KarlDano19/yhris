import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

// Update stage requirements completion status
async function updateStageRequirements(appliedJobId: number, requirementStatuses: Record<string, boolean>) {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/stage-requirements/${appliedJobId}/`, {
    method: "PATCH",
    body: JSON.stringify({ requirement_statuses: requirementStatuses }),
    headers: {
      "content-type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  
  return await res.json();
}

function useUpdateStageRequirements() {
  const mutation = useMutation({
    mutationFn: ({ appliedJobId, requirementStatuses }: { appliedJobId: number; requirementStatuses: Record<string, boolean> }) =>
      updateStageRequirements(appliedJobId, requirementStatuses),
  });

  return mutation;
}

export default useUpdateStageRequirements; 