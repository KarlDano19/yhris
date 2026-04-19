import Modal from '../../../../../components/Modal';

import { ClockIcon } from '@heroicons/react/24/outline';

import { T_TimeRecord } from '@/types/business-mode';

interface ViewTimeLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  applicantName: string;
  timeRecords: T_TimeRecord[];
  hourlyRate?: number | null;
}

const ViewTimeLogsModal = ({
  isOpen,
  onClose,
  jobTitle,
  applicantName,
  timeRecords,
  hourlyRate,
}: ViewTimeLogsModalProps) => {
  // Calculate totals
  const totalHoursWorked = timeRecords
    .filter((r) => r.status === 'clocked_out')
    .reduce((sum, r) => sum + (r.actual_hours || 0), 0);

  const totalDaysWorked = timeRecords.filter((r) => r.status === 'clocked_out').length;

  const formatTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return '-';
    return new Date(dateTimeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Time Logs - ${jobTitle}`}
      size="lg"
      footerContent={
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      }
    >
      {/* Summary Section */}
      <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-purple-700 mb-2">
          <span className="font-semibold">Worker:</span> {applicantName}
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-purple-600">Total Days</p>
            <p className="text-lg font-bold text-purple-900">{totalDaysWorked}</p>
          </div>
          <div>
            <p className="text-xs text-purple-600">Hours Worked</p>
            <p className="text-lg font-bold text-purple-900">{totalHoursWorked.toFixed(1)}h</p>
          </div>
          {hourlyRate && (
            <div>
              <p className="text-xs text-purple-600">Rate</p>
              <p className="text-lg font-bold text-purple-900">₱{hourlyRate.toLocaleString()}/hr</p>
            </div>
          )}
        </div>
      </div>

      {/* Time Records List */}
      <div className="space-y-3">
        {timeRecords.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No time logs recorded yet</p>
          </div>
        ) : (
          timeRecords.map((record) => (
            <div
              key={record.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(record.record_date)}
                    </p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'clocked_out'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {record.status === 'clocked_out' ? 'Completed' : 'Clocked In'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Clock In</p>
                      <p className="font-medium text-green-600">{formatTime(record.clock_in_time)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Clock Out</p>
                      <p className="font-medium text-red-600">
                        {record.clock_out_time ? formatTime(record.clock_out_time) : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Hours</p>
                      <p className="font-medium text-gray-900">
                        {record.actual_hours ? `${record.actual_hours.toFixed(1)}h` : '-'}
                      </p>
                    </div>
                    {(record.late_minutes > 0 || record.early_departure_minutes > 0) && (
                      <div>
                        <p className="text-xs text-gray-500">Notes</p>
                        <div className="text-xs">
                          {record.late_minutes > 0 && (
                            <p className="text-orange-600">Late: {record.late_minutes}min</p>
                          )}
                          {record.early_departure_minutes > 0 && (
                            <p className="text-orange-600">Early out: {record.early_departure_minutes}min</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

export default ViewTimeLogsModal;
