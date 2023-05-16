import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

async function getProfile() {
  try {
    const config = {
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${localStorage.token}`,
      },
    };
    let url = '';
    if (localStorage.accountType === 'employer') {
      url = `${process.env.hostName}/api/employer-profile/`;
    }
    if (localStorage.accountType === 'employee') {
      url = `${process.env.hostName}/api/employee-profile/`;
    }
    if (url) {
      const res = await axios.get(url, config);
      return res.data.profile;
    }
    return {};
  } catch (err: any) {
    if (Object.hasOwn(err, 'response')) {
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
