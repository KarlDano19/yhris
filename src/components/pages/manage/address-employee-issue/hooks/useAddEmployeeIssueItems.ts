import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_IncidentReport } from '@/types/globals';

async function addEmployeeIssue(employeeIssue: T_IncidentReport) {
  try {
    const token = getCookie('token');
    const data = {
      employee: employeeIssue.name,
      position: employeeIssue.position,
      department: employeeIssue.department,
      incident_date: employeeIssue.incidentDate,
      place_of_incident: employeeIssue.incidentPlace,
      brief_background: employeeIssue.briefBackground,
    };
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(
      `${process.env.API_URL}/api/employee-issues/`,
      config
    );
    if (res.ok) {
      return res.json();
    }
    throw res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useAddEmployeeIssueItems() {
  const query = useMutation((employeeIssue: T_IncidentReport) =>
    addEmployeeIssue(employeeIssue)
  );

  return query;
}

export default useAddEmployeeIssueItems;
