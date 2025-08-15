import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export async function sendEmail(data: any) {
  try {
    const token = getCookie("token");
    
    // Check if data is already FormData (from modal) or needs to be converted
    let formData: FormData;
    
    if (data instanceof FormData) {
      // Data is already FormData, use it directly
      formData = data;
    } else {
      // Convert object to FormData
      formData = new FormData();
      formData.append("subject", data.subject);
      formData.append("context", data.message);
      formData.append("to", JSON.stringify(data.to));
      formData.append("cc", JSON.stringify(data.cc || []));
      formData.append("bcc", JSON.stringify(data.bcc || []));
      
      // Add attachment if provided
      if (data.attachment && data.attachment instanceof File) {
        formData.append("attachment", data.attachment);
      }
      
      // Add annual_work_accident_illness_report_id if provided
      if (data.annual_work_accident_illness_report_id) {
        formData.append("annual_work_accident_illness_report_id", data.annual_work_accident_illness_report_id.toString());
      }
    }
    
    const config = {
      method: "PATCH",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    };
    
    if (token) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/annual-work-accident-illness-reports/send-email/`,
        config
      );
      if (!res.ok) {
        throw res.json();
      }
      return;
    }
    return {};
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, "response")) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useSendEmail() {
  const query = useMutation((data: any) => sendEmail(data));
  return query;
}

export default useSendEmail;
