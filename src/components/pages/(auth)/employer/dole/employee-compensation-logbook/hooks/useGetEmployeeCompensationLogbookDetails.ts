import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getEmployeeCompensationLogbookDetails(employee_compensation_logbook_id: number | null) {
  try {
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/employee-compensation-logbooks/${employee_compensation_logbook_id}/`,
        config
      );
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return {};
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetEmployeeCompensationLogbookDetails(employee_compensation_logbook_id: number | null) {
  const query = useQuery(
    ['employeeCompensationLogbookDetailsCache'],
    () => getEmployeeCompensationLogbookDetails(employee_compensation_logbook_id),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  return query;
}

export default useGetEmployeeCompensationLogbookDetails;
