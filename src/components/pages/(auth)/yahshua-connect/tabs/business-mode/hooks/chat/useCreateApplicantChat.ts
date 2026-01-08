import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function createChat(data: { applicantId: number; jobPostingId?: number }) {
  try {
    const token = getCookie('token');

    const config: any = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({
        applicant_2: data.applicantId,
        ...(data.jobPostingId && { business_job_posting: data.jobPostingId }),
      }),
    };
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-chat/`;
    
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

function useCreateApplicantChat() {
  const query = useMutation((data: { applicantId: number; jobPostingId?: number }) => createChat(data));
  return query;
}

export default useCreateApplicantChat;







