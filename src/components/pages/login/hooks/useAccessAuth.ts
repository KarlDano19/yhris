import { T_Login } from '@/types/globals';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

async function login(credentials: T_Login) {
  try {
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    };
    const res = await axios.post(
      `${process.env.hostName}/api/login/`,
      credentials,
      config
    );
    return res.data;
  } catch (err: any) {
    if (Object.hasOwn(err, "response")) {
      throw err.response.data.message;
    }
    console.log(`Reason's: ${err.message}`);
    throw 'Something went wrong, Please contact the administrator.';
  }
}

function useAccessAuth() {
  const query = useMutation((credentials: T_Login) => login(credentials));
  return query;
}

export default useAccessAuth;
