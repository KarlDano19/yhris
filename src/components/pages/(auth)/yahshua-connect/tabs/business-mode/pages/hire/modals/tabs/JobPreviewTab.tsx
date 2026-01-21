import { CalendarIcon, ClockIcon, ClipboardDocumentIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import FileCaseIcon from '@/svg/FileCaseIcon';
import { formatDateToLocal } from '@/helpers/date';

export default function JobPreviewTab({
  control,
  register,
  onSubmit,
  setSelectedTab,
  setValue,
  watch,
  isLoading,
}: {
  control: any;
  register: any;
  onSubmit: any;
  setSelectedTab: any;
  setValue: any;
  watch: any;
  isLoading: any;
}) {
  // Watch form values
  const jobTitle = watch("jobTitle");
  const category = watch("category");
  const description = watch("description");
  const location = watch("location");
  const budgetType = watch("budgetType") || 'fixed';
  const budgetMin = watch("budgetMin");
  const budgetMax = watch("budgetMax");
  const scheduleStartDate = watch("scheduleStartDate");
  const scheduleEndDate = watch("scheduleEndDate");
  const scheduleTimeFrom = watch("scheduleTimeFrom");
  const scheduleTimeTo = watch("scheduleTimeTo");

  const formatDateRange = () => {
    if (!scheduleStartDate) return 'Not set';
    const startDateStr = formatDateToLocal(scheduleStartDate, true);
    if (scheduleEndDate) {
      const endDateStr = formatDateToLocal(scheduleEndDate, true);
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
    const min = parseFloat(budgetMin).toLocaleString();
    if (budgetMax && budgetMax !== budgetMin) {
      const max = parseFloat(budgetMax).toLocaleString();
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
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <div className="px-4 pt-4 pb-16 md:pb-6">
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
              <h6 className="text-xs md:text-sm mt-1 break-words">
                <span className="text-savoy-blue font-medium">Category:</span>{' '}
                <span className="text-indigo-dye">{category}</span>
              </h6>
            )}
            {location && (
              <p className="text-xs md:text-sm text-indigo-dye mt-1 break-words">
                {location}
              </p>
            )}
          </div>
        </div>

        {/* Job Details Section */}
        <div className="border-t border-gray-300 my-4 pt-4">
          <h5 className="text-lg md:text-xl font-semibold text-indigo-dye mb-3">Job Details</h5>
          <div className="details mt-2 space-y-3">
            {/* Description */}
            {description && (
              <div>
                <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
                  <ClipboardDocumentIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                  Description
                </h6>
                <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px] whitespace-pre-wrap break-words">
                  {description}
                </p>
              </div>
            )}

            {/* Contract Period */}
            {scheduleStartDate && (
              <div>
                <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
                  <CalendarIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                  Contract Period
                </h6>
                <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]">
                  {formatDateRange()}
                </p>
              </div>
            )}

            {/* Time */}
            {scheduleTimeFrom && (
              <div>
                <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
                  <ClockIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                  Work Hours
                </h6>
                <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]">
                  {formatTimeRange()}
                </p>
              </div>
            )}

            {/* Budget */}
            {budgetMin && (
              <div>
                <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
                  <CurrencyDollarIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                  {budgetType === 'fixed' ? 'Budget' : 'Rate per Hour'}
                </h6>
                <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]">
                  {formatPriceRange()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <hr />
      <div className="flex justify-between py-4 px-4">
        <button
          type="button"
          className="w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setSelectedTab(2)}
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading && (
            <div role="status" className="inline-flex items-center">
              <svg
                aria-hidden="true"
                className="inline w-6 h-6 mr-2 text-gray-200 animate-spin fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
          {!isLoading && "Post Job"}
        </button>
      </div>
    </form>
  );
}