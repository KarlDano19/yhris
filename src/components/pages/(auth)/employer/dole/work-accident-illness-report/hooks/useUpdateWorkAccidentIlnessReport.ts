import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

async function updateWorkAccidentIllnessReport(
    work_accident_illness_report_id: string,
    data: any
  ) {
    try {
      const token = getCookie("token");
  
      // Format date_of_incident
      if (data.date_of_incident) {
        const incidentDate = new Date(data.date_of_incident);
        if (!isNaN(incidentDate.getTime())) {
          data.date_of_incident = incidentDate.toISOString().slice(0, 10);
        } else {
          throw new Error("Invalid date_of_incident");
        }
      }
  
      // Format date_returned_to_work
      if (data.date_returned_to_work) {
        const returnedDate = new Date(data.date_returned_to_work);
        if (!isNaN(returnedDate.getTime())) {
          data.date_returned_to_work = returnedDate.toISOString().slice(0, 10);
        } else {
          throw new Error("Invalid date_returned_to_work");
        }
      }
  
      // Format date_of_illness
      if (data.date_of_illness) {
        const illnessDate = new Date(data.date_of_illness);
        if (!isNaN(illnessDate.getTime())) {
          data.date_of_illness = illnessDate.toISOString().slice(0, 10);
        } else {
          throw new Error("Invalid date_of_illness");
        }
      }

      if (data.date_of_disability) {
        const disabilityDate = new Date(data.date_of_disability);
        if (!isNaN(disabilityDate.getTime())) {
          data.date_of_disability = disabilityDate.toISOString().slice(0, 10);
        } else {
          throw new Error("Invalid date_of_disability");
        }
      }

      if (data.date_returned_to_work_illness) {
        const returnedIllnessDate = new Date(data.date_returned_to_work_illness);
        if (!isNaN(returnedIllnessDate.getTime())) {
          data.date_returned_to_work_illness = returnedIllnessDate.toISOString().slice(0, 10);
        } else {
          throw new Error("Invalid date_returned_to_work_illness");
        }
      }
  
      const config = {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/work-accident-illness-reports/${work_accident_illness_report_id}/`,
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

function useUpdateWorkAccidentIllnessReport() {
  const query = useMutation((props: any) =>
    updateWorkAccidentIllnessReport(
      props.work_accident_illness_report_id,
      props.data
    )
  );
  return query;
}

export default useUpdateWorkAccidentIllnessReport;
