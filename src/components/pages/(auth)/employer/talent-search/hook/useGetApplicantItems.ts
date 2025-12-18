import { useInfiniteQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface ApplicantFilters {
  search?: string;
  from?: string;
  to?: string;
  location?: string[];
  gender?: string;
  salary?: string;
}

interface ApplicantData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile?: string;
  address?: string;
  nationality?: string;
  religion?: string;
  civil_status?: string;
  skills?: string[]; // Updated to reflect it's an array
  education?: string;
  work_experience?: string;
  // Add other fields as needed
}

interface ApplicantResponse {
  data: ApplicantData[];
  // Add other response fields as needed
}

// Helper function to build search query from tags
const buildSearchQuery = (tags: string[], starredTags: Set<string>): string => {
  if (tags.length === 0) return '';

  const searchTerms: string[] = [];

  tags.forEach((tag) => {
    // Check if tag contains field specification (e.g., "skills:Python")
    if (tag.includes(':')) {
      // If tag is starred, make it a required term (prefixed with +)
      if (starredTags.has(tag)) {
        searchTerms.push(`+${tag}`);
      } else {
        searchTerms.push(tag);
      }
    } else {
      // For general tags without field specification, use as-is for general search
      if (starredTags.has(tag)) {
        searchTerms.push(`+${tag}`);
      } else {
        searchTerms.push(tag);
      }
    }
  });

  // Join with spaces to match backend parsing logic
  return searchTerms.join(' ');
};

async function getApplicantItems(filters: any, pageParam: number = 1) {
  try {
    let newFilters: ApplicantFilters = {};

    if (filters.search) newFilters.search = filters.search;
    if (filters.from) newFilters.from = filters.from.toLocaleDateString('en-CA');
    if (filters.to) newFilters.to = filters.to.toLocaleDateString('en-CA');
    
    // Add new filter parameters
    if (filters.location && Array.isArray(filters.location) && filters.location.length > 0) {
      newFilters.location = filters.location;
    }
    if (filters.gender && filters.gender.trim() !== '') {
      newFilters.gender = filters.gender;
    }
    if (filters.salary && filters.salary.trim() !== '') {
      newFilters.salary = filters.salary;
    }

    // Build search params, handling arrays for location
    const searchParams = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        if (key === 'location' && Array.isArray(value)) {
          // Handle location array - send each location as a separate parameter
          value.forEach(location => {
            searchParams.append('location', location);
          });
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    searchParams.append('currentPage', pageParam.toString());
    searchParams.append('pageSize', '21');

    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    if (token) {
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicants/talent-search/?${searchParams}`,
        config
      );

      if (!res.ok) {
        throw res.json();
      }

      const responseData = await res.json();
      const data = responseData.records ? responseData : responseData.data || responseData;
      const totalPages = Math.max(data.total_pages || 1, 1);

      return {
        records: data.records || [],
        total_records: data.total_records ?? data.records?.length ?? 0,
        total_pages: totalPages,
        current_page: data.current_page || pageParam,
        nextPage: pageParam < totalPages ? pageParam + 1 : undefined,
      };
    }

    return {
      records: [],
      total_records: 0,
      total_pages: 0,
      current_page: 1,
      nextPage: undefined,
    };
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetApplicantItemsList(filters: any) {
  const queryKey = [
    'applicantListItemsCache',
    filters.search || '',
    Array.isArray(filters.location) ? filters.location.join('|') : '',
    filters.gender || '',
    filters.salary || '',
    filters.from ? filters.from.toString() : '',
    filters.to ? filters.to.toString() : '',
  ];

  const query = useInfiniteQuery(
    queryKey,
    ({ pageParam = 1 }) => getApplicantItems(filters, pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  const applicants = query.data?.pages.flatMap((page: any) => page.records) || [];
  const totalRecords = query.data?.pages[0]?.total_records || 0;

  const searchWithFilter = async (currentFilter: any) => {
    const result = await getApplicantItems(currentFilter, 1);
    return result.records;
  };

  return {
    ...query,
    data: applicants,
    totalRecords,
    searchWithFilter,
  };
}

// Export the helper function for use in components
export { buildSearchQuery };

export default useGetApplicantItemsList;
