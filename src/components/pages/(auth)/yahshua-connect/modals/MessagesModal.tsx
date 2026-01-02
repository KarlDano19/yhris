'use client';

import Modal from '../components/Modal';

interface Message {
  id: number;
  senderName: string;
  senderInitials: string;
  preview: string;
  unreadCount: number;
}

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSelectMessage: (message: Message) => void;
}

const MessagesModal = ({ isOpen, onClose, messages, onSelectMessage }: MessagesModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Messages"
      size="md"
    >
      <div className="space-y-0">
        {messages.map((message, index) => (
          <button
            key={message.id}
            onClick={() => {
              onSelectMessage(message);
              onClose();
            }}
            className="w-full flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
          >
            <div className="w-12 h-12 rounded-full bg-savoy-blue flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {message.senderInitials}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-900 truncate">{message.senderName}</h4>
                {message.unreadCount > 0 && (
                  <span className="ml-2 min-w-[24px] h-6 bg-savoy-blue text-white text-xs font-semibold rounded-full flex items-center justify-center px-2 flex-shrink-0">
                    {message.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 truncate">{message.preview}</p>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
};

export default MessagesModal;


