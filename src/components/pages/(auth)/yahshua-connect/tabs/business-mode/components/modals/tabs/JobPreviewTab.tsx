import { CalendarIcon, MapPinIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface JobPreviewTabProps {
  jobTitle: string;
  category: string;
  description: string;
  location: string;
  budgetType: 'fixed' | 'hourly';
  budgetMin: string;
  budgetMax: string;
  scheduleDate: Date | null;
  scheduleTimeFrom: string;
  scheduleTimeTo: string;
  onBack: () => void;
  onSubmit: () => void;
}

export default function JobPreviewTab({
  jobTitle,
  category,
  description,
  location,
  budgetType,
  budgetMin,
  budgetMax,
  scheduleDate,
  scheduleTimeFrom,
  scheduleTimeTo,
  onBack,
  onSubmit,
}: JobPreviewTabProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Not set';
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[date.getMonth()]} ${date.getDate()}`;
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatPriceRange = () => {
    if (!budgetMin) return 'Not set';
    const min = parseInt(budgetMin).toLocaleString();
    if (budgetMax && budgetMax !== budgetMin) {
      const max = parseInt(budgetMax).toLocaleString();
      return `₱${min} - ₱${max}`;
    }
    return `₱${min}`;
  };

  const formatTimeRange = () => {
    if (scheduleTimeFrom && scheduleTimeTo) {
      return `${formatTime(scheduleTimeFrom)} - ${formatTime(scheduleTimeTo)}`;
    } else if (scheduleTimeFrom) {
      return formatTime(scheduleTimeFrom);
    }
    return 'Not set';
  };

  return (
    <div className="px-6 py-6">
      <div className="space-y-6">
        {/* Job Header */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{jobTitle || 'Untitled Job'}</h3>
          {category && (
            <p className="text-sm text-gray-600">{category}</p>
          )}
        </div>

        {/* Job Details */}
        <div className="space-y-4">
          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{description || 'No description provided'}</p>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Location</h4>
              <p className="text-sm text-gray-600">{location || 'Not set'}</p>
            </div>
          </div>

          {/* Budget */}
          <div className="flex items-start gap-3">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                {budgetType === 'fixed' ? 'Budget' : 'Rate per Hour'}
              </h4>
              <p className="text-sm text-gray-600">{formatPriceRange()}</p>
            </div>
          </div>

          {/* Schedule */}
          <div className="flex items-start gap-3">
            <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Schedule</h4>
              <p className="text-sm text-gray-600">{formatDate(scheduleDate)}</p>
            </div>
          </div>

          {/* Time */}
          {scheduleTimeFrom && (
            <div className="flex items-start gap-3">
              <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Time</h4>
                <p className="text-sm text-gray-600">{formatTimeRange()}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="inline-flex justify-center rounded-lg border border-transparent bg-savoy-blue px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
        >
          Post Job
        </button>
      </div>
    </div>
  );
}

