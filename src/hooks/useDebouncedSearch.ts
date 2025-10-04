import { useEffect, useState } from 'react';

interface UseDebouncedSearchProps {
  searchTerm: string;
  delay?: number;
  minLength?: number;
}

interface UseDebouncedSearchReturn {
  debouncedSearch: string;
  isDebouncing: boolean;
}

export const useDebouncedSearch = ({
  searchTerm,
  delay = 2000,
  minLength = 2
}: UseDebouncedSearchProps): UseDebouncedSearchReturn => {
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);

  useEffect(() => {
    // Set debouncing state when user is typing
    if (searchTerm && searchTerm.length >= minLength) {
      setIsDebouncing(true);
    } else {
      setIsDebouncing(false);
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setIsDebouncing(false); // Clear debouncing state when delay is done
    }, delay);

    return () => {
      clearTimeout(timer);
      // Don't clear debouncing state immediately on cleanup
    };
  }, [searchTerm, delay, minLength]);

  return {
    debouncedSearch,
    isDebouncing
  };
};

export default useDebouncedSearch;
