import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getOrCreateChat(applicantId?: number, jobPostingId?: number) {
  try {
    const token = getCookie('token');

    if (!applicantId) {
      throw new Error('Applicant ID is required');
    }

    const config: any = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    };
    
    const searchParams = new URLSearchParams();
    searchParams.append('applicant_id', applicantId.toString());
    if (jobPostingId) {
      searchParams.append('business_job_posting_id', jobPostingId.toString());
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-chat/?${searchParams.toString()}`;
    
    const res = await fetch(url, config);
    if (!res.ok) {
      const error = await res.json();
      throw error;
    }
    
    const responseData = await res.json();
    return responseData.data || responseData;
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message || errStringify;
  }
}

export function useGetApplicantChat(applicantId?: number, jobPostingId?: number, enabled: boolean = true) {
  return useQuery(
    ['applicantChatCache', applicantId, jobPostingId],
    () => getOrCreateChat(applicantId, jobPostingId),
    {
      refetchOnWindowFocus: false,
      enabled: enabled && !!applicantId,
    }
  );
}
