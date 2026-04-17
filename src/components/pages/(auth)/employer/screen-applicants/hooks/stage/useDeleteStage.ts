import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteStage(data: any) {
  try {
    const stage_id = data.stage_id;
    delete data.stage_id;
    const token = getCookie('token');
    const config = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/stages/${stage_id}/`, config);
    if (!res.ok) {
      throw res.json();
    }
    return {};
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useDeleteStage() {
  const query = useMutation((data: any) =>
    deleteStage(data)
  );

  return query;
}

export default useDeleteStage;
