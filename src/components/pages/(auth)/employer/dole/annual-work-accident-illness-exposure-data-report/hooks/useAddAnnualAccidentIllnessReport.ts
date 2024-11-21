import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function addAnnualAccidentIllnessReport(data: any) {
  try {
    const token = getCookie("token");

    if (data.date_of_report) {
      const reportDate = new Date(data.date_of_report);
      if (!isNaN(reportDate.getTime())) {
        data.date_of_report = reportDate.toISOString().split("T")[0];
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
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: data instanceof FormData ? data : JSON.stringify(data),
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/annual-work-accident-illness-reports/`,
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

function useAddAnnualAccidentIllnessReport() {
  const query = useMutation((data: any) =>
    addAnnualAccidentIllnessReport(data)
  );
  return query;
}

export default useAddAnnualAccidentIllnessReport;
