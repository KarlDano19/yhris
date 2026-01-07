import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface BusinessJobFilters {
  category?: string;
  location?: string | string[];
  date_from?: string;
  date_to?: string;
  min_budget?: number;
  max_budget?: number;
  is_urgent?: boolean;
  latitude?: number;
  longitude?: number;
  order_by?: string;
  current_page?: number;
  page_size?: number;
  status?: string;
}

/**
 * Unified hook for fetching business jobs - supports both autocomplete suggestions and job listings
 * @param filters - Filter object containing search parameters
 * @param mode - 'autocomplete' for suggestions, 'listing' for job listings with infinite scroll
 */
async function fetchBusinessJobs(filters: BusinessJobFilters | null, pageParam: number = 1, mode: 'autocomplete' | 'listing' = 'listing') {
  try {
    if (!filters && mode === 'autocomplete') {
      return { records: [], total_records: 0, total_pages: 0 };
    }

    const searchParams = new URLSearchParams();
    
    if (mode === 'listing') {
      // For job listings
      searchParams.append('current_page', pageParam.toString());
      searchParams.append('page_size', '200'); // 200 jobs per page for listings
      
      // Add filters
      if (filters?.category) {
        searchParams.append('category', filters.category);
      }
      if (filters?.location) {
        if (Array.isArray(filters.location)) {
          filters.location
            .filter((loc) => typeof loc === 'string' && loc.trim() !== '')
            .forEach((loc) => searchParams.append('location', loc.trim()));
        } else if (typeof filters.location === 'string' && filters.location.trim() !== '') {
          searchParams.append('location', filters.location.trim());
        }
      }
      if (filters?.date_from) {
        searchParams.append('date_from', filters.date_from);
      }
      if (filters?.date_to) {
        searchParams.append('date_to', filters.date_to);
      }
      if (filters?.min_budget !== undefined) {
        searchParams.append('min_budget', filters.min_budget.toString());
      }
      if (filters?.max_budget !== undefined) {
        searchParams.append('max_budget', filters.max_budget.toString());
      }
      if (filters?.is_urgent !== undefined) {
        searchParams.append('is_urgent', filters.is_urgent.toString());
      }
      if (filters?.latitude !== undefined) {
        searchParams.append('latitude', filters.latitude.toString());
      }
      if (filters?.longitude !== undefined) {
        searchParams.append('longitude', filters.longitude.toString());
      }
      if (filters?.order_by) {
        searchParams.append('order_by', filters.order_by);
      }
      if (filters?.status) {
        searchParams.append('status', filters.status);
      }
    } else {
      // For autocomplete mode (if needed in future)
      if (filters) {
        if (filters.category) {
          searchParams.append('category', filters.category);
        }
        if (filters.location) {
          if (Array.isArray(filters.location)) {
            filters.location
              .filter((loc) => typeof loc === 'string' && loc.trim() !== '')
              .forEach((loc) => searchParams.append('location', loc.trim()));
          } else if (typeof filters.location === 'string' && filters.location.trim() !== '') {
            searchParams.append('location', filters.location.trim());
          }
        }
        searchParams.append('current_page', (filters.current_page || 1).toString());
        searchParams.append('page_size', (filters.page_size || 200).toString());
      }
    }
    
    // Get authentication token (optional for business jobs, but recommended)
    const token = getCookie('token');
    
    const config: any = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    
    const queryString = searchParams.toString();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/business-jobs/${queryString ? `?${queryString}` : ''}`;
    
    const res = await fetch(url, config);
    if (!res.ok) {
      throw res.json();
    }
    const responseData = await res.json();
    
    // Handle response structure
    const data = responseData.records ? responseData : (responseData.data || responseData);
    
    if (mode === 'listing') {
      // Return data in format expected by useInfiniteQuery
      const totalPages = data.total_pages || 1;
      const nextPage = pageParam < totalPages ? pageParam + 1 : undefined;
      
      return {
        records: data.records || [],
        total_records: data.total_records || 0,
        total_pages: totalPages,
        current_page: pageParam,
        nextPage: nextPage,
      };
    } else {
      // Return autocomplete format
      return {
        records: data.records || [],
        total_records: data.total_records || 0,
        total_pages: data.total_pages || 1,
      };
    }
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

/**
 * Hook for fetching business job listings with infinite scroll
 */
function useFindBusinessJobs(itemsFilter: BusinessJobFilters | null) {
  const query = useInfiniteQuery(
    [
      'findBusinessJobsCache',
      itemsFilter?.category,
      Array.isArray(itemsFilter?.location)
        ? itemsFilter?.location.join('|')
        : itemsFilter?.location,
      itemsFilter?.is_urgent,
      itemsFilter?.status,
    ], 
    ({ pageParam = 1 }) => fetchBusinessJobs(itemsFilter, pageParam, 'listing'),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: true, // Enable initial fetch to show jobs on page load
    }
  );

  // Flatten all pages into a single array
  const allJobs = query.data?.pages.flatMap(page => page.records) || [];
  const totalRecords = query.data?.pages[0]?.total_records || 0;

  // Create a manual search function that resets to page 1
  const searchWithFilter = async (currentFilter: BusinessJobFilters | null) => {
    const result = await fetchBusinessJobs(currentFilter, 1, 'listing');
    return result.records;
  };

  return {
    ...query,
    data: allJobs,
    totalRecords,
    searchWithFilter
  };
}

/**
 * Hook for fetching autocomplete suggestions (categories or locations)
 */
function useGetBusinessJobAutocomplete(filters: BusinessJobFilters | null) {
  // Normalize search term: trim spaces and check if it's meaningful
  const normalizedSearch = filters?.location?.toString().trim();
  const hasValidSearch = normalizedSearch && normalizedSearch.length >= 2;
  
  // Allow API call even without search to load initial suggestions (200 per page)
  // Only skip if filters is explicitly null (disabled state)
  const shouldMakeApiCall = filters !== null;
  
  // Create normalized filters for consistent cache keys
  const normalizedFilters = filters ? {
    ...filters,
    location: hasValidSearch ? normalizedSearch : undefined
  } : filters;
  
  const query = useQuery(
    ['businessJobAutocompleteCache', normalizedFilters], 
    () => fetchBusinessJobs(normalizedFilters, 1, 'autocomplete'), 
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: shouldMakeApiCall,
      staleTime: 5 * 60 * 1000, // 5 minutes cache for autocomplete
      cacheTime: Infinity,
    }
  );

  return query;
}

export default useFindBusinessJobs;
export { useGetBusinessJobAutocomplete };

