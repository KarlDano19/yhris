import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function getHealthAndSafetyReportDetails(
  health_and_safety_report_id: number | null
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/health-and-safety-organization-reports/${health_and_safety_report_id}/`,
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

function useGetHealthAndSafetyReportDetails(
  health_and_safety_report_id: number | null
) {
  const query = useQuery(
    ["healthAndSafetyReportDetailsCache"],
    () =>
      getHealthAndSafetyReportDetails(health_and_safety_report_id),
    { enabled: false, refetchOnWindowFocus: false, keepPreviousData: true }
  );
  return query;
}

export default useGetHealthAndSafetyReportDetails;
