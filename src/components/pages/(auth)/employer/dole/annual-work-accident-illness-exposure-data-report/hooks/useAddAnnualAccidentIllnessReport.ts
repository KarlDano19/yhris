import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function addAnnualAccidentIllnessReport(data: any) {
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

    // Always use FormData when there's a signature
    let formData;
    if (data.signature) {
      formData = new FormData();
      
      // Handle different signature types
      if (data.signature instanceof File) {
        // If it's already a File object, use it directly
        formData.append('signature', data.signature);
      } else if (typeof data.signature === 'string' && data.signature.startsWith('data:')) {
        // If it's a data URL (from drawing)
        const signatureBlob = await fetch(data.signature).then((res) => res.blob());
        formData.append('signature', signatureBlob, 'signature.png');
      }
      
      // Add all other form fields
      for (const key in data) {
        if (key !== 'signature') {
          formData.append(key, data[key]);
        }
      }
    }

    const config = {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        ...(formData ? {} : { "Content-Type": "application/json" }),
      },
      body: formData || JSON.stringify(data),
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
