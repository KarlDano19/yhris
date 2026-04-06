import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export async function sendEmail(data: any) {
  try {
    const token = getCookie('token');
    
    let config: any;
    
    // Check if there are attachments (multiple or single) or other file uploads
    const hasAttachments = (data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0) || data.attachment;
    
    // If attachments exist, use FormData
    if (hasAttachments) {
      const formData = new FormData();
      
      // Separate File objects from URL strings
      const fileAttachments: File[] = [];
      const urlAttachments: string[] = [];
      
      if (data.attachments && Array.isArray(data.attachments)) {
        data.attachments.forEach((attachment: File | string) => {
          if (attachment instanceof File) {
            fileAttachments.push(attachment);
          } else if (typeof attachment === 'string') {
            urlAttachments.push(attachment);
          }
        });
      } else if (data.attachment) {
        if (data.attachment instanceof File) {
          fileAttachments.push(data.attachment);
        } else if (typeof data.attachment === 'string') {
          urlAttachments.push(data.attachment);
        }
      }
      
      // Append all fields to FormData (excluding attachment fields - handled separately)
      // Ensure email fields are arrays before stringifying
      const emailArray = Array.isArray(data.email) ? data.email : [data.email];
      formData.append('to', JSON.stringify(emailArray));
      formData.append('context', data.message);
      if (data.cc && data.cc.length > 0) {
        const ccArray = Array.isArray(data.cc) ? data.cc : [data.cc];
        formData.append('cc', JSON.stringify(ccArray));
      }
      if (data.bcc && data.bcc.length > 0) {
        const bccArray = Array.isArray(data.bcc) ? data.bcc : [data.bcc];
        formData.append('bcc', JSON.stringify(bccArray));
      }
      formData.append('subject', data.subject);
      
      // Append file attachments as files (these go to request.FILES)
      fileAttachments.forEach((file) => {
        formData.append('attachments', file);
      });
      
      // Append URL attachments as JSON array string (these go to payload)
      if (urlAttachments.length > 0) {
        // Always use 'attachment_urls' key for URL strings to distinguish from files
        formData.append('attachment_urls', JSON.stringify(urlAttachments));
      }
      
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
