import axios from 'axios';

async function useLogout() {
  try {
    const config = {
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${localStorage.token}`,
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
