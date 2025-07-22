import { useState, useEffect } from 'react';

import Select from 'react-select';

import { XCircleIcon } from '@heroicons/react/24/solid';
import SelectChevronDown from '@/svg/SelectChevronDown';

// Custom Frequency Modal Component
interface CustomFrequencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (frequency: string, months?: number[], day?: number) => void;
  selectedCustomFrequency: string;
  selectedCustomFrequencyValue?: string;
}

function CustomFrequencyModal({
  isOpen,
  onClose,
  onSave,
  selectedCustomFrequency,
  selectedCustomFrequencyValue
}: CustomFrequencyModalProps) {
  const [selectedFrequency, setSelectedFrequency] = useState(selectedCustomFrequency);
  const [selectedQuarter, setSelectedQuarter] = useState<string>('');
  const [selectedMonths, setSelectedMonths] = useState<number[]>([1]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [monthOptions, setMonthOptions] = useState<any[]>([]);

  // Reset state completely when modal opens to ensure we always have fresh data
  useEffect(() => {
    if (isOpen) {
      // Reset frequency first to prevent any state conflicts
      setSelectedFrequency(selectedCustomFrequency || '');
      
      // Reset quarter/half-year selection
      setSelectedQuarter('');
      
      // Handle the frequency value
      if (selectedCustomFrequencyValue) {
        try {
          const parsed = typeof selectedCustomFrequencyValue === 'string'
            ? JSON.parse(selectedCustomFrequencyValue)
            : selectedCustomFrequencyValue;
            
          if (parsed && parsed.months && parsed.day) {
            // Set months and day from the parsed value
            setSelectedMonths(Array.isArray(parsed.months) ? [...parsed.months] : [1]);
            setSelectedDay(parsed.day || 1);
            
            // Set quarter/half for quarterly/semi-annually
            if (selectedCustomFrequency === 'quarterly') {
              if (parsed.months.some((m: number) => [1,2,3].includes(m))) setSelectedQuarter('q1');
              else if (parsed.months.some((m: number) => [4,5,6].includes(m))) setSelectedQuarter('q2');
              else if (parsed.months.some((m: number) => [7,8,9].includes(m))) setSelectedQuarter('q3');
              else if (parsed.months.some((m: number) => [10,11,12].includes(m))) setSelectedQuarter('q4');
            } else if (selectedCustomFrequency === 'semi-annually') {
              if (parsed.months.some((m: number) => [1,2,3,4,5,6].includes(m))) setSelectedQuarter('h1');
              else if (parsed.months.some((m: number) => [7,8,9,10,11,12].includes(m))) setSelectedQuarter('h2');
            }
          } else {
            // Default values if parsed data is invalid
            setSelectedMonths([1]);
            setSelectedDay(1);
          }
        } catch (e) {
          console.error('Error parsing custom frequency value:', e);
          setSelectedMonths([1]);
          setSelectedDay(1);
        }
      } else {
        // Default values if no value is provided
        setSelectedMonths([1]);
        setSelectedDay(1);
      }
    }
  }, [isOpen, selectedCustomFrequency, selectedCustomFrequencyValue]);

  const handleSave = () => {
    if (selectedFrequency && selectedMonths.length > 0) {
      onSave(selectedFrequency, selectedMonths, selectedDay);
      onClose();
    }
  };

  const getQuarterOptions = () => {
    return [
      { value: 'q1', label: 'Q1: January - March' },
      { value: 'q2', label: 'Q2: April - June' },
      { value: 'q3', label: 'Q3: July - September' },
      { value: 'q4', label: 'Q4: October - December' }
    ];
  };

  const getSemiAnnualOptions = () => {
    return [
      { value: 'h1', label: 'H1: January - June' },
      { value: 'h2', label: 'H2: July - December' }
    ];
  };

  const getMonthOptionsForQuarter = (quarter: string) => {
    const quarterMonths = {
      'q1': [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' }
      ],
      'q2': [
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' }
      ],
      'q3': [
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' }
      ],
      'q4': [
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
      ]
    };
    return quarterMonths[quarter as keyof typeof quarterMonths] || [];
  };

  const getMonthOptionsForSemiAnnual = (semiAnnual: string) => {
    const semiAnnualMonths = {
      'h1': [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' }
      ],
      'h2': [
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
      ]
    };
    return semiAnnualMonths[semiAnnual as keyof typeof semiAnnualMonths] || [];
  };

  const getAllMonthOptions = () => {
    return [
      { value: 1, label: 'January' },
      { value: 2, label: 'February' },
      { value: 3, label: 'March' },
      { value: 4, label: 'April' },
      { value: 5, label: 'May' },
      { value: 6, label: 'June' },
      { value: 7, label: 'July' },
      { value: 8, label: 'August' },
      { value: 9, label: 'September' },
      { value: 10, label: 'October' },
      { value: 11, label: 'November' },
      { value: 12, label: 'December' }
    ];
  };

  const getDayOptions = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push({ value: i, label: i.toString() });
    }
    return days;
  };

  const getFrequencyDescription = () => {
    switch (selectedFrequency) {
      case 'quarterly':
        return 'Quarterly (every 3 months) - Select which quarter, then which months within that quarter';
      case 'semi-annually':
        return 'Semi-Annually (every 6 months) - Select which half-year, then which months within that half-year';
      case 'annually':
        return 'Annually (every 12 months) - Select which months to trigger';
      default:
        return '';
    }
  };

  // Update month options when quarter/semi-annual selection changes
  useEffect(() => {
    if (selectedFrequency === 'quarterly' && selectedQuarter) {
      const options = getMonthOptionsForQuarter(selectedQuarter);
      setMonthOptions(options);
      
      // Check if current selected months match this quarter's available months
      const quarterMonthValues = options.map(opt => opt.value);
      const validMonths = selectedMonths.filter(month => quarterMonthValues.includes(month));
      
      // Only update if necessary to avoid infinite loop
      if (validMonths.length === 0) {
        setSelectedMonths([options[0].value]);
      } else if (JSON.stringify(validMonths) !== JSON.stringify(selectedMonths)) {
        setSelectedMonths(validMonths);
      }
    } else if (selectedFrequency === 'semi-annually' && selectedQuarter) {
      const options = getMonthOptionsForSemiAnnual(selectedQuarter);
      setMonthOptions(options);
      
      // Check if current selected months match this half-year's available months
      const halfYearMonthValues = options.map(opt => opt.value);
      const validMonths = selectedMonths.filter(month => halfYearMonthValues.includes(month));
      
      // Only update if necessary to avoid infinite loop
      if (validMonths.length === 0) {
        setSelectedMonths([options[0].value]);
      } else if (JSON.stringify(validMonths) !== JSON.stringify(selectedMonths)) {
        setSelectedMonths(validMonths);
      }
    } else if (selectedFrequency === 'annually') {
      const options = getAllMonthOptions();
      setMonthOptions(options);
    }
  }, [selectedFrequency, selectedQuarter]); // Remove selectedMonths from dependencies

  const getScheduleSummary = () => {
    if (!selectedFrequency || selectedMonths.length === 0) return '';
    
    const monthNames = selectedMonths.map(monthValue => {
      const month = monthOptions.find(m => m.value === monthValue);
      return month ? month.label : '';
    }).filter(name => name);
    
    const frequencyText = selectedFrequency === 'quarterly' ? 'Quarterly' :
                         selectedFrequency === 'semi-annually' ? 'Semi-Annually' :
                         'Annually';
    
    return `${frequencyText} - ${monthNames.join(', ')} ${selectedDay}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative w-96 shadow-lg rounded-md bg-white">
        {/* Blue Header Bar - matching CreateEvaluationSchedulerModal style */}
        <div className="flex bg-savoy-blue p-2 items-center rounded-t-md">
          <h3 className="flex-1 text-white ml-2 font-semibold">Custom Frequency Schedule</h3>
          <XCircleIcon className="w-8 h-8 text-white cursor-pointer" onClick={onClose} />
        </div>
        
        {/* Modal Content */}
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Frequency
            </label>
            <select
              value={selectedFrequency}
              onChange={(e) => {
                setSelectedFrequency(e.target.value);
                setSelectedQuarter('');
                setSelectedDay(1);
              }}
              className="block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            >
              <option value="">Select...</option>
              <option value="quarterly">Quarterly</option>
              <option value="semi-annually">Semi-Annually</option>
              <option value="annually">Annually</option>
            </select>
            {selectedFrequency && (
              <p className="text-xs text-gray-500 mt-1">
                {getFrequencyDescription()}
              </p>
            )}
          </div>

          {selectedFrequency === 'quarterly' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Quarter
              </label>
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              >
                <option value="">Select Quarter...</option>
                {getQuarterOptions().map(quarter => (
                  <option key={quarter.value} value={quarter.value}>
                    {quarter.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedFrequency === 'semi-annually' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Half-Year
              </label>
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              >
                <option value="">Select Half-Year...</option>
                {getSemiAnnualOptions().map(semiAnnual => (
                  <option key={semiAnnual.value} value={semiAnnual.value}>
                    {semiAnnual.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {((selectedFrequency === 'quarterly' && selectedQuarter) || 
            (selectedFrequency === 'semi-annually' && selectedQuarter) || 
            selectedFrequency === 'annually') && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Months Covered
                </label>
                <Select
                  className="basic-multi-select"
                  classNamePrefix="select"
                  options={monthOptions}
                  value={monthOptions.filter((item: any) =>
                    selectedMonths.includes(item.value)
                  )}
                  onChange={(val) =>
                    setSelectedMonths(val ? val.map((item: any) => item.value) : [])
                  }
                  components={{
                    DropdownIndicator: () => (
                      <div className="pointer-events-none px-2">
                        <SelectChevronDown />
                      </div>
                    ),
                    IndicatorSeparator: () => null,
                  }}
                  isClearable={false}
                  isMulti
                  placeholder="Select months..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day of Month
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                >
                  {getDayOptions().map(day => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Schedule Summary:</strong><br />
                  {getScheduleSummary()}
                </p>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedFrequency || selectedMonths.length === 0 || 
                       (selectedFrequency !== 'annually' && !selectedQuarter)}
              className="px-4 py-2 text-sm font-medium text-white bg-savoy-blue rounded-md hover:bg-indigo-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomFrequencyModal; 