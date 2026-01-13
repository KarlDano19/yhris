import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getChatMessages(chatId?: number) {
  if (!chatId) return { records: [], total_records: 0 };

  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    if (token) {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/employer-applicant-chat/${chatId}/messages/`;
      const res = await fetch(url, config);

      if (!res.ok) {
        throw res.json();
      }

      const responseData = await res.json();
      return responseData.data || responseData;
    }
    return { records: [], total_records: 0 };
  } catch (error: any) {
    let errStringify = await error;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.detail;
    }
    if (Object.hasOwn(errStringify, 'detail')) {
      throw errStringify;
    }
    throw errStringify.message;
  }
}

function useGetEmployerApplicantChatMessages(chatId?: number, enabled: boolean = true) {
  const query = useQuery(
    ['employerApplicantChatMessagesCache', chatId],
    () => getChatMessages(chatId),
    {
      enabled: enabled && !!chatId,
      refetchInterval: 5000, // Poll every 5 seconds
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetEmployerApplicantChatMessages;
