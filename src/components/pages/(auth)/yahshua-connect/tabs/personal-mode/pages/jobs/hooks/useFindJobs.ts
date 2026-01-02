import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

interface JobFilters {
  job_title?: string;
  location?: string | string[];
  search_type?: 'job_title' | 'location';
  view_type?: 'jobs_select' | 'location_select' | 'listing';
  current_page?: number;
  page_size?: number;
  search?: string;
}

/**
 * Unified hook for fetching jobs - supports both autocomplete suggestions and job listings
 * @param filters - Filter object containing search parameters
 * @param mode - 'autocomplete' for suggestions, 'listing' for job listings with infinite scroll
 */
async function fetchJobs(filters: JobFilters | null, pageParam: number = 1, mode: 'autocomplete' | 'listing' = 'listing') {
  try {
    if (!filters && mode === 'autocomplete') {
      return { records: [], total_records: 0, total_pages: 0 };
    }

    const searchParams = new URLSearchParams();
    
    if (mode === 'listing') {
      // For job listings, no view_type needed (default behavior)
      searchParams.append('current_page', pageParam.toString());
      searchParams.append('page_size', '200'); // 200 jobs per page for listings
      
      // Use new search_type + search format for job title search
      if (filters?.job_title) {
        searchParams.append('search_type', 'job_title');
        searchParams.append('search', filters.job_title);
      }
      // Location can be sent separately to allow filtering by both job_title and location
      if (filters?.location) {
        if (Array.isArray(filters.location)) {
          filters.location
            .filter((loc) => typeof loc === 'string' && loc.trim() !== '')
            .forEach((loc) => searchParams.append('location', loc.trim()));
        } else if (typeof filters.location === 'string' && filters.location.trim() !== '') {
          searchParams.append('location', filters.location.trim());
        }
      }
    } else {
      // For autocomplete mode
      if (filters?.view_type === 'location_select') {
        searchParams.append('view_type', 'location_select');
        if (filters) {
          searchParams.append('search_type', filters.search_type || 'location');
          if (filters.search) {
            searchParams.append('search', filters.search);
          }
          searchParams.append('current_page', (filters.current_page || 1).toString());
          searchParams.append('page_size', (filters.page_size || 200).toString());
        }
      } else {
        // Job title autocomplete
        searchParams.append('view_type', 'jobs_select');
        if (filters) {
          searchParams.append('search_type', filters.search_type || 'job_title');
          if (filters.search) {
            searchParams.append('search', filters.search);
          }
          searchParams.append('current_page', (filters.current_page || 1).toString());
          searchParams.append('page_size', (filters.page_size || 200).toString());
        }
      }
    }
    
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    
    const queryString = searchParams.toString();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/public/jobs/${queryString ? `?${queryString}` : ''}`;
    
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
 * Hook for fetching job listings with infinite scroll
 */
function useFindJobs(itemsFilter: JobFilters | null) {
  const query = useInfiniteQuery(
    [
      'findJobsPublicCache',
      itemsFilter?.job_title,
      Array.isArray(itemsFilter?.location)
        ? itemsFilter?.location.join('|')
        : itemsFilter?.location,
    ], 
    ({ pageParam = 1 }) => fetchJobs(itemsFilter, pageParam, 'listing'),
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
  const searchWithFilter = async (currentFilter: JobFilters | null) => {
    const result = await fetchJobs(currentFilter, 1, 'listing');
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
 * Hook for fetching autocomplete suggestions (job titles or locations)
 */
function useGetJobAutocomplete(filters: JobFilters | null) {
  // Normalize search term: trim spaces and check if it's meaningful
  const normalizedSearch = filters?.search?.trim();
  const hasValidSearch = normalizedSearch && normalizedSearch.length >= 2;
  
  // Allow API call even without search to load initial suggestions (200 per page)
  // Only skip if filters is explicitly null (disabled state)
  const shouldMakeApiCall = filters !== null;
  
  // Create normalized filters for consistent cache keys
  const normalizedFilters = filters ? {
    ...filters,
    search: hasValidSearch ? normalizedSearch : undefined
  } : filters;
  
  const query = useQuery(
    ['jobAutocompleteCache', normalizedFilters], 
    () => fetchJobs(normalizedFilters, 1, 'autocomplete'), 
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

export default useFindJobs;
export { useGetJobAutocomplete };