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
  const { data, isLoading, fetchNextPage, hasNextPage, refetch, isFetchingNextPage } = useGetApplicantNotifications();

  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const listRef = React.useRef<HTMLDivElement | null>(null);

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

  // Filtered notifications based on tab
  const filteredNotifications = useMemo(() => {
    if (tab === 'unread') return notifications.filter((n: any) => !n.is_read);
    return notifications;
  }, [notifications, tab]);

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    // Prefer explicit references (ids) when available, fallback to url_path
    const refs = notification.references || {};
    let target: string | undefined;

    if (refs.job_posting_id) {
      // regular job posting (yahshua connect)
      target = `/personal-mode/jobs?job_id=${refs.job_posting_id}`;
    } else if (refs.business_job_id) {
      // business-mode (gig) notifications:

      if (refs.application_id) {
        target = `/business-mode/my-jobs?application_id=${refs.application_id}`;
      } else {
        // Check if this is a daily progress review notification (title contains "Daily Progress Reviewed")
        if (notification.title === 'Daily Progress Reviewed') {
          target = `/business-mode/my-jobs?job_id=${refs.business_job_id}&open=view_progress`;
        } else {
          target = `/business-mode/hire?job_id=${refs.business_job_id}`;
        }
      }
    } else if (typeof notification.url_path === 'string') {
      // Notifications shown here are for the applicant (worker). Some older notifications
      target = notification.url_path;
      try {
        if (typeof target === 'string') {
          // Handle daily progress review notifications - convert business_job_id to job_id and add open param
          if (notification.title === 'Daily Progress Reviewed') {
            // Parse URL to extract business_job_id parameter
            const url = new URL(target, window.location.origin);
            const businessJobId = url.searchParams.get('business_job_id');
            if (businessJobId) {
              target = `/business-mode/my-jobs?job_id=${businessJobId}&open=view_progress`;
            }
          } else if (target.startsWith('/business-mode/hire')) {
            target = target.replace('/business-mode/hire', '/business-mode/my-jobs');
          }
        }
      } catch (e) {
        // fallback: use original
      }
    }

    if (target) {
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

  // Infinite scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const threshold = 200; // px from bottom
    if (target.scrollHeight - target.scrollTop - target.clientHeight < threshold) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
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
      size="lg"
    >
      {/* Tabs + Unread count header */}
      <div className="px-4 mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${tab === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-600'}`}
          >
            All
          </button>
          <button
            onClick={() => setTab('unread')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${tab === 'unread' ? 'bg-gray-100 text-gray-900' : 'text-gray-600'}`}
          >
            Unread
          </button>
        </div>
        <div className="text-sm text-gray-600">{notifications.filter((n: any) => !n.is_read).length} unread</div>
      </div>

      {/* Scrollable content area with infinite scroll */}
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="space-y-0 max-h-[70vh] overflow-y-auto pr-2"
      >
        {isLoading ? (
          <div className="py-6 text-center text-gray-500">Loading notifications...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-6 text-center text-gray-500">No notifications</div>
        ) : (
          <>
            {filteredNotifications.map((notification: any) => (
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
                    <h4 className="font-semibold text-gray-900 mb-1 break-words">{notification.title}</h4>
                    {!notification.is_read && (
                      <span className="ml-2 mt-1 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1 break-words">{notification.message}</p>
                  <p className="text-xs text-gray-500">{formatTime(notification.created_at)}</p>
                </div>
              </div>
            ))}

            {/* Loader for infinite scroll */}
            {isFetchingNextPage && (
              <div className="py-4 text-center text-gray-500">Loading more...</div>
            )}
          </>
        )}
      </div>

      <div className="p-4 text-center border-t border-gray-100">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </button>
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              {isFetchingNextPage ? 'Loading...' : 'Load more'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default NotificationsModal;


