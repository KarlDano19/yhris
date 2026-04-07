import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function sendMessage(data: { chatId: number; message: string; jobPostingId?: number; files?: File[] }) {
  try {
    const token = getCookie('token');
    const headers: any = {
      'Authorization': `Token ${token}`,
    };

    let body: string | FormData;

    if (data.files && data.files.length > 0) {
      const formData = new FormData();
      formData.append('message', data.message);
      if (data.jobPostingId) formData.append('business_job_posting', String(data.jobPostingId));
      data.files.forEach((file) => formData.append('files', file));
      body = formData;
    } else {
      headers['content-type'] = 'application/json';
      body = JSON.stringify({
        message: data.message,
        ...(data.jobPostingId && { business_job_posting: data.jobPostingId }),
      });
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-chat/${data.chatId}/`;

    const res = await fetch(url, { method: 'POST', headers, body });
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
  const query = useMutation((data: { chatId: number; message: string; jobPostingId?: number; files?: File[] }) => sendMessage(data));
  return query;
}

export default useSendChatMessage;
