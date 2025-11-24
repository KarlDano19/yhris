import { useMemo } from 'react';
import Filter, { FilterGroup, FilterValues } from '@/components/common/Filter';
import CustomDatePicker from '@/components/CustomDatePicker';
import PrintIcon from '@/svg/PrintIcon';

interface DateFilter {
  from: any;
  to: any;
}

interface EvaluationFiltersProps {
  departmentFilter: string[];
  filterGroups: FilterGroup[];
  onDepartmentFilterChange: (filters: FilterValues) => void;
  dateFilter: DateFilter;
  onDateFilterChange: (dateFilter: DateFilter) => void;
  filteredCount: number;
  totalCount: number;
  onPrintClick: () => void;
  isPrintGenerating: boolean;
  isLoadingTemplateDetails: boolean;
}

const EvaluationFilters = ({
  departmentFilter,
  filterGroups,
  onDepartmentFilterChange,
  dateFilter,
  onDateFilterChange,
  filteredCount,
  totalCount,
  onPrintClick,
  isPrintGenerating,
  isLoadingTemplateDetails,
}: EvaluationFiltersProps) => {
  // Memoize defaultValues to prevent Filter component from re-rendering unnecessarily
  const defaultValues = useMemo(() => ({ 
    departments: departmentFilter 
  }), [departmentFilter]);

  // Memoize resetValues to prevent new object reference on every render
  const resetValues = useMemo(() => ({ 
    departments: [''] 
  }), []);

  const handleDateFromChange = (date: any) => {
    if (dateFilter) onDateFilterChange({ ...dateFilter, from: date });
  };

  const handleDateToChange = (date: any) => {
    if (dateFilter) onDateFilterChange({ ...dateFilter, to: date });
    if (!dateFilter) onDateFilterChange({ from: '', to: date });
  };

  const handleDateFromInputChange = (value: any) => {
    onDateFilterChange({
      ...dateFilter,
      from: value?.target?.value === '' ? null : value,
    });
  };

  const handleDateToInputChange = (value: any) => {
    onDateFilterChange({
      ...dateFilter,
      to: value?.target?.value === '' ? null : value,
    });
  };

  return (
    <div className='bg-white'>
      <div className='flex flex-col gap-4'>
        {/* Date Range Section */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full'>
          <div className='relative flex-1 sm:flex-initial sm:w-auto w-full'>
            <CustomDatePicker
              id='date-from'
              placeholder={'mm/dd/yyyy'}
              className={
                'appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
              }
              selected={dateFilter.from}
              pickerOnChange={handleDateFromChange}
              inputOnChange={handleDateFromInputChange}
            />
          </div>
          <p className='text-gray-600 self-center sm:self-auto'>to</p>
          <div className='relative flex-1 sm:flex-initial sm:w-auto w-full'>
            <CustomDatePicker
              id='date-to'
              placeholder={'mm/dd/yyyy'}
              className={
                'appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
              }
              selected={dateFilter.to}
              pickerOnChange={handleDateToChange}
              inputOnChange={handleDateToInputChange}
              minDate={dateFilter.from}
            />
          </div>
        </div>
        
        {/* Actions Section */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4'>
          <div className='text-sm text-gray-600 whitespace-nowrap'>
            Showing {filteredCount} of {totalCount} responses
          </div>
          <div className='flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-end'>
            <button
              onClick={onPrintClick}
              disabled={isPrintGenerating || isLoadingTemplateDetails}
              className='flex items-center justify-center bg-white text-black rounded-md p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-color flex-shrink-0 h-9 w-9'
              title='Print template response'
            >
              {isPrintGenerating ? (
                <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full" />
              ) : (
                <span className="flex items-center justify-center">
                  <PrintIcon />
                </span>
              )}
            </button>
            <Filter 
              filterGroups={filterGroups}
              defaultValues={defaultValues}
              resetValues={resetValues}
              onFilterChange={onDepartmentFilterChange}
              showButtonText={true}
              size="small"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationFilters;


