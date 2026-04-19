import { ClockIcon } from '@heroicons/react/24/outline';

import Modal from '../../../../../components/Modal';
import { T_TimeRecord } from '@/types/business-mode';

interface ClockOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  jobTitle: string;
  timeRecord?: T_TimeRecord | null;
  isStrictSchedule?: boolean;
  timeTo?: string | null;
}

const ClockOutModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  jobTitle,
  timeRecord,
  isStrictSchedule = false,
  timeTo,
}: ClockOutModalProps) => {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Format clock in time
  const clockInTime = timeRecord?.clock_in_time
    ? new Date(timeRecord.clock_in_time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : null;

  // Calculate elapsed time since clock in
  const calculateElapsedTime = () => {
    if (!timeRecord?.clock_in_time) return null;
    const clockIn = new Date(timeRecord.clock_in_time);
    const now = new Date();
    const diffMs = now.getTime() - clockIn.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  };

  const elapsedTime = calculateElapsedTime();

  // Format schedule time for display
  const formatTime = (time: string | null | undefined) => {
    if (!time) return null;
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const scheduledTimeTo = formatTime(timeTo);

  // Check if early departure
  const isEarlyDeparture = () => {
    if (!timeTo || !isStrictSchedule) return false;
    const [hours, minutes] = timeTo.split(':');
    const scheduledEnd = new Date();
    scheduledEnd.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return new Date() < scheduledEnd;
  };

  const earlyDeparture = isEarlyDeparture();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Clock Out"
      size="sm"
      footerContent={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Clocking Out...
              </>
            ) : (
              <>
                <ClockIcon className="h-4 w-4" />
                Clock Out Now
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="text-center">
        {/* Clock Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <ClockIcon className="h-8 w-8 text-red-600" />
        </div>

        {/* Current Time */}
        <p className="text-3xl font-bold text-gray-900 mb-1">{currentTime}</p>
        <p className="text-sm text-gray-500 mb-4">{currentDate}</p>

        {/* Job Title */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-500 mb-1">Clocking out from:</p>
          <p className="text-base font-semibold text-gray-900">{jobTitle}</p>
        </div>

        {/* Time Summary */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xs text-blue-600 mb-1">Clocked In At</p>
              <p className="text-lg font-semibold text-blue-900">{clockInTime || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 mb-1">Time Worked</p>
              <p className="text-lg font-semibold text-blue-900">{elapsedTime || '-'}</p>
            </div>
          </div>
          {timeRecord?.late_minutes && timeRecord.late_minutes > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-orange-600">
                Late arrival: {timeRecord.late_minutes} minutes
              </p>
            </div>
          )}
        </div>

        {/* Early Departure Warning */}
        {earlyDeparture && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-orange-700">
              <strong>Early departure:</strong> Scheduled end time is {scheduledTimeTo}.
              {isStrictSchedule && ' This may result in a pay deduction.'}
            </p>
          </div>
        )}

        {/* Info Text */}
        <p className="text-sm text-gray-500">
          Your work hours will be calculated automatically, excluding the 12:00 PM - 1:00 PM lunch break.
        </p>
      </div>
    </Modal>
  );
};

export default ClockOutModal;
