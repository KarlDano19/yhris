import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export type T_TransferHistoryItem = {
  id: number;
  from_job_posting: number | null;
  to_job_posting: number | null;
  from_job_posting_title: string | null;
  to_job_posting_title: string | null;
  from_stage_title: string | null;
  to_stage_title: string | null;
  transferred_by_name: string | null;
  created_at: string;
};

async function getTransferHistory(appliedJobId: number): Promise<T_TransferHistoryItem[]> {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/transfer-history/${appliedJobId}/`,
    {
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to load transfer history.');
  }
  const json = await res.json();
  return json.data || json;
}

function useGetTransferHistory(appliedJobId?: number, enabled: boolean = true) {
  return useQuery(
    ['transferHistoryCache', appliedJobId],
    () => getTransferHistory(appliedJobId as number),
    {
      enabled: enabled && !!appliedJobId,
      refetchOnWindowFocus: false,
    }
  );
}

export default useGetTransferHistory;
