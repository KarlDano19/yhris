import Modal from '../components/Modal';
import { useApplicantChatsList, type ApplicantChatListItem } from '../hooks/chat/useApplicantChatsList';

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMessage: (chat: { id: number; name: string; initials: string; recipientId: number; photo?: string | null; jobId?: number; jobTitle?: string }) => void;
}

const MessagesModal = ({ isOpen, onClose, onSelectMessage }: MessagesModalProps) => {
  const { data, isLoading, error } = useApplicantChatsList(undefined, isOpen);

  // Generate initials from name
  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const chats = data?.records || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Messages"
      size="md"
    >
      <div className="space-y-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-gray-500">
            <div className="text-sm">Loading messages...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-red-500">
            <div className="text-sm">Failed to load messages</div>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
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
            <p className="text-sm">No messages yet</p>
          </div>
        ) : (
          chats.map((chat: ApplicantChatListItem) => {
            const initials = getInitials(chat.other_participant_name);
            const preview = chat.last_message || 'Start the conversation';
            
            return (
              <button
                key={chat.id}
                onClick={() => {
                  onSelectMessage({
                    id: chat.id,
                    name: chat.other_participant_name,
                    initials,
                    recipientId: chat.other_participant_id,
                    photo: chat.other_participant_photo || null,
                    jobId: chat.business_job_posting_id || undefined,
                    jobTitle: chat.business_job_posting_title || undefined,
                  });
                  onClose();
                }}
                className="w-full flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                {chat.other_participant_photo && chat.other_participant_photo !== '/assets/no-user.png' ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                    <img
                      src={chat.other_participant_photo}
                      alt={chat.other_participant_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-savoy-blue flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {initials}
                  </div>
                )}
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">{chat.other_participant_name}</h4>
                    {chat.unread_count > 0 && (
                      <span className="ml-2 min-w-[24px] h-6 bg-savoy-blue text-white text-xs font-semibold rounded-full flex items-center justify-center px-2 flex-shrink-0">
                        {chat.unread_count}
                      </span>
                    )}
                  </div>
                  {chat.business_job_posting_title && (
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs font-medium text-savoy-blue bg-savoy-blue/10 px-2 py-0.5 rounded">
                        Job: {chat.business_job_posting_title}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 truncate">{preview}</p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </Modal>
  );
};

export default MessagesModal;


