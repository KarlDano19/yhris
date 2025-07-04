import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getExportHealthAndSafetyReportItems(filters: any) {
  try {
    let newFilters = { ...filters };
    if (filters.from) newFilters.from = filters.from.toLocaleDateString('en-CA');
    if (filters.to) newFilters.to = filters.to.toLocaleDateString('en-CA');
    newFilters.export = true;
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/health-and-safety-organization-reports/?${searchParams}`,
        config
      );
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

function useGetExportHealthAndSafetyReportItems(filters: any) {
  const query = useQuery([], () => getExportHealthAndSafetyReportItems(filters), {
    enabled: false,
    keepPreviousData: true,
  });

  return query;
}

export default useGetExportHealthAndSafetyReportItems; 