import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function getWorkAccidentIllnessReportDetails(work_accident_illness_report_id: number | null) {
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/work-accident-illness-reports/${work_accident_illness_report_id}/`,
        config
      );
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    }
    return {};
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetWorkAccidentIllnessReportDetails(work_accident_illness_report_id: number | null) {
  const query = useQuery(
    ['workAccidentIllnessReportDetailsCache'],
    () => getWorkAccidentIllnessReportDetails(work_accident_illness_report_id),
    { enabled: false, refetchOnWindowFocus: false, keepPreviousData: true }
  );
  return query;
}

export default useGetWorkAccidentIllnessReportDetails;
