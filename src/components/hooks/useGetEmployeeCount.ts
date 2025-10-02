import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getEmployeeCount() {
  try {
    let newFilters = { view_type: 'count' };
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/?${searchParams}`, config);
      if (!res.ok) {
        throw res.json();
      }
      const data = await res.json();
      return data.count;
    }
    return 0;
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetEmployeeCount() {
  const query = useQuery(['employeeCountCache'], () => getEmployeeCount(), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useGetEmployeeCount;
