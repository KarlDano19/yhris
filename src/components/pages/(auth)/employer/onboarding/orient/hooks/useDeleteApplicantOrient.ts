import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function deleteApplicantOrient(id: number | string) {
  try {
    const token = getCookie('token');
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/applicant-orientations/${id}/`,
      {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
          Authorization: `Token ${token}`,
        },
      }
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

function useDeleteApplicantOrient() {
  return useMutation((id: number | string) => deleteApplicantOrient(id));
}

export default useDeleteApplicantOrient;
