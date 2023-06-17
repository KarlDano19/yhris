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
        subject: '',
        to: '',
        cc: '',
        bcc: '',
        context: '',
      };
      if (employeeIssue.emailType === 'nte') {
        data.subject = employeeIssue.sendDecision.template;
        data.to = employeeIssue.issueNTE.to;
        data.cc = employeeIssue.issueNTE.cc;
        data.bcc = employeeIssue.issueNTE.bcc;
        data.context = employeeIssue.issueNTE.message;
      }
      if (employeeIssue.emailType === 'decision') {
        data.subject = employeeIssue.sendDecision.template;
        data.to = employeeIssue.sendDecision.to;
        data.cc = employeeIssue.sendDecision.cc;
        data.bcc = employeeIssue.sendDecision.bcc;
        data.context = employeeIssue.sendDecision.message;
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
      `${process.env.API_URL}/api/employee-issues/${employeeIssue.id}/`,
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
  const query = useMutation((employeeIssue: T_IncidentReportEmail) =>
    addEmployeeIssue(employeeIssue)
  );

  return query;
}

export default useAddEmployeeIssueItems;
