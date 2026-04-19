import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteChat(chatId: number) {
  const token = getCookie('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/employer-applicant-chat/${chatId}/`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete chat');
  }
}

function useDeleteEmployerApplicantChat() {
  const queryClient = useQueryClient();

  return useMutation(deleteChat, {
    onSuccess: (_data, chatId) => {
      queryClient.setQueryData(
        ['employerApplicantChatsListCache', undefined],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            records: old.records.filter((c: any) => c.id !== chatId),
          };
        }
      );
    },
  });
}

export default useDeleteEmployerApplicantChat;
