import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getEmployeeDetails(employeeId: any) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token && employeeId) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/${employeeId}/`, config);
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return null;
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetEmployeeDetails(employeeId: any) {
  const query = useQuery(
    ['employeeDetailsCache', employeeId], // Include employeeId in the query key
    () => getEmployeeDetails(employeeId), 
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!employeeId, // Only run query when employeeId is provided
    }
  );

  return query;
}

export default useGetEmployeeDetails;
