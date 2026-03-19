import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface SendMessageInput {
  chatId: number;
  message: string;
  files?: File[];
}

async function sendChatMessage({ chatId, message, files }: SendMessageInput) {
  const token = getCookie('token');
  const headers: Record<string, string> = {
    Authorization: `Token ${token}`,
  };

  let body: string | FormData;

  if (files && files.length > 0) {
    const formData = new FormData();
    formData.append('message', message);
    files.forEach((file) => formData.append('files', file));
    body = formData;
  } else {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify({ message });
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/employer-applicant-chat/${chatId}/`;
  const res = await fetch(url, { method: 'POST', headers, body });

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
      queryClient.invalidateQueries(['employerApplicantChatMessagesCache', variables.chatId]);
      queryClient.invalidateQueries(['employerApplicantChatsListCache']);
    },
  });
}

export default useSendEmployerApplicantMessage;
