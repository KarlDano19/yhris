import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_Investigation } from '@/types/globals';

async function addInvestigationReport(investigation: T_Investigation) {
  try {
    const token = getCookie('token');
    const formData = new FormData();
    const investigationDate = new Date(investigation.date);
    if (isNaN(investigationDate.getTime())) {
      throw new Error('Invalid date format');
    }
    formData.append('employee_issue', investigation.employee_issue);
    formData.append('date_of_investigation', investigationDate.toISOString());
    formData.append('witness', investigation.witness);
    formData.append('presider', investigation.presider);
    formData.append('has_attended_hearing', investigation.isAttendHearing);
    formData.append('results', investigation.resultOfInvestigation);
    formData.append('decision', investigation.decision);
    formData.append('custom_decision', investigation.other);
    if (investigation.attachments) {
      formData.append('attachments', investigation.attachments);
    }
    const config = {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/investigation-reports/`, config);
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.formData.message;
    }
    throw errStringify.message;
  }
}

function useAddInvestigationReportItems() {
  const query = useMutation((investigation: T_Investigation) => addInvestigationReport(investigation));

  return query;
}

export default useAddInvestigationReportItems;