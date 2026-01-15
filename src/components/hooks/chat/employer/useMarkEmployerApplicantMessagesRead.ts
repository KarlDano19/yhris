import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function markMessagesRead(chatId: number) {
  const token = getCookie('token');
  const config: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/employer-applicant-chat/${chatId}/messages/mark-read/`;
  const res = await fetch(url, config);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to mark messages as read');
  }

  return res.json();
}

function useMarkEmployerApplicantMessagesRead() {
  const queryClient = useQueryClient();

  return useMutation(markMessagesRead, {
    onSuccess: (data, chatId) => {
      // Invalidate messages cache to update read status
      queryClient.invalidateQueries(['employerApplicantChatMessagesCache', chatId]);
      // Invalidate chat cache to update unread count
      queryClient.invalidateQueries(['employerApplicantChatCache', chatId]);
      // Invalidate chat list cache to update unread counts
      queryClient.invalidateQueries(['employerApplicantChatsListCache']);
    },
  });
}

export default useMarkEmployerApplicantMessagesRead;
