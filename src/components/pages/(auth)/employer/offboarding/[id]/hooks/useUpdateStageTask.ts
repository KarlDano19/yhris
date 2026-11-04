import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateStageTask(data: { separationId: number | string; taskId: number; is_checked: boolean }) {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/offboarding/${data.separationId}/stage-tasks/${data.taskId}/`,
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
  const cacheKey = ['stageTasksCache', separationId, stage];

  return useMutation(
    (data: { separationId: number | string; taskId: number; is_checked: boolean }) => updateStageTask(data),
    {
      // Flip the checkbox right away so a slow connection does not look frozen
      onMutate: async (data) => {
        await queryClient.cancelQueries(cacheKey);
        const previousTasks = queryClient.getQueryData<any[]>(cacheKey);
        queryClient.setQueryData<any[]>(cacheKey, (tasks = []) =>
          tasks.map((t) => (t.id === data.taskId ? { ...t, is_checked: data.is_checked } : t))
        );
        return { previousTasks };
      },
      onError: (_err, _data, context) => {
        if (context?.previousTasks) queryClient.setQueryData(cacheKey, context.previousTasks);
      },
      onSettled: () => {
        queryClient.invalidateQueries(cacheKey);
        queryClient.invalidateQueries(['separationCaseCache', String(separationId)]);
      },
    }
  );
}

export default useUpdateStageTask;
