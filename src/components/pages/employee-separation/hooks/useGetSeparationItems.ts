import axios from 'axios';

import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getSeparationItems(filters: any) {
  try {
    const token = getCookie('token');
    const config = {
      params: filters,
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await axios.get(
      `${process.env.hostName}/api/separations/`,
      config
    );
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
