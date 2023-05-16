import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

async function getSeparationItems(filters: any) {
  try {
    const config = {
      params: filters,
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${localStorage.token}`,
      },
    };
    const res = await axios.get(`${process.env.hostName}/api/separations/`, config);
    return res.data.separations;
  } catch (err: any) {
    if (Object.hasOwn(err, 'response')) {
      throw err.response.data.message;
    }
    throw err.message;
  }
}

function useGetSeparationItems(filters: any) {
  const query = useQuery(
    ['separationsItemCache', filters],
    () => getSeparationItems(filters),
    {
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetSeparationItems;
