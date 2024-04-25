import { T_ApplicantOrientEmail } from '@/types/globals';
import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateApplicantOrient(data: any) {
  try {
    let newData: any = {};
    if (data.actionType == 'sending') {
      newData = {
        type_of_action: data.actionType,
        type_of_email: data.emailType,
        subject: '',
        to: '',
        cc: '',
        bcc: '',
        context: '',
      };
      if (data.emailType == 'contract') {
        newData.subject = data.sendContract.template;
        newData.to = data.sendContract.to;
        newData.cc = data.sendContract.cc;
        newData.bcc = data.sendContract.bcc;
        newData.context = data.sendContract.message;
      }
    } else if (data.actionType == 'received') {
      newData = {
        type_of_action: data.actionType,
        type_of_email: data.emailType,
        date_received: data.dateReceived,
      };
    } else {
      newData = {
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
      body: JSON.stringify(newData),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicant-orient/${data.id}/`, config);
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
