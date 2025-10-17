import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

interface JobSearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  isLoading?: boolean;
  onSearch?: (searchValue?: string) => void;
  onShowAutocomplete?: () => void;
}

const JobSearchAutocomplete: React.FC<JobSearchAutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'Enter job title, company, or keywords',
  suggestions = [],
  isLoading = false,
  onSearch,
  onShowAutocomplete
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [shouldShowAutocomplete, setShouldShowAutocomplete] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hideTooltip, setHideTooltip] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    // Don't automatically show autocomplete - only show when Enter is pressed
    setSelectedIndex(-1); // Reset selection when typing
    setHideTooltip(false); // Reset tooltip when user types again
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setShouldShowAutocomplete(false);
    setSelectedIndex(-1);
    // Automatically trigger search when suggestion is clicked with the specific suggestion value
    if (onSearch) {
      onSearch(suggestion);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (showSuggestions && selectedIndex >= 0 && suggestions.length > 0) {
        // Handle autocomplete selection (1st Enter with selection)
        if (selectedIndex < suggestions.length) {
          const suggestion = suggestions[selectedIndex];
          onChange(suggestion);
          setShowSuggestions(false);
          setShouldShowAutocomplete(false);
          setSelectedIndex(-1);
          // Automatically trigger search when suggestion is selected with Enter
          if (onSearch) {
            onSearch(suggestion);
          }
        }
      } else if (showSuggestions && selectedIndex === -1) {
        // 2nd Enter: No selection made, perform main search
        if (onSearch) onSearch();
        setShowSuggestions(false);
        setShouldShowAutocomplete(false);
      } else if (value && value.length >= 2) {
        // 1st Enter: Show autocomplete dropdown when Enter is pressed with valid search
        setShowSuggestions(true);
        setShouldShowAutocomplete(true);
        setHideTooltip(true); // Hide tooltip after Enter is pressed
        if (onShowAutocomplete) onShowAutocomplete();
      } else {
        // Regular search (when search is too short)
        if (onSearch) onSearch();
        setShowSuggestions(false);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        const newIndex = selectedIndex < suggestions.length - 1 ? selectedIndex + 1 : selectedIndex;
        setSelectedIndex(newIndex);
        scrollToSelectedItem(newIndex);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (showSuggestions) {
        const newIndex = selectedIndex > 0 ? selectedIndex - 1 : -1;
        setSelectedIndex(newIndex);
        if (newIndex >= 0) {
          scrollToSelectedItem(newIndex);
        }
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setShouldShowAutocomplete(false);
      setSelectedIndex(-1);
    }, 100);
  };

  const handleFocus = () => {
    // Don't automatically show autocomplete on focus
  };

  const scrollToSelectedItem = (index: number) => {
    if (suggestionRef.current && index >= 0) {
      const selectedElement = suggestionRef.current.children[index] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  };

  useEffect(() => {
    if (showSuggestions && selectedIndex >= 0 && suggestionRef.current) {
      scrollToSelectedItem(selectedIndex);
    }
  }, [selectedIndex, showSuggestions]);

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-around rounded-md p-3 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-black w-full">
        <label htmlFor="job-search" className="font-semibold text-indigo-dye text-sm">
          What
        </label>
        <input
          ref={inputRef}
          type="text"
          name="job-search"
          id="job-search"
          className="w-56 mx-3 md:px-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none text-xs leading-[23px]"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
      </div>

      {/* Show autocomplete reminder text when user has typed 2+ characters */}
      {value && value.length >= 2 && !hideTooltip && !showSuggestions && (
        <div className="absolute left-0 top-full mt-1 z-10 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 text-center w-full">
          Press <span className="font-bold">Enter</span> to show autocomplete suggestions
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && shouldShowAutocomplete && (() => {
        // Show loading state while debouncing or API loading
        if (value && value.length >= 2 && isLoading) {
          return (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              <div className="px-3 py-4 text-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Searching jobs...</p>
              </div>
            </div>
          );
        }

        // Show no results state
        if (value && value.length >= 2 && suggestions.length === 0) {
          return (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              <div className="px-3 py-4 text-center">
                <p className="text-sm text-gray-600">No job suggestions found for "{value}"</p>
              </div>
            </div>
          );
        }

        // Show suggestions
        if (suggestions.length > 0) {
          return (
            <div
              ref={suggestionRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`px-3 py-2 cursor-pointer text-sm ${
                    index === selectedIndex
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          );
        }

        // Don't show anything when no search yet
        if (!value || value.length < 2) {
          return null;
        }

        return null;
      })()}

      {/* Loading indicator */}
      {isLoading && !showSuggestions && (
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default JobSearchAutocomplete;
