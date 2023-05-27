import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { T_SeparationEmail } from '@/types/globals';

async function sendSeparationEmail(
  separationEmail: T_SeparationEmail,
) {
  try {
    const token = getCookie('token');
    const data = {
      type: separationEmail.type,
      subject: '',
      to: '',
      cc: '',
      bcc: '',
      context: '',
    };
    if (separationEmail.type === 'letters') {
      data.subject = 'Letter';
      data.to = separationEmail.separationLetter.to;
      data.cc = separationEmail.separationLetter.cc;
      data.bcc = separationEmail.separationLetter.bcc;
      data.context = separationEmail.separationLetter.message;
    }
    if (separationEmail.type === 'sign documents') {
      data.subject = separationEmail.signDocuments.template;
      data.to = separationEmail.signDocuments.to;
      data.cc = separationEmail.signDocuments.cc;
      data.bcc = separationEmail.signDocuments.bcc;
      data.context = separationEmail.signDocuments.message;
    }
    if (separationEmail.type === 'last pay') {
      
    }
    if (separationEmail.type === 'quit claim') {
      data.subject = separationEmail.separationLetter.template;
      data.to = separationEmail.quitclaim.to;
      data.cc = separationEmail.quitclaim.cc;
      data.bcc = separationEmail.quitclaim.bcc;
      data.context = separationEmail.quitclaim.message;
    }
    const config = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.hostName}/api/separation/${separationEmail.id}/`, config);
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

function useSendSeparationEmail() {

  const query = useMutation(
    (separationEmail: T_SeparationEmail) =>
    sendSeparationEmail(separationEmail),
  );

  return query;
}

export default useSendSeparationEmail;
