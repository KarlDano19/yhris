import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_DocumentTemplate } from '@/types/custom-document-generator';

async function getDocumentTemplate(id: number): Promise<T_DocumentTemplate> {
  try {
    const token = getCookie('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/document-templates/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    });
    if (!res.ok) throw res.json();
    return res.json();
  } catch (error: any) {
    const errStringify = await error;
    if (errStringify && Object.hasOwn(errStringify, 'detail')) throw errStringify;
    throw errStringify?.message;
  }
}

function useGetDocumentTemplate(id: number | null) {
  return useQuery(['documentTemplatesCache', 'detail', id], () => getDocumentTemplate(id as number), {
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
  });
}

export default useGetDocumentTemplate;
