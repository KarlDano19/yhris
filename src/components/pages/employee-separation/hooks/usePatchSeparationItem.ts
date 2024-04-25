import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_SeparationEmail } from '@/types/globals';

async function sendSeparationEmail(separationEmail: T_SeparationEmail) {
  try {
    const token = getCookie('token');
    let data: any = {};
    if (separationEmail.actionType === 'sending') {
      data = {
        type_of_action: separationEmail.actionType,
        type_of_email: separationEmail.emailType,
        subject: '',
        to: '',
        cc: '',
        bcc: '',
        context: '',
      };
      if (separationEmail.emailType === 'letters') {
        data.subject = 'Letter';
        data.to = separationEmail.separationLetter.to;
        data.cc = separationEmail.separationLetter.cc;
        data.bcc = separationEmail.separationLetter.bcc;
        data.context = separationEmail.separationLetter.message;
      }
      if (separationEmail.emailType === 'sign documents') {
        data.subject = separationEmail.signDocuments.template;
        data.to = separationEmail.signDocuments.to;
        data.cc = separationEmail.signDocuments.cc;
        data.bcc = separationEmail.signDocuments.bcc;
        data.context = separationEmail.signDocuments.message;
      }
      if (separationEmail.emailType === 'last pay') {
        data.subject = 'Last Pay Release';
        data.to = separationEmail.signDocuments.to;
      }
      if (separationEmail.emailType === 'quit claim') {
        data.subject = separationEmail.separationLetter.template;
        data.to = separationEmail.quitClaim.to;
        data.cc = separationEmail.quitClaim.cc;
        data.bcc = separationEmail.quitClaim.bcc;
        data.context = separationEmail.quitClaim.message;
      }
    } else {
      data = {
        type_of_action: separationEmail.actionType,
        type_of_email: separationEmail.emailType,
        date_received: separationEmail.dateReceived,
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/separation/${separationEmail.id}/`,
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

function usePatchSeparationItem() {
  const query = useMutation((separationEmail: T_SeparationEmail) =>
    sendSeparationEmail(separationEmail)
  );

  return query;
}

export default usePatchSeparationItem;
