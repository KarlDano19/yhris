import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface SendMessageInput {
  chatId: number;
  message: string;
}

async function sendChatMessage({ chatId, message }: SendMessageInput) {
  const token = getCookie('token');
  const config: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ message }),
  };

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/employer-applicant-chat/${chatId}/messages/`;
  const res = await fetch(url, config);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to send message');
  }

  return res.json();
}

function useSendEmployerApplicantMessage() {
  const queryClient = useQueryClient();

  return useMutation(sendChatMessage, {
    onSuccess: (data, variables) => {
      // Invalidate messages cache to refetch messages
      queryClient.invalidateQueries(['employerApplicantChatMessagesCache', variables.chatId]);
      // Invalidate chat list cache to update last message
      queryClient.invalidateQueries(['employerApplicantChatsListCache']);
    },
  });
}

export default useSendEmployerApplicantMessage;
