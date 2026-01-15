import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getEmployeeIssueItems(filters: any) {
  try {
    let newFilters = {...filters};
    if (filters.from) newFilters.from = filters.from.toLocaleDateString('en-CA');
    if (filters.to) newFilters.to = filters.to.toLocaleDateString('en-CA');
    if (!newFilters.from) delete newFilters.from;
    if (!newFilters.to) delete newFilters.to;
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/employee-issues/?${searchParams}`,
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

function useGetEmployeeIssueItems(filters: any) {
  const query = useQuery(
    ['employeeIssueItemCache', filters.currentPage, filters.pageSize, filters.search, filters.from, filters.to, filters.status, filters.status_sort],
    () => getEmployeeIssueItems(filters),
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    }
  );
  return query;
}

export default useGetEmployeeIssueItems;
