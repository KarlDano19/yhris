import CustomDatePicker from '@/components/CustomDatePicker';
import Filter, { FilterGroup, FilterValues } from '@/components/common/Filter';
import PrintIcon from '@/svg/PrintIcon';
import { DateFilter } from '../../modals/types';

interface EvaluationFiltersProps {
  dateFilter: DateFilter;
  setDateFilter: (filter: DateFilter) => void;
  departmentFilter: string[];
  filterGroups: FilterGroup[];
  onDepartmentFilterChange: (filters: FilterValues) => void;
  filteredCount: number;
  totalCount: number;
  onPrintClick: () => void;
  isPrintGenerating: boolean;
  isLoadingTemplateDetails: boolean;
}

const EvaluationFilters = ({
  dateFilter,
  setDateFilter,
  departmentFilter,
  filterGroups,
  onDepartmentFilterChange,
  filteredCount,
  totalCount,
  onPrintClick,
  isPrintGenerating,
  isLoadingTemplateDetails,
}: EvaluationFiltersProps) => {
  return (
    <div className='bg-white'>
      <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4'>
        <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
          <div className='relative'>
            <CustomDatePicker
              id='modal-from-datepicker'
              placeholder='mm/dd/yyyy'
              className='appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              selected={dateFilter.from}
              pickerOnChange={(date: any) => {
                setDateFilter({ ...dateFilter, from: date });
              }}
              inputOnChange={(value: any) => {
                setDateFilter({
                  ...dateFilter,
                  from: value?.target?.value === '' ? null : value,
                });
              }}
            />
          </div>
          <p>to</p>
          <div className='relative'>
            <CustomDatePicker
              id='modal-to-datepicker'
              placeholder='mm/dd/yyyy'
              className='appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              selected={dateFilter.to}
              pickerOnChange={(date: any) => {
                setDateFilter({ ...dateFilter, to: date });
              }}
              inputOnChange={(value: any) => {
                setDateFilter({
                  ...dateFilter,
                  to: value?.target?.value === '' ? null : value,
                });
              }}
              minDate={dateFilter.from}
            />
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <div className='text-sm text-gray-600'>
            Showing {filteredCount} of {totalCount} responses
          </div>
          <Filter 
            filterGroups={filterGroups}
            defaultValues={{ departments: departmentFilter }}
            resetValues={{ departments: [''] }}
            onFilterChange={onDepartmentFilterChange}
            showButtonText={true}
            size="small"
          />
          <button
            onClick={onPrintClick}
            disabled={isPrintGenerating || isLoadingTemplateDetails}
            className='flex items-center justify-center bg-white text-black rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            title='Print template response'
          >
            {isPrintGenerating ? (
              <div className="animate-spin w-6 h-6" />
            ) : (
              <div>
                <PrintIcon/>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationFilters;


