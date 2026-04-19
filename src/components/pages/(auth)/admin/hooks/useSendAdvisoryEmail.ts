import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function sendAdvisoryEmail(payload: any) {
  try {
    const token = getCookie('token');
    const body = {
      to: payload.email,
      cc: payload.cc ?? [],
      bcc: payload.bcc ?? [],
      subject: payload.subject,
      context: payload.message,
    };
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(body),
    };
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/advisory/send-email/`, config);
      if (!res.ok) throw res.json();
      return res.json();
    }
    return {};
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) throw errStringify.response.data.message;
    throw errStringify.message;
  }
}

function useSendAdvisoryEmail() {
  return useMutation((payload: any) => sendAdvisoryEmail(payload));
}

export default useSendAdvisoryEmail;
