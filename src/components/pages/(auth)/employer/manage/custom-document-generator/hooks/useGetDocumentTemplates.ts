import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_DocumentTemplatesResponse } from '@/types/custom-document-generator';

async function getDocumentTemplates(search: string): Promise<T_DocumentTemplatesResponse> {
  try {
    const token = getCookie('token');
    const params = new URLSearchParams({ current_page: '1', page_size: '100' });
    if (search) params.append('search', search);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/document-templates/?${params.toString()}`, {
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

function useGetDocumentTemplates(search: string) {
  return useQuery(['documentTemplatesCache', search], () => getDocumentTemplates(search), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
}

export default useGetDocumentTemplates;
