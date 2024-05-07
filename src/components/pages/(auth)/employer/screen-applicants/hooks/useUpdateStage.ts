import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateStage(data: any) {
  try {
    const stage_id = data.stage_id;
    delete data.stage_id;
    const token = getCookie('token');
    const config = {
      method: 'PUT',
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
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useUpdateStage() {
  const query = useMutation((data: any) =>
    updateStage(data)
  );

  return query;
}

export default useUpdateStage;
