import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export interface EmployerApplicantChatListItem {
  id: number;
  applied_job_id: number;
  job_title: string;
  other_participant_id: number;
  other_participant_name: string;
  other_participant_photo: string | null;
  last_message: string | null;
  last_message_at: string | null;
  last_message_sender_type: string | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

interface ChatListResponse {
  records: EmployerApplicantChatListItem[];
  total_records: number;
  total_pages: number;
}

async function getChatsList(jobPostingId?: number): Promise<ChatListResponse> {
  const token = getCookie('token');

  if (!token) {
    return { records: [], total_records: 0, total_pages: 0 };
  }

  try {
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/employer-applicant-chats/`;
    if (jobPostingId) {
      url += `?job_posting_id=${jobPostingId}`;
    }

    const res = await fetch(url, config);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch chats');
    }

    const responseData = await res.json();
    return responseData.data || responseData;
  } catch (error: any) {
    let errStringify = await error;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.detail;
    }
    if (Object.hasOwn(errStringify, 'detail')) {
      throw errStringify;
    }
    throw errStringify.message || errStringify;
  }
}

export function useGetEmployerApplicantChatsList(jobPostingId?: number, enabled: boolean = true) {
  return useQuery<ChatListResponse, Error>(
    ['employerApplicantChatsListCache', jobPostingId],
    () => getChatsList(jobPostingId),
    {
      enabled,
      refetchInterval: 10000, // Poll every 10 seconds
      refetchOnWindowFocus: true,
      keepPreviousData: false,
      staleTime: 0,
    }
  );
}

export default useGetEmployerApplicantChatsList;
