import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export interface PendingSignature {
  signatory_id: number;
  model_name: string;
  object_id: number;
  title: string | null;
  directive_type: string | null;
  assigned_at: string | null;
}

async function getPendingSignatures(): Promise<PendingSignature[]> {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pending-signatures/`, config);
      if (!res.ok) throw res.json();
      const data = await res.json();
      return Array.isArray(data) ? data : (data?.records ?? []);
    }
    return [];
  } catch (error: any) {
    let errStringify = await error;
    if (Object.hasOwn(errStringify, 'detail')) throw errStringify;
    throw errStringify.message;
  }
}

function useGetPendingSignatures() {
  return useQuery(['pendingSignaturesCache'], () => getPendingSignatures(), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
}

export default useGetPendingSignatures;
