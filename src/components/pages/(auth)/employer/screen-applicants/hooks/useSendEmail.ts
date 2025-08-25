import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export async function sendEmail(data: any) {
  try {
    const token = getCookie('token');
    
    let config: any;
    
    // If attachment exists, use FormData
    if (data.attachment) {
      const formData = new FormData();
      formData.append('to', JSON.stringify(data.email));
      formData.append('context', data.message);
      if (data.cc && data.cc.length > 0) formData.append('cc', JSON.stringify(data.cc));
      if (data.bcc && data.bcc.length > 0) formData.append('bcc', JSON.stringify(data.bcc));
      formData.append('subject', data.subject);
      formData.append('attachment', data.attachment);
      
      config = {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      };
    } else {
      // No attachment, use JSON
      const payloads = {
        bcc: data.bcc,
        cc: data.cc,
        subject: data.subject,
        to: data.email,
        context: data.message,
      };

      config = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payloads),
      };
    }
    
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applicants/send-email/`, config);
      if (!res.ok) {
        throw res.json();
      }
      return;
    }
    return {};
  } catch (err: any) {
    let errStringify = await err;
    if (Object.hasOwn(errStringify, 'response')) {
      throw errStringify.response.data.message;
    }
    throw errStringify.message;
  }
}

function useSendEmail() {
  const query = useMutation((data: any) => sendEmail(data));
  return query;
}

export default useSendEmail;
