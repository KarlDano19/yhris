import React, { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';


import Modal from '../components/Modal';
import { BriefcaseIcon, CalendarIcon } from '@heroicons/react/24/outline';
import useGetApplicantNotifications from '../hooks/useGetApplicantNotifications';
import useMarkApplicantNotificationRead from '../hooks/useMarkApplicantNotificationRead';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsModal = ({ isOpen, onClose }: NotificationsModalProps) => {
  const { data, isLoading, fetchNextPage, hasNextPage, refetch } = useGetApplicantNotifications();

  const [tab, setTab] = useState<'all' | 'unread' | 'read'>('all');

  const notifications = useMemo(() => {
    if (!data || !data.pages) return [];
    return data.pages.flatMap((p: any) => {
      return (
        p?.data?.data?.records ||
        p?.data?.records ||
        p?.records ||
        (p?.data && p?.data?.records) ||
        []
      );
    });
  }, [data]);
  const { mutate: markAsRead } = useMarkApplicantNotificationRead();
  const router = useRouter();

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    if (notification.url_path) {
      // Notifications shown here are for the applicant (worker). Some older notifications
      // may point to the employer's "hire" page; map those to the applicant "my-jobs" page.
      let target = notification.url_path;
      try {
        if (typeof target === 'string' && target.startsWith('/business-mode/hire')) {
          target = target.replace('/business-mode/hire', '/business-mode/my-jobs');
        }
      } catch (e) {
        // fallback: use original
      }
      router.push(target);
      onClose();
    }
  };

  const handleMarkAllAsRead = () => {
    const unread = notifications.filter((n: any) => !n.is_read);
    unread.forEach((n: any) => {
      markAsRead(n.id);
    });
  };

  const getIcon = (type: string | undefined) => {
    switch (type) {
      case 'job':
        return <BriefcaseIcon className="h-5 w-5 text-white" />;
      case 'booking':
        return <CalendarIcon className="h-5 w-5 text-white" />;
      default:
        return null;
    }
  };

  const getIconBgColor = (type: string | undefined) => {
    switch (type) {
      case 'job':
        return 'bg-blue-500';
      case 'booking':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTime = (iso?: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
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
    {isLoading ? (
          <div className="py-6 text-center text-gray-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="py-6 text-center text-gray-500">No notifications</div>
        ) : (
          <>
            {/* Unread count header */}
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="text-sm text-gray-600">{notifications.filter((n: any) => !n.is_read).length} unread</div>
            </div>

            {notifications.map((notification: any) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-lg ${getIconBgColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
                  {/* use icon based on notification source */}
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-gray-900 mb-1">{notification.title}</h4>
                    {!notification.is_read && (
                      <span className="ml-2 mt-1 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                  <p className="text-xs text-gray-500">{formatTime(notification.created_at)}</p>
                </div>
              </div>
            ))}

            {/* {hasNextPage && (
              <div className="p-4 text-center">
                <button
                  onClick={() => fetchNextPage()}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  Load more
                </button>
              </div>
            )} */}

            {/* Footer: Mark all as read */}
            <div className="p-4 text-center border-t border-gray-100">
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default NotificationsModal;


