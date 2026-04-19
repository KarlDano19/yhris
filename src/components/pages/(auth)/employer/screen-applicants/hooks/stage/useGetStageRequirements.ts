import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

// Get stage requirements and their completion status for a specific stage
async function getStageRequirements(appliedJobId: number, stageId: number) {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/stage-requirements/${appliedJobId}/?stage_id=${stageId}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  
  return await res.json();
}

function useGetStageRequirements(appliedJobId: number, stageId: number, enabled: boolean = true) {
  const query = useQuery({
    queryKey: ['stage-requirements', appliedJobId, stageId],
    queryFn: () => getStageRequirements(appliedJobId, stageId),
    enabled: enabled && !!appliedJobId && !!stageId,
  });

  return query;
}

export default useGetStageRequirements; 