import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function updateAnnualMedicalReport(data: any, annual_medical_report_id: number | null) {
  try {
    const token = getCookie("token");
    const formData = new FormData();

    if (data.date_of_report) {
        const reportDate = new Date(data.date_of_report);
        if (!isNaN(reportDate.getTime())) {
            data.date_of_report = reportDate.toISOString().split("T")[0];
        }
    }

    for (const key in data) {
        if (key !== 'signature' && key !== 'noted_signature') {
            formData.append(key, data[key]);
        }
    }

    if (data.signature && data.signature.length) {
        const signatureBlob = await fetch(`${data.signature}`).then((res) => res.blob());
        formData.append('signature', signatureBlob, 'signature.jpg');
    }

    if (data.noted_signature && data.noted_signature.length) {
        const notedSignatureBlob = await fetch(`${data.noted_signature}`).then((res) => res.blob());
        formData.append('noted_signature', notedSignatureBlob, 'noted_signature.jpg');
    }

    const config = {
        method: "PATCH",
        headers: {
            Authorization: `Token ${token}`,
        },
        body: formData,
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

function useUpdateAnnualMedicalReport() {
  const query = useMutation((props: any) => updateAnnualMedicalReport(props.data, props.annual_medical_report_id));
  return query;
}

export default useUpdateAnnualMedicalReport;
