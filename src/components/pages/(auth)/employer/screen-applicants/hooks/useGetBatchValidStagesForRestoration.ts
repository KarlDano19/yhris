import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface ValidStage {
  id: number;
  title: string;
  order_by: number;
  reason: string;
}

interface BatchValidStagesResponse {
  valid_stages: ValidStage[];
  applied_job_ids: number[];
  total_applications: number;
  common_stages_count: number;
}

async function getBatchValidStagesForRestoration(appliedJobIds: number[]): Promise<BatchValidStagesResponse> {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/archive/batch/valid-stages/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      applied_job_ids: appliedJobIds
    }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to get batch valid stages');
  }
  
  return await res.json();
}

function useGetBatchValidStagesForRestoration(appliedJobIds: number[], enabled: boolean = true) {
  const query = useQuery({
    queryKey: ['batchValidStagesForRestoration', appliedJobIds.sort()],
    queryFn: () => getBatchValidStagesForRestoration(appliedJobIds),
    enabled: enabled && appliedJobIds.length >= 2,
  });

  return query;
}

export default useGetBatchValidStagesForRestoration;
export type { ValidStage, BatchValidStagesResponse };
