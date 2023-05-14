import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

async function getPositionItems() {
    try {
        const config = {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Token ${localStorage.token}`,
          },
        };
        const res = await axios.get(
          `${process.env.hostName}/api/positions/`,
          config
        );
        return res.data.positions;
      } catch (err: any) {
        if (Object.hasOwn(err, "response")) {
          throw err.response.data.message;
        }
        throw err.message;
      }
}

function useGetEmployeeItems() {

  const query = useQuery(
    ['positionsItemCache'],
    () => getPositionItems(),
    { keepPreviousData: true }
  );

  return query;
}

export default useGetEmployeeItems;
