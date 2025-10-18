import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_IncidentReportEmail } from '@/types/globals';

export interface EmployeeIssueUpdateData {
  id: string | number;
  status?: string;
  actionType?: string;
  emailType?: string;
  dateReceived?: any;
  // NTE fields
  nte_subject?: string;
  nte_to?: string;
  nte_cc?: string;
  nte_bcc?: string;
  nte_message?: string;
  // Decision fields
  decision_subject?: string;
  decision_to?: string;
  decision_cc?: string;
  decision_bcc?: string;
  decision_message?: string;
  // General update fields
  employee?: number;
  incident_date?: string;
  position?: string;
  department?: string;
  place_of_incident?: string;
  issue_type?: string;
  brief_background?: string;
}

async function addEmployeeIssue(employeeIssue: EmployeeIssueUpdateData) {
  try {
    const token = getCookie('token');
    let data: any = {};
    
    // Check if this is a status update (approve/disapprove)
    if (employeeIssue.status && ['approved', 'disapproved'].includes(employeeIssue.status)) {
      data = {
        status: employeeIssue.status,
      };
    } else if (employeeIssue.actionType === 'sending') {
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
    } else if (employeeIssue.employee || employeeIssue.incident_date || employeeIssue.position || employeeIssue.department || employeeIssue.place_of_incident || employeeIssue.issue_type || employeeIssue.brief_background) {
      // General update (edit functionality)
      data = {
        employee: employeeIssue.employee,
        incident_date: employeeIssue.incident_date,
        position: employeeIssue.position,
        department: employeeIssue.department,
        place_of_incident: employeeIssue.place_of_incident,
        issue_type: employeeIssue.issue_type,
        brief_background: employeeIssue.brief_background,
      };
      // Remove undefined values
      Object.keys(data).forEach(key => {
        if (data[key] === undefined) {
          delete data[key];
        }
      });
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
  const query = useMutation((employeeIssue: EmployeeIssueUpdateData) =>
    addEmployeeIssue(employeeIssue)
  );

  return query;
}

export default useAddEmployeeIssueItems;
