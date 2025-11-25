import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

async function updateEmailTemplate(email_template_id: number, data: any) {
  try {
    const token = getCookie('token');
    
    // Check if there's a file attachment
    const hasFile = data.attachment && data.attachment instanceof File;
    
    let config: any = {
      method: 'PATCH',
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    if (hasFile) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append('subject', data.subject || '');
      formData.append('body', data.body || '');
      formData.append('attachment', data.attachment);
      
      // Handle email arrays - only append if they have values
      if (data.to && Array.isArray(data.to) && data.to.length > 0) {
        formData.append('to', data.to.join(','));
      }
      if (data.cc && Array.isArray(data.cc) && data.cc.length > 0) {
        formData.append('cc', data.cc.join(','));
      }
      if (data.bcc && Array.isArray(data.bcc) && data.bcc.length > 0) {
        formData.append('bcc', data.bcc.join(','));
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
