import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

type Params = {
  attachmentId?: number;
  separationId?: number;
  attachment: File;
};

async function uploadSignedCopy({ attachmentId, separationId, attachment }: Params) {
  const token = getCookie('token');
  const formData = new FormData();
  formData.append('attachment', attachment);

  let url: string;
  let method: string;

  if (attachmentId) {
    url = `${process.env.NEXT_PUBLIC_API_URL}/api/separation-letter-attachments/${attachmentId}/upload-signed-copy/`;
    method = 'PATCH';
  } else if (separationId) {
    url = `${process.env.NEXT_PUBLIC_API_URL}/api/separation/${separationId}/letter-signed-copy/`;
    method = 'POST';
  } else {
    throw new Error('Either attachmentId or separationId is required.');
  }

  const res = await fetch(url, {
    method,
    headers: { Authorization: `Token ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.message || 'Failed to upload signed copy.');
  }

  return res.json();
}

function useUploadSignedCopy() {
  const queryClient = useQueryClient();

  return useMutation((params: Params) => uploadSignedCopy(params), {
    onSuccess: () => {
      queryClient.invalidateQueries(['separationCase']);
    },
  });
}

export default useUploadSignedCopy;
