import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function addHealthAndSafetyReport(data: any) {
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

    // Check if any file fields are present
    const hasFiles = data.policy_and_program_file || data.technical_information_file || data.signature;
    
    if (hasFiles) {
      const formData = new FormData();
      
      // Handle policy_and_program_file
      if (data.policy_and_program_file && data.policy_and_program_file.length > 0) {
        formData.append("policy_and_program_file", data.policy_and_program_file[0]);
      }
      
      // Handle technical_information_file
      if (data.technical_information_file && data.technical_information_file.length > 0) {
        formData.append("technical_information_file", data.technical_information_file[0]);
      }
      
      // Handle signature (existing logic)
      if (data.signature && data.signature.length) {
        const signatureBlob = await fetch(`${data.signature}`).then((res) =>
          res.blob()
        );
        formData.append("signature", signatureBlob, "signature.jpg");
      }
      
      // Add all other fields
      for (const key in data) {
        if (key !== "policy_and_program_file" && key !== "technical_information_file" && key !== "signature") {
          formData.append(key, data[key]);
        }
      }
      
      data = formData;
    }

    const config = {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        // Don't set content-type for FormData, let the browser set it with boundary
        ...(data instanceof FormData ? {} : { "content-type": "application/json" }),
      },
      body: data instanceof FormData ? data : JSON.stringify(data),
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/health-and-safety-organization-reports/`,
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

function useAddHealthAndSafetyReport() {
  const query = useMutation((data: any) => addHealthAndSafetyReport(data));
  return query;
}

export default useAddHealthAndSafetyReport;
