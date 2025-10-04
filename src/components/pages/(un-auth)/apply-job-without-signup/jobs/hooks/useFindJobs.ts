import { useQuery } from '@tanstack/react-query';

async function findJobs(itemsFilter: any) {
  try {
    const searchParams = new URLSearchParams();
    
    // Only add parameters if they have values
    if (itemsFilter.job_title) {
      searchParams.append('job_title', itemsFilter.job_title);
    }
    if (itemsFilter.location) {
      searchParams.append('location', itemsFilter.location);
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
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useFindJobs(itemsFilter: any) {
  const query = useQuery(
    ['findJobsPublicCache'], 
    () => findJobs(itemsFilter), 
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: true, // Enable initial fetch to show jobs on page load
    }
  );

  // Create a manual search function that uses current filter
  const searchWithFilter = (currentFilter: any) => {
    return findJobs(currentFilter);
  };

  return {
    ...query,
    searchWithFilter
  };
}

export default useFindJobs;
