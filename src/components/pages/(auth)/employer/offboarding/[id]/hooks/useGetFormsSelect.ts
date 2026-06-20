import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface T_FormSelectItem {
  id: number;
  title: string;
  form_type: string;
  form_type_display: string;
}

async function getFormsSelect(): Promise<T_FormSelectItem[]> {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forms/`, config);
      if (!res.ok) throw res.json();
      const json = await res.json();
      const raw = json?.records ?? json?.results ?? json?.data?.results ?? json?.data ?? json;
      return Array.isArray(raw) ? raw : [];
    }
    return [];
  } catch (err: any) {
    const errStringify = await err;
    if (Object.hasOwn(errStringify, 'detail')) throw errStringify;
    throw new Error(errStringify?.message ?? 'Failed to fetch forms.');
  }
}

function useGetFormsSelect() {
  return useQuery(['formsSelectCache'], () => getFormsSelect(), {
    refetchOnWindowFocus: false,
  });
}

export default useGetFormsSelect;
