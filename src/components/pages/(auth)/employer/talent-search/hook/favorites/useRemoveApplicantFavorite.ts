import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function removeApplicantFavorite(applicantId: number) {
  try {
    const token = getCookie('token');
    const config = {
      method: 'DELETE',
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

function useRemoveApplicantFavorite() {
  const query = useMutation((applicantId: number) => removeApplicantFavorite(applicantId));
  return query;
}

export default useRemoveApplicantFavorite;
