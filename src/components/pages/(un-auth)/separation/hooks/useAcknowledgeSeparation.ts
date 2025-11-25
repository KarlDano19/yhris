import { useMutation } from '@tanstack/react-query';

interface AcknowledgeSeparationData {
  separation_id: number;
}

async function acknowledgeSeparation(data: AcknowledgeSeparationData) {
  try {
    const payload = {
      action: "acknowledge"
    };

    const config = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/separations/${data.separation_id}/`,
      config
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to acknowledge separation: ${res.status}`);
    }

    return res.json();
  } catch (err: any) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Failed to acknowledge separation');
  }
}

function useAcknowledgeSeparation() {
  const query = useMutation((data: AcknowledgeSeparationData) => acknowledgeSeparation(data));
  return query;
}

export default useAcknowledgeSeparation;