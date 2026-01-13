import { useState, useEffect } from 'react';

import Modal from '../../../../../components/Modal';

import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

import { T_DailyProgress } from '@/types/business-mode';

interface ViewDailyProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  dailyProgresses: T_DailyProgress[];
  isClient: boolean;
  onReview?: (progressId: number, status: 'approved' | 'rejected', feedback: string) => void;
}

const ViewDailyProgressModal = ({
  isOpen,
  onClose,
  jobTitle,
  dailyProgresses,
  isClient,
  onReview,
}: ViewDailyProgressModalProps) => {
  const [selectedProgress, setSelectedProgress] = useState<T_DailyProgress | null>(null);
  const [reviewStatus, setReviewStatus] = useState<'approved' | 'rejected'>('approved');
  const [feedback, setFeedback] = useState<string>('');

  const handleReviewSubmit = () => {
    if (selectedProgress && onReview) {
      onReview(selectedProgress.id, reviewStatus, feedback);
      setSelectedProgress(null);
      setFeedback('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedProgress(null);
      setFeedback('');
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Daily Progress - ${jobTitle}`}
      size="lg"
      footerContent={
        selectedProgress && isClient && selectedProgress.status === 'submitted' ? (
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setSelectedProgress(null)}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleReviewSubmit}
              className="px-4 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Submit Review
            </button>
          </div>
        ) : (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        )
      }
    >
      {!selectedProgress ? (
        <div className="space-y-4">
          {dailyProgresses.length === 0 ? (
            <div className="text-center py-8">
              <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No daily progress submitted yet</p>
            </div>
          ) : (
            dailyProgresses.map((progress) => (
              <div
                key={progress.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-savoy-blue transition-colors cursor-pointer"
                onClick={() => setSelectedProgress(progress)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(progress.progress_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          progress.status
                        )}`}
                      >
                        {getStatusIcon(progress.status)}
                        <span className="capitalize">{progress.status}</span>
                      </div>
                    </div>
                    {progress.hours_worked && (
                      <p className="text-sm text-gray-600 mb-1">
                        Hours worked: {progress.hours_worked}
                      </p>
                    )}
                    {progress.notes && (
                      <p className="text-sm text-gray-700 line-clamp-2">{progress.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {new Date(selectedProgress.progress_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h3>

            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    selectedProgress.status
                  )}`}
                >
                  {getStatusIcon(selectedProgress.status)}
                  <span className="capitalize">{selectedProgress.status}</span>
                </div>
              </div>

              {/* Hours Worked */}
              {selectedProgress.hours_worked && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours Worked
                  </label>
                  <p className="text-gray-900">{selectedProgress.hours_worked} hours</p>
                </div>
              )}

              {/* Notes */}
              {selectedProgress.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Notes
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedProgress.notes}</p>
                </div>
              )}

              {/* Proof File */}
              {selectedProgress.proof_file && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proof of Work
                  </label>
                  <a
                    href={selectedProgress.proof_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-savoy-blue hover:underline"
                  >
                    View File
                  </a>
                </div>
              )}

              {/* Client Feedback (if exists) */}
              {selectedProgress.client_feedback && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Feedback
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedProgress.client_feedback}
                    </p>
                  </div>
                </div>
              )}

              {/* Review Form (for client if status is submitted) */}
              {isClient && selectedProgress.status === 'submitted' && (
                <div className="border-t pt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review Status <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setReviewStatus('approved')}
                        className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
                          reviewStatus === 'approved'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <CheckCircleIcon className="h-5 w-5 inline mr-2" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => setReviewStatus('rejected')}
                        className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
                          reviewStatus === 'rejected'
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <XCircleIcon className="h-5 w-5 inline mr-2" />
                        Reject
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={3}
                      placeholder="Provide feedback on this day's work..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-savoy-blue resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ViewDailyProgressModal;

