'use client';

import { Fragment, useState, useEffect, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import { useChat, ChatType } from '@/components/hooks/chat/useChat';
import CustomToast from '@/components/CustomToast';

// ============================================================================
// Types
// ============================================================================

interface ChatMessage {
  id: number;
  message: string;
  is_sent_by_me: boolean;
  created_at: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void; // Optional: when provided, X button goes back instead of closing everything

  // Chat type determines which hooks/API to use (defaults to applicant-applicant for backwards compatibility)
  chatType?: ChatType;

  // Person info (unified naming)
  personName?: string;
  personInitials?: string;
  personPhoto?: string | null;

  // Legacy prop names (backwards compatibility)
  recipientName?: string;
  recipientInitials?: string;
  recipientPhoto?: string | null;

  // Context identifiers
  appliedJobId?: number;     // For employer-applicant
  recipientId?: number;      // For applicant-applicant
  jobPostingId?: number;     // Optional for applicant-applicant
  jobId?: number;            // Legacy prop name for jobPostingId

  // Display
  subtitle?: string;         // Job title or context
  jobTitle?: string;         // Legacy prop name for subtitle
}

// ============================================================================
// Main Component
// ============================================================================

const ChatModal = ({
  isOpen,
  onClose,
  onBack,
  chatType = 'applicant-applicant',
  personName,
  personInitials,
  personPhoto,
  recipientName,
  recipientInitials,
  recipientPhoto,
  appliedJobId,
  recipientId,
  jobPostingId,
  jobId,
  subtitle,
  jobTitle,
}: ChatModalProps) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Resolve props with backwards compatibility
  const resolvedPersonName = personName || recipientName || '';
  const resolvedPersonInitials = personInitials || recipientInitials || '';
  const resolvedPersonPhoto = personPhoto !== undefined ? personPhoto : recipientPhoto;
  const resolvedJobPostingId = jobPostingId || jobId;
  const resolvedSubtitle = subtitle || jobTitle;

  const { chatId, messages, isLoading, isSending, sendMessage, conversationStarters } = useChat({
    chatType,
    appliedJobId,
    recipientId,
    jobPostingId: resolvedJobPostingId,
    enabled: isOpen,
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !chatId || isSending) return;

    const message = messageInput.trim();
    setMessageInput('');

    try {
      await sendMessage(message);
    } catch (error: any) {
      toast.custom(() => (
        <CustomToast message={error?.message || 'Failed to send message'} type='error' />
      ));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render message list
  const renderMessages = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading messages...</p>
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
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
          <p className="text-sm text-gray-400 mb-6">No messages yet. Start the conversation!</p>

          {/* Conversation Starters */}
          {conversationStarters.length > 0 && (
            <div className="w-full max-w-md">
              <p className="text-xs text-gray-500 text-center mb-3">Quick start templates:</p>
              <div className="space-y-2">
                {conversationStarters.map((starter, index) => (
                  <button
                    key={index}
                    onClick={() => setMessageInput(starter)}
                    className="w-full p-3 text-left text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors text-gray-700"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {messages.map((message: ChatMessage) => {
          const isSentByMe = message.is_sent_by_me;
          const timestamp = message.created_at
            ? new Date(message.created_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '';

          return (
            <div
              key={message.id}
              className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isSentByMe
                    ? 'bg-savoy-blue text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.message}</p>
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
    );
  };

  // Use onBack if provided, otherwise use onClose
  const handleClose = onBack || onClose;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[70]" onClose={handleClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        {/* Modal Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
              className="w-full max-w-2xl"
            >
              <Dialog.Panel className="w-full transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 p-5">
                  <div className="flex items-center gap-3">
                    {resolvedPersonPhoto && resolvedPersonPhoto !== '/assets/no-user.png' && resolvedPersonPhoto !== '/assets/no-photo.png' ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                        <img
                          src={resolvedPersonPhoto}
                          alt={resolvedPersonName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-savoy-blue flex items-center justify-center text-white font-semibold text-sm">
                        {resolvedPersonInitials}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{resolvedPersonName}</h3>
                      {resolvedSubtitle && <p className="text-sm text-gray-600">{resolvedSubtitle}</p>}
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Messages Area */}
                <div className="h-[500px] overflow-y-auto p-5">
                  {renderMessages()}
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 p-5">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      disabled={!chatId}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || isSending || !chatId}
                      className="p-2.5 bg-savoy-blue text-white rounded-lg hover:bg-savoy-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSending ? (
                        <svg
                          className="h-5 w-5 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        <PaperAirplaneIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ChatModal;
