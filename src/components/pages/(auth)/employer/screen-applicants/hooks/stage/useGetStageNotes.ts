import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

// Get stage notes for an application
async function getStageNotes(appliedJobId: number) {
  const token = getCookie('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/stage-notes/${appliedJobId}/`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  
  const json = await res.json();
  return json.data || json;
}

function useGetStageNotes(appliedJobId: number, enabled: boolean = true) {
  const query = useQuery({
    queryKey: ['stage-notes', appliedJobId],
    queryFn: () => getStageNotes(appliedJobId),
    enabled: enabled && !!appliedJobId,
  });

  return query;
}

export default useGetStageNotes;