import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getEmployerApplicantChat(appliedJobId?: number) {
  if (!appliedJobId) return null;

  try {
    const token = getCookie('token');
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    if (token) {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/employer-applicant-chat/?applied_job_id=${appliedJobId}`;
      const res = await fetch(url, config);

      if (!res.ok) {
        throw res.json();
      }

      const responseData = await res.json();
      return responseData.data || responseData;
    }
    return null;
  } catch (error: any) {
    let errStringify = await error;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.detail;
    }
    if (Object.hasOwn(errStringify, 'detail')) {
      throw errStringify;
    }
    throw errStringify.message;
  }
}

function useGetEmployerApplicantChat(appliedJobId?: number, enabled: boolean = true) {
  const query = useQuery(
    ['employerApplicantChatCache', appliedJobId],
    () => getEmployerApplicantChat(appliedJobId),
    {
      enabled: enabled && !!appliedJobId,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return query;
}

export default useGetEmployerApplicantChat;
