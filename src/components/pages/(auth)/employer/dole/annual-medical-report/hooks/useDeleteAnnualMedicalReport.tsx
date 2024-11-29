import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function deleteAnnualMedicalReport(
  annual_medical_report_id: number | null
) {
  try {
    const token = getCookie("token");
    const config = {
      method: "DELETE",
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

function useDeleteAnnualMedicalReport() {
  const query = useMutation((annual_medical_report_id: number | null) =>
    deleteAnnualMedicalReport(annual_medical_report_id)
  );
  return query;
}

export default useDeleteAnnualMedicalReport;
