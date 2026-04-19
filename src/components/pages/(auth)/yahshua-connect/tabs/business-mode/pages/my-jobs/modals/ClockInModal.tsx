import { ClockIcon } from '@heroicons/react/24/outline';

import Modal from '../../../../../components/Modal';

interface ClockInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  jobTitle: string;
  timeFrom?: string | null;
  timeTo?: string | null;
  isStrictSchedule?: boolean;
}

const ClockInModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  jobTitle,
  timeFrom,
  timeTo,
  isStrictSchedule = false,
}: ClockInModalProps) => {
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

  const scheduledTimeFrom = formatTime(timeFrom);
  const scheduledTimeTo = formatTime(timeTo);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Clock In"
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
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Clocking In...
              </>
            ) : (
              <>
                <ClockIcon className="h-4 w-4" />
                Clock In Now
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="text-center">
        {/* Clock Icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <ClockIcon className="h-8 w-8 text-green-600" />
        </div>

        {/* Current Time */}
        <p className="text-3xl font-bold text-gray-900 mb-1">{currentTime}</p>
        <p className="text-sm text-gray-500 mb-4">{currentDate}</p>

        {/* Job Title */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-500 mb-1">Clocking in for:</p>
          <p className="text-base font-semibold text-gray-900">{jobTitle}</p>
        </div>

        {/* Schedule Info */}
        {scheduledTimeFrom && scheduledTimeTo && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-700 mb-1">Scheduled Work Hours:</p>
            <p className="text-base font-semibold text-blue-900">
              {scheduledTimeFrom} - {scheduledTimeTo}
            </p>
            {isStrictSchedule && (
              <p className="text-xs text-blue-600 mt-2">
                Strict schedule enabled. Late arrivals may result in pay deductions.
              </p>
            )}
          </div>
        )}

        {/* Info Text */}
        <p className="text-sm text-gray-500">
          You can only clock in once per day. Make sure you&apos;re ready to start working.
        </p>
      </div>
    </Modal>
  );
};

export default ClockInModal;
