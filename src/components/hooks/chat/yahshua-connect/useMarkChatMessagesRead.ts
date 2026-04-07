import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function markMessagesAsRead(chatId: number) {
  try {
    const token = getCookie('token');

    const config: any = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    };
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-chat/${chatId}/`;
    
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

function useMarkChatMessagesRead() {
  const query = useMutation((chatId: number) => markMessagesAsRead(chatId));
  return query;
}

export default useMarkChatMessagesRead;







