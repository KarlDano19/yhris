import { getCookie } from "cookies-next";

export async function getPrintAnnualAccidentIllnessReportDetails(
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/annual-work-accident-illness-reports/${annual_work_accident_illness_exposure_data_report_id}/`,
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
