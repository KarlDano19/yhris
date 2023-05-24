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
    throw err.message;
  }
}

function useLogin() {
  const query = useMutation((credentials: T_Login) => login(credentials));
  return query;
}

export default useLogin;
