import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface SignDocumentPayload {
  signatoryId: number;
  signature: Blob; // drawn (data URL -> blob) or uploaded file
  signaturePlacement?: string;
}

async function signDocument(payload: SignDocumentPayload) {
  const token = getCookie('token');
  const formData = new FormData();
  formData.append('signature', payload.signature, 'signature.png');
  if (payload.signaturePlacement) {
    formData.append('signature_placement', payload.signaturePlacement);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/document-signatories/${payload.signatoryId}/sign/`,
    {
      method: 'POST',
      headers: {
        // No Content-Type — the browser sets the multipart boundary.
        Authorization: `Token ${token}`,
      },
      body: formData,
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || errorData.detail || 'Failed to sign.');
  }
  return res.json();
}

export function useSignDocument() {
  const queryClient = useQueryClient();
  return useMutation((payload: SignDocumentPayload) => signDocument(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(['directivesItemCache']);
    },
  });
}

export default useSignDocument;
