import Modal from '../components/Modal';

import { BriefcaseIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface Notification {
  id: number;
  type: 'job' | 'booking' | 'other';
  title: string;
  description: string;
  timeAgo: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

const NotificationsModal = ({ isOpen, onClose, notifications }: NotificationsModalProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'job':
        return <BriefcaseIcon className="h-5 w-5 text-white" />;
      case 'booking':
        return <CalendarIcon className="h-5 w-5 text-white" />;
      default:
        return null;
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case 'job':
        return 'bg-blue-500';
      case 'booking':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      size="md"
    >
      <div className="space-y-0">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
          >
            <div className={`w-10 h-10 rounded-lg ${getIconBgColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 mb-1">{notification.title}</h4>
              <p className="text-sm text-gray-600 mb-1">{notification.description}</p>
              <p className="text-xs text-gray-500">{notification.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default NotificationsModal;


