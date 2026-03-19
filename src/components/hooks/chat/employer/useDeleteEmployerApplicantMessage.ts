import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface DeleteMessageInput {
  chatId: number;
  messageId: number;
}

async function deleteMessage({ chatId, messageId }: DeleteMessageInput) {
  const token = getCookie('token');
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/employer-applicant-chat/${chatId}/?message_id=${messageId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete message');
  }
}

function useDeleteEmployerApplicantMessage() {
  const queryClient = useQueryClient();

  return useMutation(deleteMessage, {
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(
        ['employerApplicantChatMessagesCache', variables.chatId],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            records: old.records.filter((m: any) => m.id !== variables.messageId),
          };
        }
      );
    },
  });
}

export default useDeleteEmployerApplicantMessage;
