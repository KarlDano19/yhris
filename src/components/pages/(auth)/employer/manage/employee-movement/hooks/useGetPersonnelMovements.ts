import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface newFiltersProps {
    search?: string;
    from?: string;
    to?: string;
    current_page?: number;
    page_size?: number;
  }

async function getPersonnelMovements(params: newFiltersProps) {
  try {
    const searchParams = new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)]));
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/personnel-movements/?${searchParams}`, config);
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return { records: [], total: 0, starting: 0, ending: 0 };
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetPersonnelMovements(params: { search?: string; page_size?: number; current_page?: number }) {
  const query = useQuery(['personnelMovementsCache', params], () => getPersonnelMovements(params), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useGetPersonnelMovements;