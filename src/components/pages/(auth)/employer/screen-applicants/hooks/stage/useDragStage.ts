import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function dragStage(data: any) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/stages/`, config);
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

function useDragStage() {
  const query = useMutation((data: any) =>
    dragStage(data)
  );

  return query;
}

export default useDragStage;
