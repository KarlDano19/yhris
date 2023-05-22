import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getCookie, deleteCookie } from 'cookies-next';

async function getProfile() {
  try {
    const token = getCookie('token');
    const config = {
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await axios.get(`${process.env.hostName}/api/employer-profile/`, config);
      return res.data.profile;
    }
    return {};
  } catch (err: any) {
    if (Object.hasOwn(err, 'response')) {
      if (Object.hasOwn(err.response.data, 'detail')) {
        if ((err.response.data.detail).includes('Invalid token.')) {
          deleteCookie('token');
          location.href = '/login';
        }
      }
      throw err.response.data.message;
    }
    throw err.message;
  }
}

function useGetProfile() {
  const query = useQuery(['profileCache'], () => getProfile(), {
    keepPreviousData: true,
  });

  return query;
}

export default useGetProfile;
