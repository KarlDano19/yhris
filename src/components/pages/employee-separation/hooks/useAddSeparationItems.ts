import { T_Separation } from '@/types/globals';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

async function addSeparation(
  separation: T_Separation,
) {
  try {
    debugger;
    // const data = {
    //   email: user.email,
    //   password: user.password,
    //   confirm_password: user.confirmPassword,
    //   account_type: user.accountType.toLowerCase(),
    // };
    // const config = {
    //   headers: {
    //     'content-type': 'application/json',
    //     'Authorization': `Token ${localStorage.token}`,
    //   },
    // };
    // const res = await axios.post(
    //   `${process.env.hostName}/api/separations/`,
    //   data,
    //   config
    // );
    // return res.data;
  } catch (err: any) {
    if (Object.hasOwn(err, 'response')) {
      throw err.response.data.message;
    }
    throw err.message;
  }
}

function useAddSeparationItems() {

  const query = useMutation(
    (separation: T_Separation) =>
    addSeparation(separation),
  );

  return query;
}

export default useAddSeparationItems;
