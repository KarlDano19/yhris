import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function updateHealthAndSafetyReport(data: any, health_and_safety_report_id: number | null) {
  try {
    const token = getCookie("token");

    if (data.date_of_report) {
      const dateOfReport = new Date(data.date_of_report);
      if (!isNaN(dateOfReport.getTime())) {
        data.date_of_report = dateOfReport.toISOString().split("T")[0];
      }
    }

    if (data.signature && data.signature.length) {
      const signatureBlob = await fetch(`${data.signature}`).then((res) =>
        res.blob()
      );
      const formData = new FormData();
      formData.append("signature", signatureBlob, "signature.jpg");
      for (const key in data) {
        if (key !== "signature") {
          formData.append(key, data[key]);
        }
      }
      data = formData;
    }

    const config = {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: data instanceof FormData ? data : JSON.stringify(data),
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

function useUpdateHealthAndSafetyReport() {
  const query = useMutation((props: any) => updateHealthAndSafetyReport(props.data, props.health_and_safety_report_id));
  return query;
}

export default useUpdateHealthAndSafetyReport;
