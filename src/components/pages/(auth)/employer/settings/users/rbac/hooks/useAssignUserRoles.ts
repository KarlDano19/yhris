import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function assignUserRoles(data: any) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/roles/`, config);
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

function useAssignUserRoles() {
  const query = useMutation((data: any) => assignUserRoles(data));
  return query;
}

export default useAssignUserRoles;