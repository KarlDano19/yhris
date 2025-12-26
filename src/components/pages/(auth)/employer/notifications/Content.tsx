'use client';

import React, { useState, useMemo } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

import LoadingSpinner from '@/components/LoadingSpinner';
import classNames from '@/helpers/classNames';
import useGetNotification from '@/components/hooks/useGetNotification';
import useMarkNotificationRead from '@/components/hooks/useMarkNotificationRead';

type TabType = 'all' | 'unread';

const Content = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [pageSize] = useState(10);

  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    refetch 
  } = useGetNotification({ page_size: pageSize, tab: activeTab });
  
  const { mutate: markAsRead } = useMarkNotificationRead();

  // Flatten all pages into a single array
  const notifications = useMemo(() => {
    return data?.pages.flatMap(page => page?.records || []) || [];
  }, [data]);
  
  // Get counts from the first page
  const totalRecords = data?.pages[0]?.total_records || 0;
  const unreadCount = data?.pages[0]?.unread_count || 
    notifications.filter((n: any) => !n.is_read).length;

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

  const tabs: { key: TabType; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: totalRecords },
    { key: 'unread', label: 'Unread', count: unreadCount },
  ];

  const renderNotificationItem = (notification: any) => {
    return (
      <div
        key={notification.id}
        onClick={() => handleNotificationClick(notification)}
        className={classNames(
          'flex items-start gap-4 px-6 py-4 border-b border-gray-100 cursor-pointer transition-colors',
          'hover:bg-gray-50',
          !notification.is_read ? 'bg-blue-50/50' : 'bg-white'
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
            </div>
          </div>
        </div>
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
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 pb-56 md:pb-0 min-h-[80vh] flex flex-col'>
      {/* Back Navigation */}
      <div className='flex p-4'>
        <Link href='/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200 px-2 py-1 rounded'>
          <ArrowLeftIcon className='h-5 w-5' />
          <h4>Dashboard</h4>
        </Link>
      </div>

      {/* Header */}
      <div className='px-2 md:px-8 lg:px-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold text-indigo-dye'>Notifications</h2>
          <div className='flex items-center gap-4'>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className='text-sm text-gray-600 hover:text-gray-900'
              >
                Mark all as read
              </button>
            )}
            {/* <button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50'>
              <Cog6ToothIcon className='h-4 w-4' />
              Settings
            </button> */}
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
    </div>
  );
};

export default Content;