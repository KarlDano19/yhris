import { useQuery } from '@tanstack/react-query';

async function findJobs(itemsFilter: any) {
  try {
    const jobTitle = itemsFilter.job_title;
    const location = itemsFilter.location;
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/public/jobs/?job_title=${jobTitle}&location=${location}`,
      config
    );
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
  const query = useQuery(['findJobsPublicCache'], () => findJobs(itemsFilter), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return query;
}

export default useFindJobs;
