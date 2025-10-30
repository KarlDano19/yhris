import { useState, useRef, useEffect } from 'react';

import { Tooltip } from 'react-tooltip';

import FilterIcon from '@/svg/FilterIcon';
import SelectChevronDown from '@/svg/SelectChevronDown';

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterGroup = {
  id: string;
  title: string;
  options: FilterOption[];
  multiSelect?: boolean;
  allowEmpty?: boolean; // If false, at least one option must be selected
  displayMode?: 'checkbox' | 'dropdown'; // Display mode: checkbox/radio or dropdown select
};

export type FilterValues = {
  [key: string]: string[];
};

type FilterProps = {
  filterGroups: FilterGroup[];
  defaultValues?: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  buttonClassName?: string;
  buttonId?: string;
  size?: 'default' | 'small';
  showResetButton?: boolean;
  showApplyButton?: boolean;
  showButtonText?: boolean; // If true, shows "Filter" text. If false, shows only the icon. Defaults to true
  variant?: 'default' | 'connected'; // 'connected' removes left border radius to connect with adjacent button
};

export default function Filter({ 
  filterGroups, 
  defaultValues = {}, 
  onFilterChange,
  buttonClassName,
  buttonId = "filter-button",
  size = 'default',
  showResetButton = true,
  showApplyButton = true,
  showButtonText = true,
  variant = 'default'
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<FilterValues>({});
  const [isHovering, setIsHovering] = useState(false);
  
  // Initialize filters with default values
  const [filters, setFilters] = useState<FilterValues>(() => {
    const initialFilters: FilterValues = {};
    filterGroups.forEach(group => {
      if (defaultValues[group.id]) {
        initialFilters[group.id] = defaultValues[group.id];
      } else if (group.allowEmpty) {
        // If allowEmpty is true, start with no options selected
        initialFilters[group.id] = [];
      } else {
        // Default to all options selected
        initialFilters[group.id] = group.options.map(opt => opt.value);
      }
    });
    return initialFilters;
  });
  
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!filterRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Initialize draft filters when popover opens
  useEffect(() => {
    if (isOpen) {
      setDraftFilters(filters);
    }
  }, [isOpen, filters]);

  // Reset hover state when menu opens
  useEffect(() => {
    if (isOpen) {
      setIsHovering(false);
    }
  }, [isOpen]);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (groupId: string, value: string) => {
    const group = filterGroups.find(g => g.id === groupId);
    if (!group) return;

    const currentValues = draftFilters[groupId] || [];
    let newValues: string[];

    if (group.multiSelect !== false) {
      // Multi-select mode
      if (currentValues.includes(value)) {
        // Don't allow unchecking if this is the only option selected and allowEmpty is false
        if (!group.allowEmpty && currentValues.length === 1) {
          return;
        }
        newValues = currentValues.filter((v) => v !== value);
      } else {
        newValues = [...currentValues, value];
      }
    } else {
      // Single-select mode
      newValues = [value];
    }
    
    // Always update draft filters only
    const updatedDraftFilters = { ...draftFilters, [groupId]: newValues };
    setDraftFilters(updatedDraftFilters);
  };

  const handleApply = () => {
    setFilters(draftFilters);
    onFilterChange(draftFilters);
    setIsOpen(false);
    setIsHovering(false);
  };

  const handleReset = () => {
    const resetFilters: FilterValues = {};
    filterGroups.forEach(group => {
      if (group.allowEmpty) {
        resetFilters[group.id] = [];
      } else {
        resetFilters[group.id] = group.options.map(opt => opt.value);
      }
    });
    setDraftFilters(resetFilters);
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const defaultButtonClassName = "flex items-center gap-2 border border-gray-300 bg-white px-4 h-10 text-sm rounded-md hover:bg-gray-50";
  
  const smallButtonClassName = "flex items-center gap-2 border border-gray-300 bg-white px-3 h-10 text-sm rounded-md hover:bg-gray-50";
  
  const connectedButtonClassName = "flex items-center gap-2 border border-gray-300 bg-white px-3 h-10 text-sm rounded-r-md hover:bg-gray-50 border-l-0";

  return (
    <div className="relative" ref={filterRef}>
      <button
        id={buttonId}
        onClick={toggleFilter}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={buttonClassName || (variant === 'connected' ? connectedButtonClassName : (size === 'small' ? smallButtonClassName : defaultButtonClassName))}
        data-tooltip-id={!showButtonText && !isOpen && isHovering ? 'filter-tooltip' : undefined}
        data-tooltip-content={!showButtonText && !isOpen && isHovering ? 'Status Filter' : undefined}
        data-tooltip-place="top"
        data-tooltip-delay-show={300}
      >
        <FilterIcon />
        {showButtonText && <span className="text-gray-800 font-medium text-[16px]">Filter</span>}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Filter options"
          className="absolute z-40 mt-3 right-0 w-64 rounded-xl border border-gray-200 bg-white shadow-xl"
        >
          <div className="p-4 space-y-4">
            {filterGroups.map((group, groupIndex) => (
              <div key={group.id}>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  {group.title}
                </label>
                
                {/* Render as dropdown select if displayMode is 'dropdown' */}
                {group.displayMode === 'dropdown' ? (
                  <div className="relative">
                    <select
                      value={draftFilters[group.id]?.[0] || group.options[0]?.value}
                      onChange={(e) => handleOptionChange(group.id, e.target.value)}
                      className="w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2.5 pr-9 text-sm text-gray-700 focus:border-[#355fd0] outline-none"
                    >
                      {group.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <SelectChevronDown />
                    </div>
                  </div>
                ) : (
                  // Render as checkboxes/radio buttons (default)
                  <div className="flex flex-col gap-2">
                    {group.options.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type={group.multiSelect !== false ? 'checkbox' : 'radio'}
                          name={group.multiSelect !== false ? undefined : group.id}
                          className="rounded text-blue-500 focus:ring-blue-500"
                          checked={draftFilters[group.id]?.includes(option.value) || false}
                          onChange={() => handleOptionChange(group.id, option.value)}
                        />
                        <span className="text-sm text-gray-800">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Footer with Reset and Apply buttons */}
            <div className="pt-2 flex flex-row items-center justify-between gap-2">
              {showResetButton && (
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-[#355fd0] bg-white px-4 py-2 text-sm font-medium text-[#355fd0] hover:bg-[#355fd0]/10"
                >
                  Reset
                </button>
              )}
              {showApplyButton && (
                <button
                  onClick={handleApply}
                  className="rounded-lg bg-[#355fd0] px-5 py-2 text-sm font-semibold text-white hover:bg-[#355fd0]/90"
                >
                  Apply
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <Tooltip id='filter-tooltip' />
    </div>
  );
}

