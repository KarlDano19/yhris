import { useInfiniteQuery } from '@tanstack/react-query';

async function findJobs(itemsFilter: any, pageParam: number = 1) {
  try {
    const searchParams = new URLSearchParams();
    
    // Only add parameters if they have values
    if (itemsFilter.job_title) {
      searchParams.append('job_title', itemsFilter.job_title);
    }
    if (itemsFilter.location) {
      searchParams.append('location', itemsFilter.location);
    }
    
    // Add pagination parameters
    searchParams.append('currentPage', pageParam.toString());
    searchParams.append('pageSize', '20');
    
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
    
    // Handle response structure - check if data is wrapped
    const data = responseData.records ? responseData : (responseData.data || responseData);
    
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
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useFindJobs(itemsFilter: any) {
  const query = useInfiniteQuery(
    ['findJobsPublicCache', itemsFilter.job_title, itemsFilter.location], 
    ({ pageParam = 1 }) => findJobs(itemsFilter, pageParam),
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
  const searchWithFilter = async (currentFilter: any) => {
    const result = await findJobs(currentFilter, 1);
    return result.records;
  };

  return {
    ...query,
    data: allJobs,
    totalRecords,
    searchWithFilter
  };
}

export default useFindJobs;
