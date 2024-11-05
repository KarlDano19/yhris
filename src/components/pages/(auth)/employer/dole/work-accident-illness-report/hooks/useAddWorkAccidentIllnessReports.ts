import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function addWorkAccidentIllnessReport(data: any) {
  try {
    const token = getCookie("token");
    data.date_of_incident = data.date_of_incident.toISOString().split('T')[0]; // Change made here
    data.date_returned_to_work = data.date_returned_to_work.toISOString().split('T')[0]; // Change made here
    data.date_of_illness = data.date_of_illness.toISOString().split('T')[0]; // Change made here
    // data.time_of_incident = data.time_of_incident.toLocaleTimeString("en-CA");
    const config = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/work-accident-illness-reports/`,
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

function useAddWorkAccidentIllnessReport() {
  const query = useMutation((data: any) => addWorkAccidentIllnessReport(data));
  return query;
}

export default useAddWorkAccidentIllnessReport;
