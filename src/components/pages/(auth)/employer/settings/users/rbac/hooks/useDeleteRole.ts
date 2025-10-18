import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteRole(role_id: number) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roles/${role_id}/`, config);
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

function useDeleteRole() {
  const query = useMutation((role_id: number) => deleteRole(role_id));
  return query;
}

export default useDeleteRole;