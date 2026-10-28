import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export type T_ApplicantComparisonResponse = {
  applicant_ids: number[];
  applicants: any[];
};

async function createApplicantComparison(applicantIds: number[]): Promise<T_ApplicantComparisonResponse> {
  try {
    const token = getCookie('token');
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ applicant_ids: applicantIds }),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicants/compare/`, config);
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

function useCreateApplicantComparison() {
  const query = useMutation((applicantIds: number[]) => createApplicantComparison(applicantIds));
  return query;
}

export default useCreateApplicantComparison;
