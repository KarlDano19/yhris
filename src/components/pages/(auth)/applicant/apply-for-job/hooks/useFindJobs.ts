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
 * Fetch jobs for infinite scroll listing (similar to notifications pattern)
 */
async function fetchJobsListing({ 
  pageParam = 1, 
  filters = {} 
}: { 
  pageParam?: number; 
  filters?: JobFilters 
}) {
  const searchParams = new URLSearchParams({
    current_page: String(pageParam),
    page_size: String(filters.page_size || 10),
  });

  // Handle job title search
  if (filters.job_title) {
    searchParams.append('search_type', 'job_title');
    searchParams.append('search', filters.job_title);
  }

  // Handle location filter (can be string or array)
  if (filters.location) {
    if (Array.isArray(filters.location)) {
      filters.location
        .filter((loc) => typeof loc === 'string' && loc.trim() !== '')
        .forEach((loc) => searchParams.append('location', loc.trim()));
    } else if (typeof filters.location === 'string' && filters.location.trim() !== '') {
      searchParams.append('location', filters.location.trim());
    }
  }

  const config = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/public/jobs/?${searchParams}`,
    config
  );

  if (!res.ok) {
    throw await res.json();
  }

  const data = await res.json();
  
  // Handle response structure (might be wrapped in data key)
  const responseData = data.records ? data : data.data || data;

  return {
    records: responseData.records || [],
    total_records: responseData.total_records || 0,
    total_pages: responseData.total_pages || 1,
    current_page: pageParam,
  };
}

/**
 * Fetch jobs for autocomplete suggestions
 */
async function fetchJobsAutocomplete(filters: JobFilters | null) {
  try {
    if (!filters) {
      return { records: [], total_records: 0, total_pages: 0 };
    }

    const searchParams = new URLSearchParams();
    
    if (filters.view_type === 'location_select') {
      searchParams.append('view_type', 'location_select');
      searchParams.append('search_type', filters.search_type || 'location');
      if (filters.search) {
        searchParams.append('search', filters.search);
      }
      searchParams.append('current_page', (filters.current_page || 1).toString());
      searchParams.append('page_size', (filters.page_size || 200).toString());
    } else {
      // Job title autocomplete
      searchParams.append('view_type', 'jobs_select');
      searchParams.append('search_type', filters.search_type || 'job_title');
      if (filters.search) {
        searchParams.append('search', filters.search);
      }
      searchParams.append('current_page', (filters.current_page || 1).toString());
      searchParams.append('page_size', (filters.page_size || 200).toString());
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
    
    return {
      records: data.records || [],
      total_records: data.total_records || 0,
      total_pages: data.total_pages || 1,
    };
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

/**
 * Hook for fetching job listings with infinite scroll (notification pattern)
 */
function useFindJobs(filters: JobFilters = {}) {
  const query = useInfiniteQuery(
    [
      'findJobsPublicCache',
      filters.job_title,
      Array.isArray(filters.location)
        ? filters.location.join('|')
        : filters.location,
      filters.page_size,
    ],
    ({ pageParam = 1 }) => fetchJobsListing({ pageParam, filters }),
    {
      getNextPageParam: (lastPage) => {
        // Check if there are more pages (like notifications)
        if (lastPage && lastPage.current_page < lastPage.total_pages) {
          return lastPage.current_page + 1;
        }
        return undefined;
      },
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  // Flatten all pages into a single array (like notifications)
  const allJobs = query.data?.pages.flatMap((page) => page?.records || []) || [];
  const totalRecords = query.data?.pages[0]?.total_records || 0;

  return {
    ...query,
    // Flattened data for convenience
    data: allJobs,
    totalRecords,
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
    () => fetchJobsAutocomplete(normalizedFilters), 
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
export type { JobFilters };
