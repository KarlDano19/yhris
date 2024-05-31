import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { EmailTemplate } from '@/types/globals';

async function addEmailTemplate(emailTemplate: EmailTemplate) {
  try {
    const token = getCookie('token');
    const formData = new FormData();
    formData.append('subject', emailTemplate.subject);
    formData.append('to', emailTemplate.to);
    formData.append('body', emailTemplate.body);
    if (emailTemplate.cc) {
      formData.append('cc', emailTemplate.cc);
    }
    if (emailTemplate.bcc) {
      formData.append('bcc', emailTemplate.bcc);
    }
    if (emailTemplate.attachment) {
      formData.append('attachment', emailTemplate.attachment);
    }
    const config = {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
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
