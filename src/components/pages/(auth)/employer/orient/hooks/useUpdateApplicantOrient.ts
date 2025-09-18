import { T_ApplicantOrientEmail } from '@/types/globals';
import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateApplicantOrient(data: any) {
  try {
    let payload: any = {};
    if (data.actionType == 'sending') {
      payload = {
        type_of_action: data.actionType,
        type_of_email: data.emailType,
        subject: '',
        to: '',
        cc: '',
        bcc: '',
        context: '',
      };
      if (data.emailType == 'contract') {
        payload.subject = data.sendContract.subject
          ? data.sendContract.subject
          : `Send Contract | ${data.sendContract.template}`;
        payload.to = data.sendContract.to;
        payload.cc = data.sendContract.cc;
        payload.bcc = data.sendContract.bcc;
        payload.context = data.sendContract.message;
      }
      if (data.emailType == 'introduce') {
        payload.subject = data.introduceTeam.subject
          ? data.introduceTeam.subject
          : `Introduce to the team | ${data.introduceTeam.template}`;
        payload.to = data.introduceTeam.to;
        payload.cc = data.introduceTeam.cc;
        payload.bcc = data.introduceTeam.bcc;
        payload.context = data.introduceTeam.message;  
      }
    } else if (data.actionType == 'received') {
      payload = {
        type_of_action: data.actionType,
        type_of_email: data.emailType,
        date_received: data.dateReceived,
      };
    } else if (data.actionType == 'update_status' && data.emailType == 'location_department') {
      // NEW: Handle location/department assignment
      payload = {
        type_of_action: data.actionType,
        type_of_email: data.emailType,
        location: data.location_name, // Send as string (CharField)
        department: data.department_id, // Send as ID (ForeignKey)
      };
    } else {
      payload = {
        type_of_action: data.actionType,
        type_of_email: data.emailType,
      };
    }
    
    const token = getCookie('token');
    const config = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicant-orientations/${data.id}/`, config);
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

function useUpdateApplicantOrient() {
  const query = useMutation((data: any) =>
    updateApplicantOrient(data)
  );

  return query;
}

export default useUpdateApplicantOrient;
