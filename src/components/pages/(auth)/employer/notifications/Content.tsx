'use client';

import React, { useState, useMemo } from 'react';

import { useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/LoadingSpinner';
import BackButton from '@/components/BackButton';
import useGetNotification from '@/components/hooks/useGetNotification';
import useMarkNotificationRead from '@/components/hooks/useMarkNotificationRead';
import { useDeleteNotification, useDeleteAllReadNotifications } from '@/components/hooks/useDeleteNotification';

import classNames from '@/helpers/classNames';

import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

type TabType = 'all' | 'unread';

const Content = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [pageSize] = useState(10);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    refetch 
  } = useGetNotification({ page_size: pageSize, tab: activeTab });
  
  const { mutate: markAsRead } = useMarkNotificationRead();
  const { mutate: deleteNotification, isLoading: isDeleting } = useDeleteNotification();
  const { mutate: deleteAllRead, isLoading: isDeletingAll } = useDeleteAllReadNotifications();

  // Flatten all pages into a single array
  const notifications = useMemo(() => {
    return data?.pages.flatMap(page => page?.records || []) || [];
  }, [data]);
  
  // Get counts from the first page
  const totalRecords = data?.pages[0]?.total_records || 0;
  const unreadCount = data?.pages[0]?.unread_count || 
    notifications.filter((n: any) => !n.is_read).length;
  
  // Count of read notifications
  const readCount = notifications.filter((n: any) => n.is_read).length;

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    if (notification.url_path) {
      router.push(notification.url_path);
    }
  };

  const handleMarkAllAsRead = () => {
    const unreadNotifications = notifications.filter((n: any) => !n.is_read);
    unreadNotifications.forEach((notification: any) => {
      markAsRead(notification.id);
    });
  };

  const handleDeleteNotification = (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    setShowDeleteConfirm(notificationId);
  };

  const confirmDelete = (notificationId: number) => {
    deleteNotification(notificationId, {
      onSuccess: () => {
        setShowDeleteConfirm(null);
      },
    });
  };

  const handleDeleteAllRead = () => {
    setShowBulkDeleteConfirm(true);
  };

  const confirmDeleteAllRead = () => {
    deleteAllRead(undefined, {
      onSuccess: () => {
        setShowBulkDeleteConfirm(false);
      },
    });
  };

  const tabs: { key: TabType; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: totalRecords },
    { key: 'unread', label: 'Unread', count: unreadCount },
  ];

  const renderNotificationItem = (notification: any) => {
    const isConfirmingDelete = showDeleteConfirm === notification.id;

    return (
      <div
        key={notification.id}
        onClick={() => !isConfirmingDelete && handleNotificationClick(notification)}
        className={classNames(
          'flex items-start gap-4 px-6 py-4 border-b border-gray-100 cursor-pointer transition-colors relative',
          'hover:bg-gray-50',
          !notification.is_read ? 'bg-blue-50/50' : 'bg-white',
          isConfirmingDelete ? 'bg-red-50' : ''
        )}
      >
        {/* Content */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1'>
              <p className={classNames(
                'text-sm',
                !notification.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
              )}>
                {notification.title}
              </p>
              <p className='text-sm text-gray-600 mt-1'>
                {notification.message}
              </p>
              {notification.action_url && (
                <p className='text-sm text-orange-500 mt-2 hover:underline'>
                  {notification.action_label || 'View Details'}
                </p>
              )}
            </div>
            <div className='flex items-center gap-2 flex-shrink-0'>
              <span className={classNames(
                'text-xs',
                !notification.is_read ? 'text-blue-600 font-medium' : 'text-gray-400'
              )}>
                {formatTimeAgo(notification.created_at)}
              </span>
              {!notification.is_read && (
                <span className='h-2 w-2 rounded-full bg-blue-500 flex-shrink-0' />
              )}
              {/* Delete button */}
              {!isConfirmingDelete && (
                <button
                  onClick={(e) => handleDeleteNotification(e, notification.id)}
                  className='p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors'
                  title='Delete notification'
                >
                  <TrashIcon className='h-4 w-4' />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Delete confirmation overlay */}
        {isConfirmingDelete && (
          <div 
            className='absolute inset-0 bg-red-50 flex items-center justify-between px-6'
            onClick={(e) => e.stopPropagation()}
          >
            <span className='text-sm text-red-700'>Delete this notification?</span>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className='px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(notification.id)}
                disabled={isDeleting}
                className='px-3 py-1.5 text-sm bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors disabled:opacity-50'
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='py-20'>
          <LoadingSpinner size='lg' color='yellow' />
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className='py-20 text-center'>
          <p className='text-gray-400 text-sm'>No notifications found.</p>
        </div>
      );
    }

    return (
      <div className='divide-y divide-gray-100'>
        {notifications.map((notification: any) => renderNotificationItem(notification))}
      </div>
    );
  };

  return (
    <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 mb-20 pb-56 md:pb-0 min-h-[80vh] flex flex-col'>
      {/* Back Navigation */}
      <div className='flex p-4'>
        <BackButton label="Dashboard" href="/dashboard" />
      </div>

      {/* Header */}
      <div className='px-2 md:px-8 lg:px-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold text-indigo-dye'>Notifications</h2>
          <div className='flex items-center gap-4'>
            {readCount > 0 && (
              <button
                onClick={handleDeleteAllRead}
                className='text-sm text-red-600 hover:text-red-700 flex items-center gap-1'
              >
                <TrashIcon className='h-4 w-4' />
                Delete all read
              </button>
            )}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className='text-sm text-gray-600 hover:text-gray-900'
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='px-2 md:px-8 lg:px-4 mt-6'>
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex gap-6'>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={classNames(
                  'pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className='px-2 md:px-8 lg:px-4 mt-6 flex-1'>
        <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
          {renderContent()}
        </div>
      </div>

      {/* See More Button */}
      {hasNextPage && (
        <div className='px-2 md:px-8 lg:px-4 mt-4 flex justify-center'>
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className='px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isFetchingNextPage ? (
              <>
                <LoadingSpinner size='sm' color='gray' />
                Loading...
              </>
            ) : (
              <>
                See More
                <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* Show count info */}
      <div className='px-2 md:px-8 lg:px-4 mt-4 mb-8 text-center'>
        <p className='text-sm text-gray-500'>
          Showing {notifications.length} of {totalRecords} notifications
        </p>
      </div>

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-900'>Delete All Read Notifications</h3>
              <button
                onClick={() => setShowBulkDeleteConfirm(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                <XMarkIcon className='h-5 w-5' />
              </button>
            </div>
            <p className='text-sm text-gray-600 mb-6'>
              Are you sure you want to delete all read notifications? This action cannot be undone.
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setShowBulkDeleteConfirm(false)}
                className='px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAllRead}
                disabled={isDeletingAll}
                className='px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2'
              >
                {isDeletingAll ? (
                  <>
                    <LoadingSpinner size='sm' color='white' />
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className='h-4 w-4' />
                    Delete All Read
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
