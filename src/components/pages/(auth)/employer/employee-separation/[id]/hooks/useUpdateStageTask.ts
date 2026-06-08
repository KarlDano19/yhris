import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateStageTask(data: { separationId: number | string; taskId: number; is_checked: boolean }) {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/separation/${data.separationId}/stage-tasks/${data.taskId}/`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ is_checked: data.is_checked }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update task.');
  }
  return res.json();
}

function useUpdateStageTask(separationId: number | string, stage: string) {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { separationId: number | string; taskId: number; is_checked: boolean }) => updateStageTask(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['stageTasksCache', separationId, stage]);
      },
    }
  );
}

export default useUpdateStageTask;
