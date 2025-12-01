import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { EmailTemplate } from '@/types/globals';

async function addEmailTemplate(emailTemplate: EmailTemplate) {
  try {
    const token = getCookie('token');
    const formData = new FormData();
    formData.append('subject', emailTemplate.subject);
    formData.append('body', emailTemplate.body);
    if (emailTemplate.to && Array.isArray(emailTemplate.to)) {
      formData.append('to', emailTemplate.to.join(','));
    }
    if (emailTemplate.cc && Array.isArray(emailTemplate.cc)) {
      formData.append('cc', emailTemplate.cc.join(','));
    }
    if (emailTemplate.bcc && Array.isArray(emailTemplate.bcc)) {
      formData.append('bcc', emailTemplate.bcc.join(','));
    }
    // Handle multiple attachments
    if (emailTemplate.attachments && Array.isArray(emailTemplate.attachments)) {
      emailTemplate.attachments.forEach((attachment: any) => {
        if (attachment instanceof File) {
          formData.append('attachments', attachment);
        }
      });
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
