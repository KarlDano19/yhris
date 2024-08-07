import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_Investigation } from '@/types/globals';

async function addInvestigationReport(investigation: T_Investigation) {
  try {
    const token = getCookie('token');
    const data = new FormData();
    const investigationDate = new Date(investigation.date);
    if (isNaN(investigationDate.getTime())) {
      throw new Error('Invalid date format');
    }
    data.append('employee_issue', investigation.employee_issue);
    data.append('date_of_investigation', investigationDate.toISOString());
    data.append('witness', investigation.witness);
    data.append('presider', investigation.presider);
    data.append('has_attended_hearing', investigation.isAttendHearing);
    data.append('results', investigation.resultOfInvestigation);
    data.append('decision', investigation.decision);
    data.append('custom_decision', investigation.other);
    data.append('attachments', investigation.attachments);
    const config = {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: data,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/investigation-reports/`, config);
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

function useAddInvestigationReportItems() {
  const query = useMutation((investigation: T_Investigation) => addInvestigationReport(investigation));

  return query;
}

export default useAddInvestigationReportItems;
