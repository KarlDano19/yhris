import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deletePermission(permission_id: number) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/permissions/${permission_id}/`, config);
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

function useDeletePermission() {
  const query = useMutation((permission_id: number) => deletePermission(permission_id));
  return query;
}

export default useDeletePermission;