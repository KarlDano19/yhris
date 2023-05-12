import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

async function getDepartmentItems() {
    try {
        const config = {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Token ${localStorage.token}`,
          },
        };
        const res = await axios.post(
          `${process.env.hostName}/api/departments/`,
          config
        );
        return res.data;
      } catch (err: any) {
        if (Object.hasOwn(err, "response")) {
          throw err.response.data.message;
        }
        throw err.message;
      }
}

function useGetDepartmentItems() {

  const query = useQuery(
    ['departmentsItemCache'],
    () => getDepartmentItems(),
    { keepPreviousData: true }
  );

  return query;
}

export default useGetDepartmentItems;
