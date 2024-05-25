import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { EmailTemplate } from '@/types/globals';

async function addEmailTemplate(emailTemplate: EmailTemplate) {
  try {
    const token = getCookie('token');
    const data = {
      subject: emailTemplate.subject,
      to: emailTemplate.to,
      cc: emailTemplate.cc,
      bcc: emailTemplate.bcc,
      body: emailTemplate.body,
      attachment: emailTemplate.attachment,
    }
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email-templates/`, config);
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

function useAddEmailTemplate() {
  const query = useMutation((emailTemplate: EmailTemplate) => addEmailTemplate(emailTemplate));

  return query;
}

export default useAddEmailTemplate;
