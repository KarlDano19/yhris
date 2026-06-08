import { useMutation } from '@tanstack/react-query';

interface AcknowledgeSeparationData {
  separation_id: number;
  signature: string | File;
}

async function acknowledgeSeparation(data: AcknowledgeSeparationData) {
  try {
    let body: string | FormData;
    let headers: Record<string, string> = {};

    if (data.signature instanceof File) {
      const formData = new FormData();
      formData.append('action', 'sign');
      formData.append('signature', data.signature);
      body = formData;
    } else {
      headers['content-type'] = 'application/json';
      body = JSON.stringify({ action: 'sign', signature: data.signature });
    }

    const config: RequestInit = {
      method: 'PATCH',
      headers,
      body,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/separations/${data.separation_id}/`,
      config
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to submit signature: ${res.status}`);
    }

    return res.json();
  } catch (err: any) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Failed to submit signature');
  }
}

function useAcknowledgeSeparation() {
  const query = useMutation((data: AcknowledgeSeparationData) => acknowledgeSeparation(data));
  return query;
}

export default useAcknowledgeSeparation;
