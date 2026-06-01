import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function uploadStageTaskAttachment(data: { separationId: number | string; taskId: number; attachment: File }) {
  const token = getCookie('token');
  const formData = new FormData();
  formData.append('attachment', data.attachment);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/separation/${data.separationId}/stage-tasks/${data.taskId}/`,
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
  return useMutation(
    (data: { separationId: number | string; taskId: number; attachment: File }) =>
      uploadStageTaskAttachment(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['stageTasksCache', separationId, stage]);
      },
    }
  );
}

export default useUploadStageTaskAttachment;
