import axios from 'axios';
import { getCookie } from 'cookies-next';

async function useLogout() {
  try {
    const token = getCookie('token');
    const config = {
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await axios.get(`${process.env.hostName}/api/logout/`, config);
    return res.data;
  } catch (err: any) {
    if (Object.hasOwn(err, 'response')) {
      throw err.response.data.message;
    }
    throw err.message;
  }
}

export default useLogout;
