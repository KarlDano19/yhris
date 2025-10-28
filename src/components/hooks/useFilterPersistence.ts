import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting filter state in React Query cache
 * @param key - Unique key for the filter state (e.g., 'screen-applicants', 'orient')
 * @param defaultValue - Default filter values
 * @returns [filters, setFilters] - Filter state and setter function
 */
export const useFilterPersistence = <T>(key: string, defaultValue: T) => {
  const queryClient = useQueryClient();
  const cacheKey = ['filterState', key];

  // Initialize filters from cache or defaults
  const [filters, setFilters] = useState<T>(() => {
    const cached = queryClient.getQueryData<T>(cacheKey);
    return cached ?? defaultValue;
  });

  // Save filters to cache whenever they change
  useEffect(() => {
    queryClient.setQueryData(cacheKey, filters);
  }, [filters, queryClient, cacheKey]);

  return [filters, setFilters] as const;
};

/**
 * Hook for clearing filter state from cache
 * @param key - Unique key for the filter state
 */
export const useClearFilterPersistence = (key: string) => {
  const queryClient = useQueryClient();
  const cacheKey = ['filterState', key];

  const clearFilters = () => {
    queryClient.removeQueries(cacheKey);
  };

  return clearFilters;
};

/**
 * Hook for getting filter state without setting up persistence
 * @param key - Unique key for the filter state
 * @param defaultValue - Default filter values
 * @returns filters - Current filter state
 */
export const useGetFilterState = <T>(key: string, defaultValue: T): T => {
  const queryClient = useQueryClient();
  const cacheKey = ['filterState', key];

  const cached = queryClient.getQueryData<T>(cacheKey);
  return cached ?? defaultValue;
};