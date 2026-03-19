import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function sendMessage(data: { chatId: number; message: string; jobPostingId?: number }) {
  try {
    const token = getCookie('token');

    const config: any = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({
        message: data.message,
        ...(data.jobPostingId && { business_job_posting: data.jobPostingId }),
      }),
    };
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-chat/${data.chatId}/`;
    
    const res = await fetch(url, config);
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

function useSendChatMessage() {
  const query = useMutation((data: { chatId: number; message: string; jobPostingId?: number }) => sendMessage(data));
  return query;
}

export default useSendChatMessage;







