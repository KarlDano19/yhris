import React, { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import Modal from '../components/Modal';
import { BriefcaseIcon, CalendarIcon, EyeIcon } from '@heroicons/react/24/outline';
 
import useGetApplicantNotifications from '../hooks/useGetApplicantNotifications';
import useMarkApplicantNotificationRead from '../hooks/useMarkApplicantNotificationRead';
import useDeleteApplicantNotification from '../hooks/useDeleteApplicantNotification';

import DeleteIconNoBorder from '@/svg/DeleteIconNoBorder';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsModal = ({ isOpen, onClose }: NotificationsModalProps) => {
  const { data, isLoading, fetchNextPage, hasNextPage, refetch, isFetchingNextPage } = useGetApplicantNotifications();

  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [removedIds, setRemovedIds] = useState<Set<number>>(new Set());
  const { mutate: deleteNotification } = useDeleteApplicantNotification();

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
    const base = tab === 'unread' ? notifications.filter((n: any) => !n.is_read) : notifications;
    // filter out locally removed notifications for optimistic UI
    return base.filter((n: any) => !removedIds.has(n.id));
  }, [notifications, tab, removedIds]);

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

  // helper to perform delete (optimistic UI)
  const handleDeleteNotification = (id: number) => {
    // optimistically remove from UI
    setRemovedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    // call backend
    deleteNotification(id);
  };

  // Notification item with swipe-to-reveal-delete behavior
  const NotificationItem = ({ notification }: { notification: any }) => {
    const [translateX, setTranslateX] = React.useState<number>(0);
    const startXRef = React.useRef<number | null>(null);
    const swipingRef = React.useRef<boolean>(false);
    const openRef = React.useRef<boolean>(false);

    const THRESHOLD = 80;
    const MAX_REVEAL = 120;
    const FULL_SWIPE = 180;
    const lastDxRef = React.useRef<number>(0);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      startXRef.current = e.clientX;
      swipingRef.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!swipingRef.current || startXRef.current === null) return;
      const dxRaw = e.clientX - startXRef.current;
      lastDxRef.current = dxRaw;
      // visually clamp transform so we don't slide completely off-screen
      if (dxRaw < 0) {
        const clamped = Math.max(dxRaw, -MAX_REVEAL);
        setTranslateX(clamped);
      } else if (openRef.current) {
        // allow closing by dragging right
        const clamped = Math.min(dxRaw - MAX_REVEAL, 0);
        setTranslateX(clamped);
      }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!swipingRef.current) return;
      swipingRef.current = false;
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

      // if user performed a full swipe past the full threshold, delete immediately
      if (lastDxRef.current <= -FULL_SWIPE) {
        handleDeleteNotification(notification.id);
        // reset values
        setTranslateX(0);
        openRef.current = false;
        startXRef.current = null;
        lastDxRef.current = 0;
        return;
      }

      if (translateX <= -THRESHOLD) {
        // open to reveal actions
        setTranslateX(-MAX_REVEAL);
        openRef.current = true;
      } else {
        // reset
        setTranslateX(0);
        openRef.current = false;
      }
      startXRef.current = null;
      lastDxRef.current = 0;
    };

    const onClickItem = () => {
      // if not swiped open, treat as click
      if (!openRef.current) handleNotificationClick(notification);
    };

    return (
      <div className="relative overflow-hidden">
        {/* Actions revealed on swipe: Mark as read (eye) + Delete */}
        <div className={`absolute right-2 top-2 bottom-2 ${notification.is_read ? 'w-20' : 'w-44'} flex items-center justify-end gap-2 pr-2`}>
          {!notification.is_read && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                markAsRead(notification.id);
              }}
              className="h-10 px-3 flex items-center justify-center bg-gray-50 text-gray-700 rounded-md shadow-sm"
            >
              <EyeIcon className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteNotification(notification.id);
            }}
            className="h-10 px-3 flex items-center justify-center bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 active:bg-red-700 transition-colors"
          >
            <span className="h-5 w-5 inline-flex text-white"><DeleteIconNoBorder/></span>
          </button>
        </div>

        <div
          role="button"
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={onClickItem}
          style={{
            transform: `translateX(${translateX}px)`,
            transition: swipingRef.current ? 'none' : 'transform 180ms ease',
          }}
          className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer bg-white"
        >
          {notification.employer_logo ? (
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
              <img src={notification.employer_logo} alt={notification.employer || ''} className="w-full h-full object-cover" />
            </div>
          ) : notification.employer ? (
            <div className="w-10 h-10 rounded-lg bg-savoy-blue flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
              {notification.employer.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()}
            </div>
          ) : notification.sender_photo ? (
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
              <img src={notification.sender_photo} alt={notification.sender_name || ''} className="w-full h-full object-cover" />
            </div>
          ) : notification.sender_name ? (
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
              {notification.sender_name.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()}
            </div>
          ) : (
            <div className={`w-10 h-10 rounded-lg ${getIconBgColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
              {getIcon(notification.type)}
            </div>
          )}
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
      </div>
    );
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

  const formatTime = (iso?: string): string => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      const now = new Date();
      const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

      if (d.toDateString() === now.toDateString()) return time;

      const startOfWeek = new Date(now);
      const day = now.getDay();
      startOfWeek.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
      startOfWeek.setHours(0, 0, 0, 0);
      if (d >= startOfWeek) {
        return `${d.toLocaleDateString('en-US', { weekday: 'long' })} ${time}`;
      }

      return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}, ${time}`;
    } catch {
      return iso;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      size="xl"
    >
      <div className="w-full max-w-[920px]">
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
              <NotificationItem key={notification.id} notification={notification} />
            ))}

            {/* Loader for infinite scroll */}
            {isFetchingNextPage && (
              <div className="py-4 text-center text-gray-500">Loading more...</div>
            )}
          </>
        )}
      </div>

      <div className="p-4 text-center">
        <div className="flex items-center justify-center gap-4">
          {notifications.some((n: any) => !n.is_read) && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          )}
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
      </div>
    </Modal>
  );
};

export default NotificationsModal;


