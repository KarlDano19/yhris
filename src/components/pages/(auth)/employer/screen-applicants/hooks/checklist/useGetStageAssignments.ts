import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getStageAssignments(stageId: number) {
  try {
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/screen-applicants/stages/${stageId}/assignments/`,
        config
      );
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return [];
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message || 'Failed to fetch stage assignments';
  }
}

function useGetStageAssignments(stageId: number) {
  const query = useQuery(
    ['stageAssignmentsCache', stageId],
    () => getStageAssignments(stageId),
    {
      enabled: !!stageId, // Only run query if stageId exists
    }
  );

  return query;
}

export default useGetStageAssignments;

