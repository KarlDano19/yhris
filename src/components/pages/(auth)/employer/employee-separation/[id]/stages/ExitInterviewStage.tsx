'use client';

import React, { useState } from 'react';

import toast from 'react-hot-toast';

import { ClipboardDocumentListIcon, CheckCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

import CustomToast from '@/components/CustomToast';
import { formatDateToLocal } from '@/helpers/date';
import usePatchSeparation from '../../hooks/usePatchSeparation';
import useGetFormsSelect from '../hooks/useGetFormsSelect';
import useSendExitInterview from '../hooks/useSendExitInterview';

type Props = {
  separation: any;
};

const ExitInterviewStage = ({ separation }: Props) => {
  const [selectedFormId, setSelectedFormId] = useState<number | null>(
    separation.exit_interview_form_id ?? null
  );
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  const { data: forms, isLoading: formsLoading } = useGetFormsSelect();
  const { mutate: sendExitInterview, isLoading: isSending } = useSendExitInterview(String(separation.id));
  const { mutate: patchSeparation, isLoading: isSkipping } = usePatchSeparation();

  const alreadySent = !!separation.exit_interview_sent_at;
  const isCompleted = !!separation.exit_interview_is_completed;
  const isSkipped = !!separation.is_exit_interview_skipped;
  const isDone = isCompleted || isSkipped;

  const handleSendClick = () => {
    if (!selectedFormId) {
      toast.custom(() => <CustomToast message='Please select a form first.' type='error' />, { duration: 4000 });
      return;
    }
    setShowSendConfirm(true);
  };

  const handleConfirmSend = () => {
    setShowSendConfirm(false);
    sendExitInterview(
      { form_id: selectedFormId! },
      {
        onSuccess: (res: any) => {
          toast.custom(() => <CustomToast message={res.message ?? 'Exit interview sent.'} type='success' />, { duration: 5000 });
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err.message ?? 'Failed to send exit interview.'} type='error' />, { duration: 7000 });
        },
      }
    );
  };

  const handleConfirmSkip = () => {
    setShowSkipConfirm(false);
    patchSeparation(
      { id: String(separation.id), actionType: 'skip_exit_interview', emailType: '', separationLetter: {}, signDocuments: {}, quitClaim: {}, lastPay: {}, dateReceived: null },
      {
        onSuccess: (res: any) => {
          toast.custom(() => <CustomToast message={res.message ?? 'Exit interview skipped.'} type='success' />, { duration: 5000 });
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err ?? 'Failed to skip exit interview.'} type='error' />, { duration: 7000 });
        },
      }
    );
  };

  return (
    <div className='space-y-5'>
      {/* Form Selector Card */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0'>
            <ClipboardDocumentListIcon className='h-5 w-5 text-teal-600' />
          </div>
          <div>
            <h3 className='text-sm font-semibold text-gray-900'>Exit Interview Form</h3>
            <p className='text-xs text-gray-500 mt-0.5'>
              Select a form from your library and send it to the departing employee
            </p>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-3'>
          <select
            value={selectedFormId ?? ''}
            onChange={(e) => setSelectedFormId(e.target.value ? Number(e.target.value) : null)}
            disabled={isDone || formsLoading}
            className='flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <option value=''>— Select a form —</option>
            {(forms ?? []).map((form: any) => (
              <option key={form.id} value={form.id}>
                {form.title} ({form.form_type_display})
              </option>
            ))}
          </select>

          <button
            onClick={handleSendClick}
            disabled={isSending || isDone || !selectedFormId}
            className='flex items-center gap-2 justify-center px-4 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0'
          >
            <EnvelopeIcon className='h-4 w-4' />
            {isSending ? 'Sending…' : alreadySent ? 'Resend' : 'Send Exit Interview'}
          </button>
        </div>
      </div>

      {/* Status Card — shown after first send */}
      {alreadySent && (
        <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
          <h4 className='text-sm font-semibold text-gray-900 mb-3'>Sent Form</h4>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <p className='text-sm font-medium text-gray-800'>
                {separation.exit_interview_form_title ?? '—'}
              </p>
              <p className='text-xs text-gray-500 mt-1'>
                Sent: {separation.exit_interview_sent_at ? formatDateToLocal(separation.exit_interview_sent_at) : '—'}
              </p>
              {isCompleted && separation.exit_interview_submitted_at && (
                <p className='text-xs text-gray-500 mt-0.5'>
                  Completed: {formatDateToLocal(separation.exit_interview_submitted_at)}
                </p>
              )}
            </div>
            {isCompleted ? (
              <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 flex-shrink-0'>
                <CheckCircleIcon className='h-3.5 w-3.5' />
                Completed
              </span>
            ) : (
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex-shrink-0'>
                Pending
              </span>
            )}
          </div>
        </div>
      )}

      {/* Send Confirm */}
      {showSendConfirm && (
        <div className='bg-white rounded-xl border border-yellow-200 shadow-sm p-5'>
          <p className='text-sm text-gray-800 font-medium mb-3'>
            {alreadySent
              ? `Resend the exit interview form to ${separation.email ?? 'the employee'}? They will receive a new link.`
              : `Send the exit interview form to ${separation.email ?? 'the employee'}?`}
          </p>
          <div className='flex gap-3'>
            <button
              onClick={handleConfirmSend}
              disabled={isSending}
              className='flex-1 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50'
            >
              {isSending ? 'Sending…' : 'Confirm Send'}
            </button>
            <button
              onClick={() => setShowSendConfirm(false)}
              className='flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Skip Confirm */}
      {showSkipConfirm && (
        <div className='bg-white rounded-xl border border-orange-200 shadow-sm p-5'>
          <p className='text-sm text-gray-800 font-medium mb-3'>
            Skip the exit interview? The workflow will advance to Final Settlement without an exit interview response.
          </p>
          <div className='flex gap-3'>
            <button
              onClick={handleConfirmSkip}
              disabled={isSkipping}
              className='flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50'
            >
              {isSkipping ? 'Skipping…' : 'Skip Exit Interview'}
            </button>
            <button
              onClick={() => setShowSkipConfirm(false)}
              className='flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Skipped notice */}
      {isSkipped && (
        <div className='bg-orange-50 rounded-xl border border-orange-100 p-4 text-sm text-orange-700'>
          Exit interview was skipped for this separation.
        </div>
      )}

      {/* Skip button — only shown when not yet done */}
      {!isDone && !showSkipConfirm && (
        <div className='flex justify-end'>
          <button
            onClick={() => setShowSkipConfirm(true)}
            disabled={isSkipping}
            className='text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors disabled:opacity-40'
          >
            Skip Exit Interview
          </button>
        </div>
      )}
    </div>
  );
};

export default ExitInterviewStage;
