import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function sendDirectiveEmail(directive_id: number | null) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/directives/${directive_id}/send-email/`,
      config
    );
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

function useSendDirectiveEmail() {
  const query = useMutation((directive_id: number | null) => sendDirectiveEmail(directive_id));
  return query;
}

export default useSendDirectiveEmail;

