import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function updateAnnualAccidentIllnessReport(
  annual_work_accident_illness_exposure_data_report_id: string,
  data: any
) {
  try {
    const token = getCookie("token");

    if (data.date_of_report) {
      const dateOfReport = new Date(data.date_of_report);
      if (!isNaN(dateOfReport.getTime())) {
        // Adjust for timezone offset to preserve local date
        const offset = dateOfReport.getTimezoneOffset();
        const adjustedDate = new Date(dateOfReport.getTime() - offset * 60000);
        data.date_of_report = adjustedDate.toISOString().split("T")[0];
      }
    }

    if (data.date_of_application) {
      const applicationDate = new Date(data.date_of_application);
      if (!isNaN(applicationDate.getTime())) {
        data.date_of_application = applicationDate.toISOString().slice(0, 10);
      } else {
        throw new Error("Invalid date_of_application");
      }
    }

    if (data.signature && data.signature.length) {
      const signatureBlob = await fetch(`${data.signature}`).then((res) => res.blob());
      const formData = new FormData();
      formData.append('signature', signatureBlob, 'signature.jpg');
      for (const key in data) {
        if (key !== 'signature') {
          formData.append(key, data[key]);
        }
      }
      data = formData;
    }

    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Token ${token}`,
        ...(data instanceof FormData ? {} : { "content-type": "application/json" }),
      },
      body: data instanceof FormData ? data : JSON.stringify(data),
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

function useUpdateAnnualAccidentIllnessReport() {
  const query = useMutation((props: any) =>
    updateAnnualAccidentIllnessReport(
      props.annual_work_accident_illness_exposure_data_report_id,
      props.data
    )
  );
  return query;
}

export default useUpdateAnnualAccidentIllnessReport;
