import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getClientItems(filters: any) {
  try {
    let newFilters = { ...filters };
    const searchParams = new URLSearchParams(newFilters);
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/employers/?${searchParams}`, config);
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return [];
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useClientItems(filters: { search?: string; client_source?: string; status?: string } = {}) {
  const query = useQuery(['clientItemsCache', filters], () => getClientItems(filters), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useClientItems;
