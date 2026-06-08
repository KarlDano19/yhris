'use client';

import React from 'react';

import { formatDateToLocal } from '@/helpers/date';

type LogEntry = {
  label: string;
  date: string | null;
  done: boolean;
};

type Props = {
  separation: any;
};

const ActivityLog = ({ separation }: Props) => {
  const entries: LogEntry[] = [
    { label: 'Separation Created', date: separation.created_at, done: true },
    { label: 'Letter Sent', date: separation.is_letter_sent ? separation.updated_at : null, done: !!separation.is_letter_sent },
    { label: 'Letter Received', date: separation.letter_received_date, done: !!separation.is_letter_received },
    { label: 'Documents Sent', date: separation.is_documents_sent ? separation.updated_at : null, done: !!separation.is_documents_sent },
    { label: 'Documents Received', date: separation.documents_received_date, done: !!separation.is_documents_received },
    { label: 'Last Pay Released', date: separation.is_last_pay_released ? separation.updated_at : null, done: !!separation.is_last_pay_released },
    { label: 'Quitclaim Signed', date: separation.is_quit_claim_signed ? separation.updated_at : null, done: !!separation.is_quit_claim_signed },
    { label: 'Quitclaim Received', date: separation.quit_claim_received_date, done: !!separation.is_quit_claim_received },
  ].filter(e => e.done);

  return (
    <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
      <h3 className='text-sm font-semibold text-gray-900 mb-4'>Activity Log</h3>
      <div className='relative'>
        <div className='absolute left-2 top-0 bottom-0 w-px bg-gray-200' />
        <div className='space-y-4'>
          {entries.map((entry, idx) => (
            <div key={idx} className='flex items-start gap-4 pl-8 relative'>
              <div className='absolute left-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm flex-shrink-0' />
              <div>
                <p className='text-sm font-medium text-gray-800'>{entry.label}</p>
                {entry.date && (
                  <p className='text-xs text-gray-400 mt-0.5'>{formatDateToLocal(entry.date)}</p>
                )}
              </div>
            </div>
          ))}
          {entries.length === 0 && (
            <p className='text-sm text-gray-400 pl-8'>No activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
