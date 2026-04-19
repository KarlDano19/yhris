'use client';

import { Fragment, useState, useEffect, useRef } from 'react';


import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PaperAirplaneIcon, ArrowTopRightOnSquareIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import { useChat, ChatType } from '@/components/hooks/chat/useChat';
import CustomToast from '@/components/CustomToast';

// ============================================================================
// Helpers
// ============================================================================

function formatRelativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)}w ago`;
  return `${Math.floor(diff / 2592000)}mo ago`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileTypeInfo(filename: string): { label: string; className: string } {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'pdf') return { label: 'PDF', className: 'bg-red-100 text-red-700' };
  if (ext === 'doc' || ext === 'docx') return { label: 'DOC', className: 'bg-blue-100 text-blue-700' };
  if (ext === 'xls' || ext === 'xlsx') return { label: 'XLS', className: 'bg-green-100 text-green-700' };
  if (['png', 'jpg', 'jpeg'].includes(ext)) return { label: 'IMG', className: 'bg-purple-100 text-purple-700' };
  return { label: ext.toUpperCase() || 'FILE', className: 'bg-gray-100 text-gray-600' };
}

function formatFullDateTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

  // Today
  if (d.toDateString() === now.toDateString()) return time;

  // This week (Monday → today)
  const startOfWeek = new Date(now);
  const day = now.getDay(); // 0=Sun
  startOfWeek.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  startOfWeek.setHours(0, 0, 0, 0);
  if (d >= startOfWeek) {
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    return `${dayName} ${time}`;
  }

  // Older
  const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return `${dateStr}, ${time}`;
}

// ============================================================================
// Types
// ============================================================================

interface ChatAttachment {
  id: number;
  file_name: string;
  file_size: number;
  file_type: string;
  url: string;
}

interface ChatMessage {
  id: number;
  message: string;
  is_sent_by_me: boolean;
  created_at: string;
  attachments?: ChatAttachment[];
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

const ChatMessagesModal = ({
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
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_TYPES = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg';
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) => f.size <= MAX_FILE_SIZE);
    const oversized = files.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      toast.custom(() => <CustomToast message="Some files exceed 10 MB and were removed." type="error" />);
    }
    setPendingFiles((prev) => [...prev, ...valid]);
    e.target.value = '';
  };

  const handleSendMessage = async () => {
    if ((!messageInput.trim() && pendingFiles.length === 0) || !chatId || isSending) return;

    const message = messageInput.trim();
    const files = [...pendingFiles];
    setMessageInput('');
    setPendingFiles([]);

    try {
      await sendMessage(message, files.length > 0 ? files : undefined);
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
        {messages.map((message: ChatMessage, index: number) => {
          const isLast = index === messages.length - 1;
          const isSentByMe = message.is_sent_by_me;
          const relativeTime = message.created_at ? formatRelativeTime(message.created_at) : '';
          const fullDateTime = message.created_at ? formatFullDateTime(message.created_at) : '';

          return (
            <div
              key={message.id}
              className={`group relative flex items-end gap-1 ${isSentByMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className="relative max-w-[70%]">
                {/* Floating datetime tooltip — appears below on hover */}
                <span
                  className={`pointer-events-none absolute top-full mt-1 whitespace-nowrap text-xs text-gray-600 bg-white border border-gray-200 rounded-md px-2 py-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 ${
                    isSentByMe ? 'right-0' : 'left-0'
                  }`}
                >
                  {fullDateTime}
                </span>

                <div
                  className={`rounded-lg p-3 ${
                    isSentByMe ? 'bg-savoy-blue text-white' : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {message.attachments.map((att) => {
                        const { label, className: badgeClass } = getFileTypeInfo(att.file_name);
                        return (
                          <a
                            key={att.id}
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 rounded-md px-2 py-1.5 no-underline transition-colors ${
                              isSentByMe
                                ? 'bg-white/15 hover:bg-white/25'
                                : 'bg-gray-200/70 hover:bg-gray-200'
                            }`}
                          >
                            <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${badgeClass}`}>
                              {label}
                            </span>
                            <div className="flex flex-col min-w-0">
                              <span className={`text-xs font-medium truncate max-w-[160px] leading-tight ${isSentByMe ? 'text-white' : 'text-gray-800'}`}>
                                {att.file_name}
                              </span>
                              <span className={`text-[10px] leading-tight ${isSentByMe ? 'text-white/60' : 'text-gray-400'}`}>
                                {formatFileSize(att.file_size)}
                              </span>
                            </div>
                            <PaperClipIcon className={`h-3 w-3 shrink-0 ml-auto ${isSentByMe ? 'text-white/70' : 'text-gray-400'}`} />
                          </a>
                        );
                      })}
                    </div>
                  )}
                  {isLast && (
                    <p className={`text-xs mt-1 ${isSentByMe ? 'text-white/70' : 'text-gray-500'}`}>
                      {relativeTime}
                    </p>
                  )}
                </div>
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
          <div className="flex min-h-full items-start justify-center p-4 pt-16">
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
                      {resolvedSubtitle && (
                        <div className="flex items-center gap-1">
                          <p className="text-sm text-gray-600">{resolvedSubtitle}</p>
                          {chatType === 'employer-applicant' && resolvedJobPostingId && (
                            <Link
                              href={`/screen-applicants/${resolvedJobPostingId}`}
                              title="View applicants for this job"
                              className="text-gray-400 hover:text-savoy-blue transition-colors"
                            >
                              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                            </Link>
                          )}
                        </div>
                      )}
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
                  {/* File chips */}
                  {pendingFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {pendingFiles.map((file, i) => {
                        const { label, className: badgeClass } = getFileTypeInfo(file.name);
                        return (
                          <div
                            key={i}
                            className="group flex items-center gap-2 bg-white border border-gray-200 rounded-lg pl-2 pr-1.5 py-1.5 shadow-sm hover:border-gray-300 transition-colors max-w-[220px]"
                          >
                            <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${badgeClass}`}>
                              {label}
                            </span>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-medium text-gray-800 truncate leading-tight">{file.name}</span>
                              <span className="text-[10px] text-gray-400 leading-tight">{formatFileSize(file.size)}</span>
                            </div>
                            <button
                              onClick={() => setPendingFiles((prev) => prev.filter((_, idx) => idx !== i))}
                              className="shrink-0 ml-0.5 rounded-full p-0.5 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <XMarkIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ACCEPTED_TYPES}
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    {/* Paperclip button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 text-gray-400 hover:text-savoy-blue transition-colors flex-shrink-0"
                    >
                      <PaperClipIcon className="h-5 w-5" />
                    </button>
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
                      disabled={(!messageInput.trim() && pendingFiles.length === 0) || isSending || !chatId}
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

export default ChatMessagesModal;
