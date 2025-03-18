import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addAccounts(accounts: any, employer_id: string) {
  try {
    const accountType = 'employer';
    const loginType = 'password';
    const data = {
      name: accounts.name,
      account_type: accountType,
      email: accounts.email,
      password: accounts.password,
      confirm_password: accounts.confirm_password,
      login_type: loginType,
      employer_id: employer_id,
    };
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-accounts/create/`, config);
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useAddAccounts() {
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);
  const cachedData: any = cachedProfile?.state?.data;
  const employer_id = cachedData?.id;

  const query = useMutation((accounts: any) => addAccounts(accounts, employer_id));
  return query;
}

export default useAddAccounts;
