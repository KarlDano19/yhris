import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Employer-Applicant chat hooks (HRIS)
import useGetEmployerApplicantChat from './employer/useGetEmployerApplicantChat';
import useGetEmployerApplicantChatMessages from './employer/useGetEmployerApplicantChatMessages';
import useSendEmployerApplicantMessage from './employer/useSendEmployerApplicantMessage';
import useMarkEmployerApplicantMessagesRead from './employer/useMarkEmployerApplicantMessagesRead';

// Applicant-Applicant chat hooks (Yahshua Connect)
import { useGetApplicantChat } from '@/components/hooks/chat/yahshua-connect/useGetApplicantChat';
import { useGetChatMessages } from '@/components/hooks/chat/yahshua-connect/useGetChatMessages';
import useSendChatMessage from '@/components/hooks/chat/yahshua-connect/useSendChatMessage';
import useMarkChatMessagesRead from '@/components/hooks/chat/yahshua-connect/useMarkChatMessagesRead';

export type ChatType = 'employer-applicant' | 'applicant-applicant';

interface UseChatParams {
  chatType: ChatType;
  appliedJobId?: number;
  recipientId?: number;
  jobPostingId?: number;
  enabled: boolean;
}

interface UseChatReturn {
  chatId: number | undefined;
  messages: any[];
  isLoading: boolean;
  isSending: boolean;
  sendMessage: (message: string, files?: File[]) => Promise<void>;
  markAsRead: () => void;
  conversationStarters: string[];
}

export function useChat({
  chatType,
  appliedJobId,
  recipientId,
  jobPostingId,
  enabled,
}: UseChatParams): UseChatReturn {
  const queryClient = useQueryClient();

  // Employer-Applicant hooks
  const employerApplicantChat = useGetEmployerApplicantChat(
    appliedJobId,
    chatType === 'employer-applicant' && enabled
  );
  const employerApplicantMessages = useGetEmployerApplicantChatMessages(
    employerApplicantChat.data?.id,
    chatType === 'employer-applicant' && enabled && !!employerApplicantChat.data?.id
  );
  const sendEmployerApplicantMessage = useSendEmployerApplicantMessage();
  const markEmployerApplicantRead = useMarkEmployerApplicantMessagesRead();

  // Applicant-Applicant hooks
  const applicantChat = useGetApplicantChat(
    recipientId,
    jobPostingId,
    chatType === 'applicant-applicant' && enabled && !!recipientId
  );
  const applicantMessages = useGetChatMessages(
    applicantChat.data?.id,
    jobPostingId || applicantChat.data?.business_job_posting_id,
    chatType === 'applicant-applicant' && enabled && !!applicantChat.data?.id
  );
  const sendApplicantMessage = useSendChatMessage();
  const markApplicantRead = useMarkChatMessagesRead();

  // Get appropriate values based on chat type
  const chatId =
    chatType === 'employer-applicant'
      ? employerApplicantChat.data?.id
      : applicantChat.data?.id;

  const messages =
    chatType === 'employer-applicant'
      ? employerApplicantMessages.data?.records || []
      : applicantMessages.data?.records || [];

  const isLoading =
    chatType === 'employer-applicant'
      ? employerApplicantChat.isLoading || employerApplicantMessages.isLoading
      : applicantChat.isLoading || applicantMessages.isLoading;

  const isSending =
    chatType === 'employer-applicant'
      ? sendEmployerApplicantMessage.isLoading
      : sendApplicantMessage.isLoading;

  const conversationStarters =
    chatType === 'employer-applicant'
      ? employerApplicantChat.data?.conversation_starters || []
      : applicantChat.data?.conversation_starters || [];

  // Mark as read when chatId becomes available
  useEffect(() => {
    if (enabled && chatId) {
      const timer = setTimeout(async () => {
        try {
          if (chatType === 'employer-applicant') {
            await markEmployerApplicantRead.mutateAsync(chatId);
          } else {
            await markApplicantRead.mutateAsync(chatId);
          }
          // Invalidate chat lists to update unread counts
          queryClient.invalidateQueries(['employerApplicantChatsListCache']);
          queryClient.invalidateQueries(['applicantEmployerChatsListCache']);
          queryClient.invalidateQueries(['applicantChatsListCache']);
        } catch (error) {
          console.error('Failed to mark messages as read:', error);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [enabled, chatId, chatType]);

  const sendMessage = async (message: string, files?: File[]) => {
    if (!chatId || (!message.trim() && (!files || files.length === 0))) return;

    if (chatType === 'employer-applicant') {
      await sendEmployerApplicantMessage.mutateAsync({
        chatId,
        message: message.trim(),
        files,
      });
    } else {
      await sendApplicantMessage.mutateAsync({
        chatId,
        message: message.trim(),
        jobPostingId: jobPostingId || applicantChat.data?.business_job_posting_id,
        files,
      });
    }
  };

  const markAsRead = () => {
    if (!chatId) return;

    if (chatType === 'employer-applicant') {
      markEmployerApplicantRead.mutate(chatId);
    } else {
      markApplicantRead.mutate(chatId);
    }
  };

  return {
    chatId,
    messages,
    isLoading,
    isSending,
    sendMessage,
    markAsRead,
    conversationStarters,
  };
}

export default useChat;
