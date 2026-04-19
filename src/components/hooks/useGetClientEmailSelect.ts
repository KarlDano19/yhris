import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getClientEmailSelect(filters: any) {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);

    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/employers/?${params.toString()}`,
        config
      );
      if (!res.ok) {
        throw res.json();
      }
      const data = await res.json();
      // Normalize to the same shape EmailField expects: { records: [...] }
      const raw: any[] = Array.isArray(data) ? data : (data.records ?? []);
      return {
        records: raw.map((item: any) => ({
          id: item.id,
          firstname: item.name,
          lastname: '',
          email: item.email,
          department: null,
          position: null,
        })),
      };
    }
    return { records: [] };
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetClientEmailSelect(filters: any, enabled = true) {
  const normalizedSearch = filters?.search?.trim();

  return useQuery(
    ['clientEmailSelectCache', normalizedSearch],
    () => getClientEmailSelect({ search: normalizedSearch }),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled,
      staleTime: 5 * 60 * 1000,
    }
  );
}

export default useGetClientEmailSelect;
