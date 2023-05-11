import { T_Register } from '@/types/globals';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

async function register(user: T_Register) {
  try {
    const data = {
      email: user.email,
      password: user.password,
      confirm_password: user.confirmPassword,
      account_type: user.accountType.toLowerCase(),
    }
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    };
    const res = await axios.post(
      `${process.env.hostName}/api/register/`,
      data,
      config
    );
    return res.data;
  } catch (err: any) {
    if (Object.hasOwn(err, 'response')) {
      throw err.response.data.message;
    }
    console.log(`Reason's: ${err.message}`);
    throw 'Something went wrong, Please contact the administrator.';
  }
}

function useRegisterAccount() {
  const query = useMutation((user: T_Register) => register(user));
  return query;
}

export default useRegisterAccount;
