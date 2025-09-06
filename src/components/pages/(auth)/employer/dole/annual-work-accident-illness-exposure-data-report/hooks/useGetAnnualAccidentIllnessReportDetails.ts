import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function getAnnualAccidentIllnessReportDetails(
  annual_work_accident_illness_exposure_data_report_id: number | null
) {
  try {
    const token = getCookie("token");
    const config = {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Token ${token}`,
      },
    };
    if (token) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/annual-work-accident-illness-reports/${annual_work_accident_illness_exposure_data_report_id}/`,
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
    if (Object.hasOwn(errStringify, "response")) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetAnnualAccidentIllnessReportDetails(
  annual_work_accident_illness_exposure_data_report_id: number | null
) {
  const query = useQuery(
    ["annualAccidentIllnessReportDetailsCache", annual_work_accident_illness_exposure_data_report_id],
    () =>
      getAnnualAccidentIllnessReportDetails(
        annual_work_accident_illness_exposure_data_report_id
      ),
    { 
      enabled: !!annual_work_accident_illness_exposure_data_report_id, 
      refetchOnWindowFocus: false, 
      keepPreviousData: true 
    }
  );
  return query;
}

export default useGetAnnualAccidentIllnessReportDetails;
