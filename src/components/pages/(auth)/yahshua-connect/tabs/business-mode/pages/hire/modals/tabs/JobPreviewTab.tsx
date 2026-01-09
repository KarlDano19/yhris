import { CalendarIcon, ClockIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import JobDetailsLocation from '@/svg/JobDetailLocation';
import FileCaseIcon from '@/svg/FileCaseIcon';

interface JobPreviewTabProps {
  jobTitle: string;
  category: string;
  description: string;
  location: string;
  budgetType: 'fixed' | 'hourly';
  budgetMin: string;
  budgetMax: string;
  scheduleStartDate: Date | null;
  scheduleEndDate: Date | null;
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
  scheduleStartDate,
  scheduleEndDate,
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

  const formatDateRange = () => {
    if (!scheduleStartDate) return 'Not set';
    const startDateStr = formatDate(scheduleStartDate);
    if (scheduleEndDate) {
      const endDateStr = formatDate(scheduleEndDate);
      return `${startDateStr} - ${endDateStr}`;
    }
    return `${startDateStr} (Flexible/Ongoing)`;
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
      {/* Job Header */}
      <div className="flex items-start gap-3 mb-4">
        <span className="mt-1 flex-shrink-0">
          <FileCaseIcon className="h-5 w-5 md:h-6 md:w-6" />
        </span>
        <div className="flex-1 min-w-0">
          <h5 className="text-lg md:text-xl font-semibold text-indigo-dye break-words">
            {jobTitle || 'Untitled Job'}
          </h5>
          {category && (
            <h6 className="text-indigo-dye text-xs md:text-sm mt-1 break-words">
              Category: {category}
            </h6>
          )}
        </div>
      </div>

      {/* Job Details Section */}
      <div className="border-t border-gray-300 my-4 pt-4">
        <h5 className="text-lg md:text-xl font-semibold text-indigo-dye mb-3">Job Details</h5>
        <div className="details mt-2 space-y-3">
          {/* Description */}
          <div>
            <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
              <ClipboardDocumentIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
              Description
            </h6>
            <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px] whitespace-pre-wrap break-words">
              {description || 'No description provided'}
            </p>
          </div>

          {/* Location */}
          <div>
            <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
              <JobDetailsLocation className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2 flex-shrink-0" />
              Location
            </h6>
            <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px] break-words">
              {location || 'Not set'}
            </p>
          </div>

          {/* Budget */}
          <div>
            <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
              <CalendarIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
              {budgetType === 'fixed' ? 'Budget' : 'Rate per Hour'}
            </h6>
            <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]">
              {formatPriceRange()}
            </p>
          </div>

          {/* Contract Period */}
          <div>
            <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
              <CalendarIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
              Contract Period
            </h6>
            <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]">
              {formatDateRange()}
            </p>
          </div>

          {/* Time */}
          {scheduleTimeFrom && (
            <div>
              <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
                <ClockIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                Time
              </h6>
              <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]">
                {formatTimeRange()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between border-t border-gray-300 pt-4">
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

