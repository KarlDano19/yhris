import { useRef } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';

interface LocationSearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  debouncedValue: string;
  isDebouncing: boolean;
  autocompleteResults: any;
  isLoading: boolean;
  showAutocomplete: boolean;
  selectedIndex: number;
  limit: number;
  onSelectedIndexChange: (index: number) => void;
  onLimitChange: (limit: number) => void;
  onShowAutocompleteChange: (show: boolean) => void;
  onResetLimit: () => void;
  onSearchSubmit: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  selectedValues: string[];
  onSelectedValuesChange: (values: string[]) => void;
  inputId?: string;
  label?: string;
  placeholder?: string;
  inputClassName?: string;
}

const LocationSearchAutocomplete = ({
  value,
  onChange,
  debouncedValue,
  isDebouncing,
  autocompleteResults,
  isLoading,
  showAutocomplete,
  selectedIndex,
  limit,
  onSelectedIndexChange,
  onLimitChange,
  onShowAutocompleteChange,
  onResetLimit,
  onSearchSubmit,
  onFocus,
  onBlur,
  selectedValues = [],
  onSelectedValuesChange,
  inputId = 'location-search',
  label = 'Where',
  placeholder = 'Locations, Country',
  inputClassName = 'w-56 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none text-xs leading-[22px] ml-3 md:ml-0',
}: LocationSearchAutocompleteProps) => {
  const autocompleteRef = useRef<HTMLUListElement>(null);

  const updateSelections = (newSelections: string[]) => {
    onSelectedValuesChange(newSelections);
  };

  const toggleSelection = (suggestion: string) => {
    const trimmed = suggestion.trim();
    if (!trimmed) return;

    if (selectedValues.includes(trimmed)) {
      updateSelections(selectedValues.filter((value) => value !== trimmed));
    } else {
      updateSelections([...selectedValues, trimmed]);
    }
  };

  // Function to scroll selected item into view
  const scrollToSelectedItem = (index: number) => {
    if (autocompleteRef.current && index >= 0) {
      const selectedElement = autocompleteRef.current.children[index] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'auto',
          block: 'nearest',
        });
      }
    }
  };

  // Extract unique locations from records (location_select returns location/advertise_to directly)
  const getUniqueSuggestions = () => {
    if (!autocompleteResults?.records) return [];
    
    const displayItems = autocompleteResults.records.slice(0, limit);
    
    return displayItems
      .map((item: any) => item.location || item.advertise_to)
      .filter((loc: any): loc is string => typeof loc === 'string' && loc.trim() !== '');
  };

  const uniqueSuggestions = getUniqueSuggestions();
  const hasMoreResults = autocompleteResults?.total_records ? autocompleteResults.total_records > limit : false;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (showAutocomplete && selectedIndex >= 0 && autocompleteResults?.records) {
        if (selectedIndex === uniqueSuggestions.length && hasMoreResults) {
          e.preventDefault();
          onLimitChange(limit + 20);
          onSelectedIndexChange(uniqueSuggestions.length);
        } else if (uniqueSuggestions[selectedIndex]) {
          e.preventDefault();
          toggleSelection(uniqueSuggestions[selectedIndex]);
        }
      } else {
        onSearchSubmit();
        onShowAutocompleteChange(false);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (showAutocomplete && autocompleteResults?.records) {
        const maxIndex = uniqueSuggestions.length + (hasMoreResults ? 1 : 0) - 1;
        const newIndex = selectedIndex < maxIndex ? selectedIndex + 1 : selectedIndex;
        onSelectedIndexChange(newIndex);
        scrollToSelectedItem(newIndex);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (showAutocomplete) {
        const newIndex = selectedIndex > 0 ? selectedIndex - 1 : -1;
        onSelectedIndexChange(newIndex);
        if (newIndex >= 0) {
          scrollToSelectedItem(newIndex);
        }
      }
    } else if (e.key === 'Escape') {
      onShowAutocompleteChange(false);
      onSelectedIndexChange(-1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    onShowAutocompleteChange(true);
    onSelectedIndexChange(-1);
  };

  const handleInputFocus = () => {
    onFocus?.();
    onShowAutocompleteChange(true);
  };

  const handleInputBlur = () => {
    onBlur?.();
    setTimeout(() => {
      onShowAutocompleteChange(false);
      onSelectedIndexChange(-1);
      onResetLimit();
    }, 100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    toggleSelection(suggestion);
  };

  const handleShowMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLimitChange(limit + 20);
    onSelectedIndexChange(uniqueSuggestions.length + 20);
  };

  const renderAutocompleteDropdown = () => {
    if (!showAutocomplete) return null;

    // Loading state
    if (value && value.length >= 2 && (isDebouncing || isLoading)) {
      return (
        <ul
          ref={autocompleteRef}
          className='absolute left-0 top-full mt-1 z-10 bg-white border border-gray-300 rounded-md w-full max-h-60 overflow-y-auto'
          onMouseDown={(e) => e.preventDefault()}
        >
          <li className='px-3 py-4 text-center'>
            <LoadingSpinner
              size="sm"
              color="yellow"
              text="Searching locations..."
              showText={true}
              className="py-2"
            />
          </li>
        </ul>
      );
    }

    // Results found
    if (autocompleteResults?.records && autocompleteResults.records.length > 0) {
      return (
        <ul
          ref={autocompleteRef}
          className='absolute left-0 top-full mt-1 z-10 bg-white border border-gray-300 rounded-md w-full max-h-60 overflow-y-auto'
          onMouseDown={(e) => e.preventDefault()}
        >
          {uniqueSuggestions.map((suggestion: string, index: number) => (
            <li
              key={index}
              className={`px-3 py-2 cursor-pointer ${
                index === selectedIndex
                  ? 'bg-blue-100'
                  : 'hover:bg-blue-100'
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              onMouseEnter={() => onSelectedIndexChange(index)}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  tabIndex={-1}
                  readOnly
                  checked={selectedValues.includes(suggestion)}
                  className='h-4 w-4 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue'
                />
                <span className='text-sm'>{suggestion}</span>
              </div>
            </li>
          ))}
          {hasMoreResults && (
            <li
              className={`px-3 py-2 cursor-pointer border-t border-gray-200 ${
                selectedIndex === uniqueSuggestions.length
                  ? 'bg-blue-100'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={handleShowMoreClick}
              onMouseEnter={() => onSelectedIndexChange(uniqueSuggestions.length)}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
            >
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>
                  Show 20 more results
                </span>
                <span className='text-sm text-gray-600 font-medium'>
                  Click to load more
                </span>
              </div>
            </li>
          )}
        </ul>
      );
    }

    // No results found
    if (value && value.length >= 2 && autocompleteResults?.records?.length === 0) {
      return (
        <ul
          ref={autocompleteRef}
          className='absolute left-0 top-full mt-1 z-10 bg-white border border-gray-300 rounded-md w-full max-h-60 overflow-y-auto'
          onMouseDown={(e) => e.preventDefault()}
        >
          <li className='px-3 py-4 text-center'>
            <div className='flex flex-col items-center space-y-2'>
              <div className='text-sm text-gray-600'>
                <p className='font-medium'>No locations found</p>
                <p className='text-xs text-gray-500 mt-1'>
                  Try searching with different keywords
                </p>
              </div>
            </div>
          </li>
        </ul>
      );
    }

    return null;
  };

  return (
    <div className='w-full lg:w-[48%] mt-3 lg:mt-0'>
      <div className='relative'>
        <div className='flex items-center justify-around rounded-md p-3 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-black w-full'>
          <label htmlFor={inputId} className='font-semibold text-indigo-dye text-sm'>
            {label}
          </label>
          <input
            type='text'
            name={inputId}
            id={inputId}
            className={inputClassName}
            placeholder={placeholder}
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
            value={value}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
          />
        </div>
        {renderAutocompleteDropdown()}
      </div>
    </div>
  );
};

export default LocationSearchAutocomplete;

