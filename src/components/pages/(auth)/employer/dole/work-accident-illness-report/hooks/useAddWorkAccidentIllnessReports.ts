import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function addWorkAccidentIllnessReport(data: any) {
  try {
    const token = getCookie("token");
    
    if (data.date_of_incident) {
      const incidentDate = new Date(data.date_of_incident);
      if (!isNaN(incidentDate.getTime())) {
        data.date_of_incident = incidentDate.toISOString().split('T')[0];
      }
    }
    
    if (data.date_of_disability) {
      const disabilityDate = new Date(data.date_of_disability);
      if (!isNaN(disabilityDate.getTime())) {
        data.date_of_disability = disabilityDate.toISOString().split('T')[0];
      }
    }
    
    if (data.date_returned_to_work) {
      const returnedDate = new Date(data.date_returned_to_work);
      if (!isNaN(returnedDate.getTime())) {
        data.date_returned_to_work = returnedDate.toISOString().split('T')[0];
      }
    }
    
    if (data.date_returned_to_work_illness) {
      const returnedIllnessDate = new Date(data.date_returned_to_work_illness);
      if (!isNaN(returnedIllnessDate.getTime())) {
        data.date_returned_to_work_illness = returnedIllnessDate.toISOString().split('T')[0];
      }
    }
    
    if (data.date_of_illness) {
      const illnessDate = new Date(data.date_of_illness);
      if (!isNaN(illnessDate.getTime())) {
        data.date_of_illness = illnessDate.toISOString().split('T')[0];
      }
    }

    data.days_chargeable = data.days_chargeable ? data.days_chargeable : "0";
    data.days_chargeable_illness = data.days_chargeable_illness ? data.days_chargeable_illness : "0";
    data.days_of_absence = data.days_of_absence ? data.days_of_absence : "0";
    data.days_of_absence_illness = data.days_of_absence_illness ? data.days_of_absence_illness : "0";

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
