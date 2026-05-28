'use client';

import React, { useState } from 'react';
import BackButton from '@/components/BackButton';

import AuditLogs from './tabs/AuditLogs';
import EmailMonitoring from './tabs/EmailMonitoring';

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [activeTab, setActiveTab] = useState('audit-logs');

  return (
    <>
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <BackButton label="Dashboard" href="/dashboard" />
        </div>

        <div className='pl-4 md:pl-10 mb-5'>
          <div className='flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between'>
            <div
              className='overflow-x-auto'
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#2d3e58 #f1f1f1'
              }}
            >
              <div className='flex gap-2 min-w-max pb-2'>
                <div
                  onClick={() => setActiveTab('audit-logs')}
                  className={`cursor-pointer px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
                    activeTab === 'audit-logs'
                      ? 'bg-white text-savoy-blue border-2 border-savoy-blue shadow-sm'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  Audit Logs
                </div>
                <div
                  onClick={() => setActiveTab('email-monitoring')}
                  className={`cursor-pointer px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
                    activeTab === 'email-monitoring'
                      ? 'bg-white text-savoy-blue border-2 border-savoy-blue shadow-sm'
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  Email Monitoring
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeTab === 'audit-logs' && <AuditLogs hasActiveSubscription={hasActiveSubscription} />}
        {activeTab === 'email-monitoring' && <EmailMonitoring hasActiveSubscription={hasActiveSubscription} />}
      </div>
    </>
  );
};

export default Content;
