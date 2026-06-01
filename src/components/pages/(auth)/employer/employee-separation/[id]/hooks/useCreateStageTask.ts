import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function createStageTask(data: { separationId: number | string; stage: string; label: string }) {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/separation/${data.separationId}/stage-tasks/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ stage: data.stage, label: data.label }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to create task.');
  }
  return res.json();
}

function useCreateStageTask(separationId: number | string, stage: string) {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { separationId: number | string; stage: string; label: string }) => createStageTask(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['stageTasksCache', separationId, stage]);
      },
    }
  );
}

export default useCreateStageTask;
