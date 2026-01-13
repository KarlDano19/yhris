import { useState, useEffect } from 'react';
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/24/outline';
import classNames from '@/helpers/classNames';
import {
  COMPANY_JOB_TYPES,
  WORK_SETUPS,
  SALARY_RANGES,
  GIG_CATEGORIES,
  GIG_BUDGETS,
  GIG_DURATIONS,
  TALENT_SPECIALIZATIONS,
  TALENT_AVAILABILITIES,
  TALENT_HOURLY_RATES,
} from '../hooks/dummyJobFilter';

type TabType = 'company-jobs' | 'gig-opportunities' | 'hire-talent';

type CompanyJobFilters = {
  jobType: string;
  workSetup: string;
  salaryRange: string;
};

type GigFilters = {
  category: string;
  budget: string;
  duration: string;
};

type TalentFilters = {
  specialization: string;
  availability: string;
  hourlyRate: string;
};

type Filters = CompanyJobFilters | GigFilters | TalentFilters;

interface JobFilterProps {
  activeTab: TabType;
  filteredCount?: number;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onApplyFilters: (filters: Filters) => void;
}

const JobFilter = ({ 
  activeTab, 
  filteredCount = 0,
  filters,
  onFiltersChange,
  onApplyFilters
}: JobFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);
  
  // Local state for pending filter changes (before Apply is clicked)
  const [pendingFilters, setPendingFilters] = useState<Filters>(filters);

  // Update pending filters when filters prop changes (but only when filter panel is closed or tab changes)
  useEffect(() => {
    if (!showFilters) {
      setPendingFilters(filters);
    }
  }, [filters, showFilters, activeTab]);

  // Reset filter panel when tab changes
  useEffect(() => {
    setShowFilters(false);
    setPendingFilters(filters);
  }, [activeTab]);

  const getFoundCounterText = () => {
    switch (activeTab) {
      case 'company-jobs':
        return `${filteredCount} opportunities found`;
      case 'gig-opportunities':
        return `${filteredCount} opportunities found`;
      case 'hire-talent':
        return `${filteredCount} professionals found`;
      default:
        return `${filteredCount} found`;
    }
  };

  const handleClearFilters = () => {
    if (activeTab === 'company-jobs') {
      const clearedFilters: CompanyJobFilters = {
        jobType: 'All Types',
        workSetup: 'All Setups',
        salaryRange: 'Any Salary',
      };
      setPendingFilters(clearedFilters);
      onFiltersChange(clearedFilters);
    } else if (activeTab === 'gig-opportunities') {
      const clearedFilters: GigFilters = {
        category: 'All Categories',
        budget: 'Any Budget',
        duration: 'Any Duration',
      };
      setPendingFilters(clearedFilters);
      onFiltersChange(clearedFilters);
    } else if (activeTab === 'hire-talent') {
      const clearedFilters: TalentFilters = {
        specialization: 'All Specializations',
        availability: 'Any Availability',
        hourlyRate: 'Any Rate',
      };
      setPendingFilters(clearedFilters);
      onFiltersChange(clearedFilters);
    }
  };

  const handleApplyFilters = () => {
    onApplyFilters(pendingFilters);
    setShowFilters(false);
  };

  const renderCompanyJobFilters = () => {
    const companyFilters = pendingFilters as CompanyJobFilters;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
          <div className="relative">
            <select
              value={companyFilters.jobType}
              onChange={(e) => setPendingFilters({ ...companyFilters, jobType: e.target.value })}
              className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm text-gray-900 focus:ring-2 focus:ring-savoy-blue focus:border-savoy-blue appearance-none"
            >
              {COMPANY_JOB_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Work Setup</label>
          <div className="relative">
            <select
              value={companyFilters.workSetup}
              onChange={(e) => setPendingFilters({ ...companyFilters, workSetup: e.target.value })}
              className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm text-gray-900 focus:ring-2 focus:ring-savoy-blue focus:border-savoy-blue appearance-none"
            >
              {WORK_SETUPS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
          <div className="relative">
            <select
              value={companyFilters.salaryRange}
              onChange={(e) => setPendingFilters({ ...companyFilters, salaryRange: e.target.value })}
              className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm text-gray-900 focus:ring-2 focus:ring-savoy-blue focus:border-savoy-blue appearance-none"
            >
              {SALARY_RANGES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    );
  };

  const renderGigFilters = () => {
    const gigFilters = pendingFilters as GigFilters;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <div className="relative">
            <select
              value={gigFilters.category}
              onChange={(e) => setPendingFilters({ ...gigFilters, category: e.target.value })}
              className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm text-gray-900 focus:ring-2 focus:ring-savoy-blue focus:border-savoy-blue appearance-none"
            >
              {GIG_CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
          <div className="relative">
            <select
              value={gigFilters.budget}
              onChange={(e) => setPendingFilters({ ...gigFilters, budget: e.target.value })}
              className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm text-gray-900 focus:ring-2 focus:ring-savoy-blue focus:border-savoy-blue appearance-none"
            >
              {GIG_BUDGETS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <div className="relative">
            <select
              value={gigFilters.duration}
              onChange={(e) => setPendingFilters({ ...gigFilters, duration: e.target.value })}
              className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm text-gray-900 focus:ring-2 focus:ring-savoy-blue focus:border-savoy-blue appearance-none"
            >
              {GIG_DURATIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    );
  };

  const renderTalentFilters = () => {
    const talentFilters = pendingFilters as TalentFilters;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
          <div className="relative">
            <select
              value={talentFilters.specialization}
              onChange={(e) => setPendingFilters({ ...talentFilters, specialization: e.target.value })}
              className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm text-gray-900 focus:ring-2 focus:ring-savoy-blue focus:border-savoy-blue appearance-none"
            >
              {TALENT_SPECIALIZATIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
          <div className="relative">
            <select
              value={talentFilters.availability}
              onChange={(e) => setPendingFilters({ ...talentFilters, availability: e.target.value })}
              className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm text-gray-900 focus:ring-2 focus:ring-savoy-blue focus:border-savoy-blue appearance-none"
            >
              {TALENT_AVAILABILITIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
          <div className="relative">
            <select
              value={talentFilters.hourlyRate}
              onChange={(e) => setPendingFilters({ ...talentFilters, hourlyRate: e.target.value })}
              className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm text-gray-900 focus:ring-2 focus:ring-savoy-blue focus:border-savoy-blue appearance-none"
            >
              {TALENT_HOURLY_RATES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl px-4 sm:px-6 mx-auto">
      <div className="px-4 lg:px-5">
        {/* Found Counter and Filter Button */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-600">
            {getFoundCounterText()}
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={classNames(
              'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
              showFilters
                ? 'bg-savoy-blue text-white'
                : 'bg-savoy-blue text-white hover:bg-indigo-600'
            )}
          >
            <FunnelIcon className="h-4 w-4" />
            Filters
            <ChevronDownIcon
              className={classNames(
                'h-4 w-4 transition-transform',
                showFilters ? 'rotate-180' : ''
              )}
            />
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Filter Results</h3>
              <button
                onClick={handleClearFilters}
                className="text-sm text-savoy-blue hover:text-indigo-700"
              >
                Clear all
              </button>
            </div>
            
            <div>
              {activeTab === 'company-jobs' && renderCompanyJobFilters()}
              {activeTab === 'gig-opportunities' && renderGigFilters()}
              {activeTab === 'hire-talent' && renderTalentFilters()}
              
              {/* Apply Button - positioned at bottom right under 2nd column */}
              <div className="flex justify-end mt-4 md:grid md:grid-cols-2 md:gap-4">
                <div></div>
                <div className="flex justify-end">
                  <button
                    onClick={handleApplyFilters}
                    className="px-6 py-2 bg-savoy-blue text-white text-sm font-medium rounded-md hover:bg-indigo-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobFilter;

