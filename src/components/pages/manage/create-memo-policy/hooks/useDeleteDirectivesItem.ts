import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteDirective(directive_id: any) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(
      `${process.env.API_URL}/api/directives/${directive_id}/`,
      config
    );
    if (res.ok) {
      return res.json();
    }
    throw res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useDeleteDirectivesItem() {
  const query = useMutation((directive_id: any) =>
    deleteDirective(directive_id)
  );

  return query;
}

export default useDeleteDirectivesItem;
