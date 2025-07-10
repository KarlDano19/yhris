import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function addWorkEnvironmentRequest(data: any) {
  try {
    const token = getCookie("token");

    if (data.date_of_application) {
      const applicationDate = new Date(data.date_of_application);
      if (!isNaN(applicationDate.getTime())) {
        // Adjust for timezone offset to preserve local date
        const offset = applicationDate.getTimezoneOffset();
        const adjustedDate = new Date(applicationDate.getTime() - offset * 60000);
        data.date_of_application = adjustedDate.toISOString().split("T")[0];
      }
    }

    if (data.last_wem_date) {
      const lastWemDate = new Date(data.last_wem_date);
      if (!isNaN(lastWemDate.getTime())) {
        // Adjust for timezone offset to preserve local date
        const offset = lastWemDate.getTimezoneOffset();
        const adjustedDate = new Date(lastWemDate.getTime() - offset * 60000);
        data.last_wem_date = adjustedDate.toISOString().split("T")[0];
      }
    }

    if (data.date_of_internal_monitoring) {
      const internalMonitoringDate = new Date(data.date_of_internal_monitoring);
      if (!isNaN(internalMonitoringDate.getTime())) {
        // Adjust for timezone offset to preserve local date
        const offset = internalMonitoringDate.getTimezoneOffset();
        const adjustedDate = new Date(internalMonitoringDate.getTime() - offset * 60000);
        data.date_of_internal_monitoring = adjustedDate.toISOString().split("T")[0];
      }
    }

    // Always use FormData for consistency
    const formData = new FormData();
    
    // Handle signature if present
    if (data.signature) {
      if (data.signature instanceof File) {
        // If it's already a File object, use it directly
        formData.append('signature', data.signature);
      } else if (typeof data.signature === 'string' && data.signature.startsWith('data:')) {
        // If it's a data URL (from drawing)
        const signatureBlob = await fetch(data.signature).then((res) => res.blob());
        formData.append('signature', signatureBlob, 'signature.png');
      }
    }
    
    // Add all other form fields
    for (const key in data) {
      if (key !== 'signature') {
        formData.append(key, data[key]);
      }
    }

    const config = {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/work-environment-measures/`,
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

function useAddWorkEnvironmentRequest() {
  const query = useMutation((data: any) => addWorkEnvironmentRequest(data));
  return query;
}

export default useAddWorkEnvironmentRequest;
