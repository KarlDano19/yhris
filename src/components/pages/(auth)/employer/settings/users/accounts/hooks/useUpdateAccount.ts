import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateAccount(account_id: number, data: any) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'PATCH',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-accounts/${account_id}/`, config);
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

function useUpdateAccount() {
  const query = useMutation((props: any) => updateAccount(props.account_id, props.data));
  return query;
}

export default useUpdateAccount;
