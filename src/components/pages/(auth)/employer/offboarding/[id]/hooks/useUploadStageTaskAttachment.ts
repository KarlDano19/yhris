import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function uploadStageTaskAttachment(data: { separationId: number | string; taskId: number; attachment: File }) {
  const token = getCookie('token');
  const formData = new FormData();
  formData.append('attachment', data.attachment);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/offboarding/${data.separationId}/stage-tasks/${data.taskId}/`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to upload attachment.');
  }
  return res.json();
}

function useUploadStageTaskAttachment(separationId: number | string, stage: string) {
  const queryClient = useQueryClient();
  const cacheKey = ['stageTasksCache', separationId, stage];

  return useMutation(
    (data: { separationId: number | string; taskId: number; attachment: File }) =>
      uploadStageTaskAttachment(data),
    {
      onSuccess: (updatedTask) => {
        // The PATCH returns the updated task: show "View file" now instead of waiting for the refetch
        queryClient.setQueryData<any[]>(cacheKey, (tasks = []) =>
          tasks.map((t) => (t.id === updatedTask?.id ? { ...t, ...updatedTask } : t))
        );
        queryClient.invalidateQueries(cacheKey);
        queryClient.invalidateQueries(['separationCaseCache', String(separationId)]);
      },
    }
  );
}

export default useUploadStageTaskAttachment;
