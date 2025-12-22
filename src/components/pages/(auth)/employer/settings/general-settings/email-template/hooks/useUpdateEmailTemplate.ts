import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateEmailTemplate(email_template_id: number, data: any) {
  try {
    const token = getCookie('token');
    
    // Check if there are file attachments
    const hasFiles = data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0;
    const hasFilesToDelete = data.delete_attachment_ids && Array.isArray(data.delete_attachment_ids) && data.delete_attachment_ids.length > 0;
    
    let config: any = {
      method: 'PATCH',
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    if (hasFiles || hasFilesToDelete) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append('subject', data.subject || '');
      formData.append('body', data.body || '');
      
      // Handle multiple attachments
      if (hasFiles) {
        data.attachments.forEach((file: File) => {
          if (file instanceof File) {
            formData.append('attachments', file);
          }
        });
      }
      
      // Handle attachment deletion - send as JSON string (backend can parse this)
      if (hasFilesToDelete) {
        if (Array.isArray(data.delete_attachment_ids)) {
          formData.append('delete_attachment_ids', JSON.stringify(data.delete_attachment_ids));
        }
      }
      
      // Handle email arrays - only append if they have values
      if (data.to && Array.isArray(data.to) && data.to.length > 0) {
        data.to.forEach((email: string) => {
          formData.append('to', email);
        });
      }
      if (data.cc && Array.isArray(data.cc) && data.cc.length > 0) {
        data.cc.forEach((email: string) => {
          formData.append('cc', email);
        });
      }
      if (data.bcc && Array.isArray(data.bcc) && data.bcc.length > 0) {
        data.bcc.forEach((email: string) => {
          formData.append('bcc', email);
        });
      }
      
      config.body = formData;
    } else {
      // Use JSON for non-file updates
      config.headers['content-type'] = 'application/json';
      
      // Clean up empty arrays before sending
      const cleanedData = { ...data };
      if (cleanedData.cc && Array.isArray(cleanedData.cc) && cleanedData.cc.length === 0) {
        delete cleanedData.cc;
      }
      if (cleanedData.bcc && Array.isArray(cleanedData.bcc) && cleanedData.bcc.length === 0) {
        delete cleanedData.bcc;
      }
      
      config.body = JSON.stringify(cleanedData);
    }
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email-templates/${email_template_id}/`, config);
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

function useUpdateEmailTemplate() {
  const query = useMutation((props: any) => updateEmailTemplate(props.emailTemplateId, props.data));
  return query;
}

export default useUpdateEmailTemplate;