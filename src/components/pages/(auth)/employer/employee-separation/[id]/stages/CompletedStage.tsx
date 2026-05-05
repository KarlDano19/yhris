'use client';

import React from 'react';

import { CheckCircleIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';

import AttachmentCard from '../../components/AttachmentCard';

import { formatDateToLocal } from '@/helpers/date';

type Props = {
  separation: any;
};

// ── Reusable sub-components ─────────────────────────────────────────────────


const TaskRow = ({ task }: { task: any }) => (
  <div className='flex items-center gap-2 py-1.5'>
    {task.is_checked
      ? <CheckCircleIcon className='h-5 w-5 text-green-500 flex-shrink-0' />
      : <div className='h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0' />
    }
    <span className={`text-sm ${task.is_checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.label}</span>
  </div>
);

const StageCard = ({ children, title, badge }: { children: React.ReactNode; title: string; badge?: React.ReactNode }) => (
  <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
    <div className='flex items-center justify-between mb-4'>
      <h3 className='text-sm font-semibold text-gray-900'>{title}</h3>
      {badge}
    </div>
    {children}
  </div>
);

const StatusBadge = ({ done, doneLabel, pendingLabel }: { done: boolean; doneLabel: string; pendingLabel: string }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
    {done && <CheckBadgeIcon className='h-3 w-3' />}
    {done ? doneLabel : pendingLabel}
  </span>
);

// ── Main component ───────────────────────────────────────────────────────────

const CompletedStage = ({ separation }: Props) => {
  const allTasks: any[] = separation.stage_tasks || [];
  const tasksByStage = (stage: string) => allTasks.filter((t: any) => t.stage === stage);

  const letterAttachments = separation.letter_attachments || [];
  const docAttachments = separation.document_attachments || [];
  const lastPayAttachments = separation.last_pay_attachments || [];
  const quitclaimAttachments = separation.quitclaim_attachments || [];

  return (
    <div className='space-y-5'>
      {/* Banner */}
      <div className='bg-green-50 border border-green-200 rounded-xl p-5 flex flex-col items-center text-center'>
        <CheckBadgeIcon className='h-10 w-10 text-green-500 mb-2' />
        <h3 className='text-base font-bold text-green-800'>Final Settlement Summary</h3>
        <p className='text-sm text-green-600 mt-1'>Complete record of all separation stages and documents.</p>
      </div>

      {/* Stage 1 — Initiation */}
      <StageCard
        title="1. Initiation"
        badge={<StatusBadge done={true} doneLabel="Created" pendingLabel="Pending" />}
      >
        <dl className='grid grid-cols-2 gap-x-6 gap-y-2 text-sm'>
          <div>
            <dt className='text-xs text-gray-400 uppercase'>Date of Separation</dt>
            <dd className='font-medium text-gray-800 mt-0.5'>{formatDateToLocal(separation.date_of_separation)}</dd>
          </div>
          <div>
            <dt className='text-xs text-gray-400 uppercase'>Reason</dt>
            <dd className='font-medium text-gray-800 mt-0.5'>{separation.reason_of_leaving || '—'}</dd>
          </div>
          <div>
            <dt className='text-xs text-gray-400 uppercase'>Letter Sent</dt>
            <dd className='mt-0.5'><StatusBadge done={!!separation.is_letter_sent} doneLabel="Sent" pendingLabel="Not sent" /></dd>
          </div>
          <div>
            <dt className='text-xs text-gray-400 uppercase'>Letter Received</dt>
            <dd className='mt-0.5'><StatusBadge done={!!separation.is_letter_received} doneLabel={formatDateToLocal(separation.letter_received_date) || 'Received'} pendingLabel="Awaiting" /></dd>
          </div>
        </dl>
        <AttachmentCard attachments={letterAttachments} label='Letters' />
      </StageCard>

      {/* Stage 2 — Rendering */}
      <StageCard
        title="2. Rendering"
        badge={<StatusBadge done={!!separation.is_letter_received} doneLabel="Done" pendingLabel="In Progress" />}
      >
        <dl className='grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3'>
          <div>
            <dt className='text-xs text-gray-400 uppercase'>Last Working Day</dt>
            <dd className='font-medium text-gray-800 mt-0.5'>{formatDateToLocal(separation.effective_date || separation.date_of_separation)}</dd>
          </div>
        </dl>
        {tasksByStage('rendering').length > 0 && (
          <>
            <p className='text-xs font-medium text-gray-500 mt-3 mb-1'>Rendering Tasks</p>
            <div className='divide-y divide-gray-100'>
              {tasksByStage('rendering').map(t => <TaskRow key={t.id} task={t} />)}
            </div>
          </>
        )}
      </StageCard>

      {/* Stage 3 — Clearance */}
      <StageCard
        title="3. Clearance"
        badge={<StatusBadge done={!!separation.is_documents_received} doneLabel="Received" pendingLabel="Pending" />}
      >
        <dl className='grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3'>
          <div>
            <dt className='text-xs text-gray-400 uppercase'>Documents Sent</dt>
            <dd className='mt-0.5'><StatusBadge done={!!separation.is_documents_sent} doneLabel="Sent" pendingLabel="Not sent" /></dd>
          </div>
          <div>
            <dt className='text-xs text-gray-400 uppercase'>Documents Received</dt>
            <dd className='mt-0.5'><StatusBadge done={!!separation.is_documents_received} doneLabel={formatDateToLocal(separation.documents_received_date) || 'Received'} pendingLabel="Awaiting" /></dd>
          </div>
        </dl>
        <AttachmentCard attachments={docAttachments} label='Document Attachments' />
        {tasksByStage('clearance').length > 0 && (
          <>
            <p className='text-xs font-medium text-gray-500 mt-3 mb-1'>Clearance Tasks</p>
            <div className='divide-y divide-gray-100'>
              {tasksByStage('clearance').map(t => <TaskRow key={t.id} task={t} />)}
            </div>
          </>
        )}
      </StageCard>

      {/* Stage 4 — Final Pay */}
      <StageCard
        title="4. Final Pay"
        badge={<StatusBadge done={!!separation.is_last_pay_released} doneLabel="Released" pendingLabel="Pending" />}
      >
        <AttachmentCard attachments={lastPayAttachments} label='Last Pay Attachments' />
        {tasksByStage('final-pay').length > 0 && (
          <>
            <p className='text-xs font-medium text-gray-500 mt-3 mb-1'>Final Pay Tasks</p>
            <div className='divide-y divide-gray-100'>
              {tasksByStage('final-pay').map(t => <TaskRow key={t.id} task={t} />)}
            </div>
          </>
        )}
        {!separation.is_last_pay_released && lastPayAttachments.length === 0 && (tasksByStage('final-pay').length === 0) && (
          <p className='text-sm text-gray-400'>No final pay records yet.</p>
        )}
      </StageCard>

      {/* Stage 5 — Legal Docs */}
      <StageCard
        title="5. Legal Docs"
        badge={<StatusBadge done={!!separation.is_quit_claim_received} doneLabel="Received" pendingLabel="Pending" />}
      >
        <dl className='grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3'>
          <div>
            <dt className='text-xs text-gray-400 uppercase'>Quitclaim Signed</dt>
            <dd className='mt-0.5'><StatusBadge done={!!separation.is_quit_claim_signed} doneLabel="Signed" pendingLabel="Pending" /></dd>
          </div>
          <div>
            <dt className='text-xs text-gray-400 uppercase'>Quitclaim Received</dt>
            <dd className='mt-0.5'><StatusBadge done={!!separation.is_quit_claim_received} doneLabel={formatDateToLocal(separation.quit_claim_received_date) || 'Received'} pendingLabel="Awaiting" /></dd>
          </div>
        </dl>
        <AttachmentCard attachments={quitclaimAttachments} label='Quitclaim Attachments' />
        {tasksByStage('legal-docs').length > 0 && (
          <>
            <p className='text-xs font-medium text-gray-500 mt-3 mb-1'>Legal Docs Tasks</p>
            <div className='divide-y divide-gray-100'>
              {tasksByStage('legal-docs').map(t => <TaskRow key={t.id} task={t} />)}
            </div>
          </>
        )}
      </StageCard>

    </div>
  );
};

export default CompletedStage;
