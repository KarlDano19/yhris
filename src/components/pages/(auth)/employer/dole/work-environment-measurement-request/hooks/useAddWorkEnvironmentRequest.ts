import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function addWorkEnvironmentRequest(data: any) {
  try {
    const token = getCookie("token");

    if (data.date_of_application) {
      const applicationDate = new Date(data.date_of_application);
      if (!isNaN(applicationDate.getTime())) {
        data.date_of_application = applicationDate.toISOString().split("T")[0];
      }
    }

    if (data.last_wem_date) {
      const lastWemDate = new Date(data.last_wem_date);
      if (!isNaN(lastWemDate.getTime())) {
        data.last_wem_date = lastWemDate.toISOString().split("T")[0];
      }
    }

    if (data.date_of_internal_monitoring) {
      const internalMonitoringDate = new Date(data.date_of_internal_monitoring);
      if (!isNaN(internalMonitoringDate.getTime())) {
        data.date_of_internal_monitoring = internalMonitoringDate.toISOString().split("T")[0];
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
