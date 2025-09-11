import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_IncidentReportEmail } from '@/types/globals';

async function addEmployeeIssue(employeeIssue: T_IncidentReportEmail) {
  try {
    const token = getCookie('token');
    let data: any = {};
    
    if (employeeIssue.actionType === 'sending') {
      data = {
        type_of_action: employeeIssue.actionType,
        type_of_email: employeeIssue.emailType,
      };
      
      if (employeeIssue.emailType === 'nte') {
        // Only save NTE form data to backend fields
        data.nte_subject = employeeIssue.nte_subject;
        data.nte_to = employeeIssue.nte_to;
        data.nte_cc = employeeIssue.nte_cc;
        data.nte_bcc = employeeIssue.nte_bcc;
        data.nte_message = employeeIssue.nte_message;
      }
      
      if (employeeIssue.emailType === 'decision') {
        // Only save decision form data to backend fields
        data.decision_subject = employeeIssue.decision_subject;
        data.decision_to = employeeIssue.decision_to;
        data.decision_cc = employeeIssue.decision_cc;
        data.decision_bcc = employeeIssue.decision_bcc;
        data.decision_message = employeeIssue.decision_message;
      }
    } else {
      data = {
        type_of_action: employeeIssue.actionType,
        type_of_email: employeeIssue.emailType,
        date_received: employeeIssue.dateReceived,
      };
    }
    const config = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/employee-issues/${employeeIssue.id}/`,
      config
    );
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useAddEmployeeIssueItems() {
  const query = useMutation((employeeIssue: T_IncidentReportEmail) =>
    addEmployeeIssue(employeeIssue)
  );

  return query;
}

export default useAddEmployeeIssueItems;
