import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteStageTask(data: { separationId: number | string; taskId: number }) {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/separation/${data.separationId}/stage-tasks/${data.taskId}/`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to delete task.');
  }
  return res.json();
}

function useDeleteStageTask(separationId: number | string, stage: string) {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { separationId: number | string; taskId: number }) => deleteStageTask(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['stageTasksCache', separationId, stage]);
      },
    }
  );
}

export default useDeleteStageTask;
