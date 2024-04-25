import { useQuery } from '@tanstack/react-query';

async function findJobs(jobTitle: string, location: string) {
  try {
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

function useFindJobs(jobTitle: string, location: string) {
  const query = useQuery(
    ['findJobsCache'],
    () => findJobs(jobTitle, location),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useFindJobs;
