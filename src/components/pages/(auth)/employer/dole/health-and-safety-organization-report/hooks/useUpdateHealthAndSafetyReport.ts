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

    // Check if any file fields are present
    const hasFiles = data.policy_and_program_file || data.technical_information_file || data.signature;
    
    if (hasFiles) {
      const formData = new FormData();
      
      // Handle policy_and_program_file
      if (data.policy_and_program_file) {
        if (data.policy_and_program_file instanceof File) {
          formData.append("policy_and_program_file", data.policy_and_program_file);
        } else if (data.policy_and_program_file.length > 0) {
          formData.append("policy_and_program_file", data.policy_and_program_file[0]);
        }
      }
      
      // Handle technical_information_file
      if (data.technical_information_file) {
        if (data.technical_information_file instanceof File) {
          formData.append("technical_information_file", data.technical_information_file);
        } else if (data.technical_information_file.length > 0) {
          formData.append("technical_information_file", data.technical_information_file[0]);
        }
      }
      
      // Handle signature (matching annual accident illness pattern)
      if (data.signature) {
        if (data.signature instanceof File) {
          // If it's already a File object, use it directly
          formData.append('signature', data.signature);
        } else if (typeof data.signature === 'string' && data.signature.startsWith('data:')) {
          // If it's a data URL (from drawing)
          const signatureBlob = await fetch(data.signature).then((res) => res.blob());
          formData.append('signature', signatureBlob, 'signature.png');
        } else if (typeof data.signature === 'string' && data.signature.startsWith('http')) {
          // If it's an existing URL, skip it (don't append to FormData)
        }
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
      method: "PATCH",
      headers: {
        Authorization: `Token ${token}`,
        // Don't set content-type for FormData, let the browser set it with boundary
        ...(data instanceof FormData ? {} : { "Content-Type": "application/json" }),
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
