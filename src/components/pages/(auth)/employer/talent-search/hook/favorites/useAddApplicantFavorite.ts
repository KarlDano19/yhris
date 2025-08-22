import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function addApplicantFavorite(applicantId: number) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ applicant: applicantId }),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicants/favorites/`, config);
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

function useAddApplicantFavorite() {
  const query = useMutation((applicantId: number) => addApplicantFavorite(applicantId));
  return query;
}

export default useAddApplicantFavorite; 