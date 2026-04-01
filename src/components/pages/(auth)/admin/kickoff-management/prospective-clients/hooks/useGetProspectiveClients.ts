import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getProspectiveClients(filters: any) {
  try {
    const searchParams = new URLSearchParams({ ...filters });
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prospective-clients/?${searchParams}`, config);
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

function useGetProspectiveClients(filters: any) {
  const query = useQuery(['prospectiveClientItemsCache'], () => getProspectiveClients(filters), {
    enabled: false,
    keepPreviousData: true,
  });
  return query;
}

export default useGetProspectiveClients;
