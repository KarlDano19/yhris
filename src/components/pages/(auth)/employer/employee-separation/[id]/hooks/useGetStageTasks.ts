import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getStageTasks(separationId: number | string, stage: string) {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/separation/${separationId}/stage-tasks/?stage=${stage}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch tasks.');
  }
  return res.json();
}

function useGetStageTasks(separationId: number | string, stage: string) {
  return useQuery(
    ['stageTasksCache', separationId, stage],
    () => getStageTasks(separationId, stage),
    { refetchOnWindowFocus: false, enabled: !!separationId && !!stage }
  );
}

export default useGetStageTasks;
