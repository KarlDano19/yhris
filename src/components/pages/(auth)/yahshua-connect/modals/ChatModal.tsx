import { useState, useEffect, useRef } from 'react';

import Modal from '../components/Modal';

import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useGetApplicantChat } from '../hooks/chat/useGetApplicantChat';
import { useGetChatMessages } from '../hooks/chat/useGetChatMessages';
import useSendChatMessage from '../hooks/chat/useSendChatMessage';
import useMarkChatMessagesRead from '../hooks/chat/useMarkChatMessagesRead';
import toast from 'react-hot-toast';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId?: number;
  recipientName: string;
  recipientInitials: string;
  recipientPhoto?: string | null;
  jobId?: number;
  jobTitle?: string;
}

const ChatModal = ({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  recipientInitials,
  recipientPhoto,
  jobId,
  jobTitle,
}: ChatModalProps) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get or create chat
  const { data: chatData, isLoading: isChatLoading } = useGetApplicantChat(
    recipientId,
    jobId,
    isOpen && !!recipientId
  );

  // Get job ID from chatData if not provided as prop
  const effectiveJobId = jobId || chatData?.business_job_posting_id;
  
  // Get messages
  const { data: messagesData, isLoading: isMessagesLoading } = useGetChatMessages(
    chatData?.id,
    effectiveJobId,
    isOpen && !!chatData?.id
  );

  // Send message mutation
  const sendMessageMutation = useSendChatMessage();

  // Mark messages as read
  const markReadMutation = useMarkChatMessagesRead();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData?.records]);

  // Mark messages as read when modal opens
  useEffect(() => {
    if (isOpen && chatData?.id) {
      markReadMutation.mutate(chatData.id);
    }
  }, [isOpen, chatData?.id]);

  const messages = messagesData?.records || [];
  
  // Get job title from chatData if not provided as prop
  const displayJobTitle = jobTitle || chatData?.business_job_posting?.job_title;
  const displayJobId = jobId || chatData?.business_job_posting_id;

  const handleSend = async () => {
    if (messageInput.trim() && chatData?.id) {
      try {
        await sendMessageMutation.mutateAsync({
          chatId: chatData.id,
          message: messageInput.trim(),
          jobPostingId: effectiveJobId,
        });
        setMessageInput('');
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      } catch (error: any) {
        toast.error(error?.message || 'Failed to send message');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Chat with ${recipientName}`}
      size="lg"
      headerContent={
        recipientPhoto && recipientPhoto !== '/assets/no-user.png' ? (
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0 mr-3">
            <img
              src={recipientPhoto}
              alt={recipientName}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-savoy-blue flex items-center justify-center text-white font-semibold text-sm mr-3">
            {recipientInitials}
          </div>
        )
      }
    >
      <div className="flex flex-col h-[500px]">
        {/* Job Title (if provided) */}
        {displayJobTitle && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            <p className="text-sm text-gray-600">Job: <span className="font-semibold text-gray-900">{displayJobTitle}</span></p>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4">
          {(isChatLoading || isMessagesLoading) ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-sm">Loading messages...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-sm">Start the conversation</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg: any) => {
                const isSentByMe = msg.is_sent_by_me;
                const timestamp = msg.created_at
                  ? new Date(msg.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '';

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        isSentByMe
                          ? 'bg-savoy-blue text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isSentByMe ? 'text-white/70' : 'text-gray-500'
                        }`}
                      >
                        {timestamp}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-2 border-t border-gray-200 pt-4">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!messageInput.trim() || sendMessageMutation.isLoading || !chatData?.id}
            className="p-2.5 bg-savoy-blue text-white rounded-lg hover:bg-savoy-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChatModal;

