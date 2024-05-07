import { useMutation } from '@tanstack/react-query';

async function sendLink(data: any) {
  try {
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        host: `${window.location.hostname}:${location.port}`,
      }),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forgot-password/`, config);
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

function useSendLink() {
  const query = useMutation((data: any) => sendLink(data));

  return query;
}

export default useSendLink;
