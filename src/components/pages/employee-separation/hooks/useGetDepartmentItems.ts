import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getCookie } from 'cookies-next';

async function getDepartmentItems() {
  try {
    const token = getCookie('token');
    const config = {
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await axios.get(
      `${process.env.hostName}/api/departments/`,
      config
    );
    return res.data.departments;
  } catch (err: any) {
    if (Object.hasOwn(err, 'response')) {
      throw err.response.data.message;
    }
    throw err.message;
  }
}

function useGetDepartmentItems() {
  const query = useQuery(['departmentsItemCache'], () => getDepartmentItems(), {
    keepPreviousData: true,
  });

  return query;
}

export default useGetDepartmentItems;
