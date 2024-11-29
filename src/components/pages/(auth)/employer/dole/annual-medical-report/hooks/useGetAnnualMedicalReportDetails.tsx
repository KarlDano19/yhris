import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function getAnnualMedicalReportDetails(
  annual_medical_report_id: number | null
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/annual-medical-reports/${annual_medical_report_id}/`,
      config
    );
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, "response")) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useGetAnnualMedicalReportDetails(
  annual_medical_report_id: number | null
) {
  const query = useQuery(
    ["annualMedicalReportDetailsCache"],
    () =>
      getAnnualMedicalReportDetails(annual_medical_report_id),
    { enabled: false, refetchOnWindowFocus: false, keepPreviousData: true }
  );
  return query;
}

export default useGetAnnualMedicalReportDetails;
