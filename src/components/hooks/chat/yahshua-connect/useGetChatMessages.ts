import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getChatMessages(chatId: number, jobPostingId?: number) {
  try {
    const token = getCookie('token');

    const config: any = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    };
    
    const searchParams = new URLSearchParams();
    if (jobPostingId) {
      searchParams.append('business_job_posting_id', jobPostingId.toString());
    }
    
    const queryString = searchParams.toString();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-chat/${chatId}/${queryString ? `?${queryString}` : ''}`;
    
    const res = await fetch(url, config);
    if (!res.ok) {
      const error = await res.json();
      throw error;
    }
    
    const responseData = await res.json();
    return responseData.data || responseData;
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message || errStringify;
  }
}

export function useGetChatMessages(chatId?: number, jobPostingId?: number, enabled: boolean = true) {
  return useQuery(
    ['chatMessagesCache', chatId, jobPostingId],
    () => getChatMessages(chatId!, jobPostingId),
    {
      refetchOnWindowFocus: false,
      enabled: enabled && !!chatId,
      refetchInterval: 5000, // Poll every 5 seconds for new messages
    }
  );
}







