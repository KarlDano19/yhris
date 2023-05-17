import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getCookie } from 'cookies-next';

async function getEmployeeItems() {
  try {
    const token = getCookie('token');
    const config = {
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await axios.get(
      `${process.env.hostName}/api/employees/`,
      config
    );
    return res.data.employees;
  } catch (err: any) {
    if (Object.hasOwn(err, 'response')) {
      throw err.response.data.message;
    }
    throw err.message;
  }
}

function useGetEmployeeItems() {
  const query = useQuery(['employeesItemCache'], () => getEmployeeItems(), {
    keepPreviousData: true,
  });

  return query;
}

export default useGetEmployeeItems;
