import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteSeparation(separation_id: number | null) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/separation/${separation_id}/`, config);
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

function useDeleteSeparation() {
  const query = useMutation((separation_id: number | null) => deleteSeparation(separation_id));
  return query;
}

export default useDeleteSeparation;
