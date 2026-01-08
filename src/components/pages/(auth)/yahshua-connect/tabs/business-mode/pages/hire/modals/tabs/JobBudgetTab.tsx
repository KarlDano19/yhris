import CustomDatePicker from '@/components/CustomDatePicker';
import { ClockIcon } from '@heroicons/react/24/outline';

interface JobBudgetTabProps {
  budgetType: 'fixed' | 'hourly';
  setBudgetType: (value: 'fixed' | 'hourly') => void;
  budgetMin: string;
  setBudgetMin: (value: string) => void;
  budgetMax: string;
  setBudgetMax: (value: string) => void;
  scheduleDate: Date | null;
  setScheduleDate: (value: Date | null) => void;
  scheduleTimeFrom: string;
  setScheduleTimeFrom: (value: string) => void;
  scheduleTimeTo: string;
  setScheduleTimeTo: (value: string) => void;
  validationErrors: {
    scheduleDate?: string;
    budgetMin?: string;
    budgetMax?: string;
  };
  setValidationErrors: React.Dispatch<React.SetStateAction<{
    jobTitle?: string;
    description?: string;
    location?: string;
    scheduleDate?: string;
    budgetMin?: string;
    budgetMax?: string;
  }>>;
  onNext: () => void;
  onBack: () => void;
}

export default function JobBudgetTab({
  budgetType,
  setBudgetType,
  budgetMin,
  setBudgetMin,
  budgetMax,
  setBudgetMax,
  scheduleDate,
  setScheduleDate,
  scheduleTimeFrom,
  setScheduleTimeFrom,
  scheduleTimeTo,
  setScheduleTimeTo,
  validationErrors,
  setValidationErrors,
  onNext,
  onBack,
}: JobBudgetTabProps) {
  const handleNext = () => {
    const errors: typeof validationErrors = {};
    
    if (!scheduleDate) {
      errors.scheduleDate = 'Schedule date is required';
    }
    
    if (!budgetMin.trim()) {
      errors.budgetMin = 'Minimum amount is required';
    } else {
      const minAmount = parseFloat(budgetMin.trim());
      if (isNaN(minAmount) || minAmount <= 0) {
        errors.budgetMin = 'Minimum amount must be a valid positive number';
      } else if (budgetMax.trim()) {
        const maxAmount = parseFloat(budgetMax.trim());
        if (isNaN(maxAmount) || maxAmount <= 0) {
          errors.budgetMax = 'Maximum amount must be a valid positive number';
        } else if (maxAmount <= minAmount) {
          errors.budgetMax = 'Maximum amount must be greater than minimum amount';
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(prev => ({ ...prev, ...errors }));
      return;
    }

    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.scheduleDate;
      delete newErrors.budgetMin;
      delete newErrors.budgetMax;
      return newErrors;
    });
    onNext();
  };

  return (
    <div className="px-6 py-6">
      <div className="space-y-4">
        {/* Budget Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Type <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setBudgetType('fixed')}
              className={`flex-1 px-4 py-2 rounded-lg border text-sm transition-colors ${
                budgetType === 'fixed'
                  ? 'border-savoy-blue text-savoy-blue bg-savoy-blue/5'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              Fixed Rate
            </button>
            <button
              type="button"
              onClick={() => setBudgetType('hourly')}
              className={`flex-1 px-4 py-2 rounded-lg border text-sm transition-colors ${
                budgetType === 'hourly'
                  ? 'border-savoy-blue text-savoy-blue bg-savoy-blue/5'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              Hourly Rate
            </button>
          </div>
        </div>

        {/* Budget Amounts */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-700 mb-2">
              {budgetType === 'fixed' ? 'Min Amount (₱)' : 'Min Rate/Hour (₱)'}
            </label>
            <input
              type="text"
              id="budgetMin"
              value={budgetMin}
              onChange={(e) => {
                setBudgetMin(e.target.value);
                if (validationErrors.budgetMin) {
                  setValidationErrors(prev => ({ ...prev, budgetMin: undefined }));
                }
              }}
              placeholder="500"
              className={`block w-full rounded-lg border shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2 ${
                validationErrors.budgetMin ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.budgetMin && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.budgetMin}</p>
            )}
          </div>
          <div>
            <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-700 mb-2">
              {budgetType === 'fixed' ? 'Max Amount (₱)' : 'Max Rate/Hour (₱)'} <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              id="budgetMax"
              value={budgetMax}
              onChange={(e) => {
                setBudgetMax(e.target.value);
                if (validationErrors.budgetMax) {
                  setValidationErrors(prev => ({ ...prev, budgetMax: undefined }));
                }
              }}
              placeholder="Enter amount"
              className={`block w-full rounded-lg border shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2 ${
                validationErrors.budgetMax ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.budgetMax && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.budgetMax}</p>
            )}
          </div>
        </div>

        {/* Schedule */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule <span className="text-red-600">*</span>
          </label>
          <div className="space-y-3">
            {/* Date */}
            <div className="relative">
              <CustomDatePicker
                id="scheduleDate"
                selected={scheduleDate}
                pickerOnChange={(date: Date | null) => {
                  setScheduleDate(date);
                  if (validationErrors.scheduleDate) {
                    setValidationErrors(prev => ({ ...prev, scheduleDate: undefined }));
                  }
                }}
                inputOnChange={(date: Date | null) => {
                  setScheduleDate(date);
                  if (validationErrors.scheduleDate) {
                    setValidationErrors(prev => ({ ...prev, scheduleDate: undefined }));
                  }
                }}
                placeholder="mm/dd/yyyy"
                className={`block w-full rounded-lg border shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2 pr-10 ${
                  validationErrors.scheduleDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.scheduleDate && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.scheduleDate}</p>
              )}
            </div>

            {/* Time From and To */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="timeFrom" className="block text-xs text-gray-600 mb-1">
                  Time From
                </label>
                <div className="relative">
                  <input
                    type="time"
                    id="timeFrom"
                    value={scheduleTimeFrom}
                    onChange={(e) => setScheduleTimeFrom(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2 [&::-webkit-calendar-picker-indicator]:hidden"
                    style={{ WebkitAppearance: 'none' }}
                  />
                  <div 
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => {
                      const timeInput = document.getElementById('timeFrom') as HTMLInputElement;
                      timeInput?.showPicker();
                    }}
                  >
                    <ClockIcon className="h-5 w-5 text-savoy-blue hover:text-indigo-300" />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="timeTo" className="block text-xs text-gray-600 mb-1">
                  Time To
                </label>
                <div className="relative">
                  <input
                    type="time"
                    id="timeTo"
                    value={scheduleTimeTo}
                    onChange={(e) => setScheduleTimeTo(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2 [&::-webkit-calendar-picker-indicator]:hidden"
                    style={{ WebkitAppearance: 'none' }}
                  />
                  <div 
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => {
                      const timeInput = document.getElementById('timeTo') as HTMLInputElement;
                      timeInput?.showPicker();
                    }}
                  >
                    <ClockIcon className="h-5 w-5 text-savoy-blue hover:text-indigo-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          onClick={handleNext}
          className="inline-flex justify-center rounded-lg border border-transparent bg-savoy-blue px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
        >
          Next
        </button>
      </div>
    </div>
  );
}

