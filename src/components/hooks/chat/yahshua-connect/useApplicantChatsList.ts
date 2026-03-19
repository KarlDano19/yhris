import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface ApplicantChatListItem {
  id: number;
  other_participant_id: number;
  other_participant_name: string;
  other_participant_photo: string | null;
  business_job_posting_id: number | null;
  business_job_posting_title: string | null;
  last_message: string | null;
  last_message_at: string | null;
  last_message_sender_id: number | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

interface ApplicantChatsListResponse {
  records: ApplicantChatListItem[];
  total_records: number;
  total_pages: number;
  current_page: number;
}

async function fetchApplicantChatsList(jobPostingId?: number): Promise<ApplicantChatsListResponse> {
  const token = getCookie('token');

  const searchParams = new URLSearchParams();
  searchParams.append('current_page', '1');
  searchParams.append('page_size', '50');
  if (jobPostingId) {
    searchParams.append('business_job_posting_id', jobPostingId.toString());
  }

  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-chat/?${searchParams.toString()}`;

  const res = await fetch(url, config);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch chats.');
  }
  
  const data = await res.json();
  return {
    records: data.records || [],
    total_records: data.total_records || 0,
    total_pages: data.total_pages || 1,
    current_page: data.current_page || 1,
  };
}

export function useApplicantChatsList(jobPostingId?: number, enabled: boolean = true) {
  return useQuery<ApplicantChatsListResponse, Error>(
    ['applicantChatsList', jobPostingId],
    () => fetchApplicantChatsList(jobPostingId),
    {
      enabled,
      refetchOnWindowFocus: true,
      staleTime: 30 * 1000, // 30 seconds
      refetchInterval: 10000, // Poll every 10 seconds for new messages
    }
  );
}

export type { ApplicantChatListItem };

