import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { headers } from 'next/headers';

async function deleteWorkAccidentIllnessReport(work_accident_illness_report_id: number | null) {
    try {
        const token = getCookie('token');
        const config = {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${token}`,
            },
        };
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/work-accident-illness-reports/${work_accident_illness_report_id}/`,
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

function useDeleteWorkAccidentIllnessReport() {
  const query = useMutation((work_accident_illness_report_id: number | null) =>
    deleteWorkAccidentIllnessReport(work_accident_illness_report_id)
  );
  return query;
}

export default useDeleteWorkAccidentIllnessReport;