import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface ValidStage {
  id: number;
  title: string;
  order_by: number;
  reason: string;
}

interface ValidStagesResponse {
  valid_stages: ValidStage[];
  applied_job_id: number;
}

async function getValidStagesForRestoration(appliedJobId: number): Promise<ValidStagesResponse> {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/archive/${appliedJobId}/`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to get valid stages');
  }
  
  return await res.json();
}

function useGetValidStagesForRestoration(appliedJobId: number, enabled: boolean = true) {
  const query = useQuery({
    queryKey: ['validStagesForRestoration', appliedJobId],
    queryFn: () => getValidStagesForRestoration(appliedJobId),
    enabled: enabled && !!appliedJobId,
  });

  return query;
}

export default useGetValidStagesForRestoration;
export type { ValidStage, ValidStagesResponse }; 