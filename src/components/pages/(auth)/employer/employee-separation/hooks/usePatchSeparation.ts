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
        data.subject = separationEmail.separationLetter.subject || '';
        data.to = Array.isArray(separationEmail.separationLetter.to) 
          ? separationEmail.separationLetter.to 
          : [separationEmail.separationLetter.to];
        data.cc = separationEmail.separationLetter.cc || [];
        data.bcc = separationEmail.separationLetter.bcc || [];
        data.context = separationEmail.separationLetter.message;
        if (separationEmail.separationLetter.attachment) {
          data.attachment = separationEmail.separationLetter.attachment;
        }
      }
      if (separationEmail.emailType === 'sign documents') {
        data.subject = separationEmail.signDocuments.subject;
        data.to = separationEmail.signDocuments.to;
        data.cc = separationEmail.signDocuments.cc;
        data.bcc = separationEmail.signDocuments.bcc;
        data.context = separationEmail.signDocuments.message;
        // Handle multiple attachments for sign documents
        if (separationEmail.signDocuments.attachments && Array.isArray(separationEmail.signDocuments.attachments) && separationEmail.signDocuments.attachments.length > 0) {
          data.attachments = separationEmail.signDocuments.attachments;
        } else if (separationEmail.signDocuments.attachment) {
          // Backward compatibility: single attachment
          data.attachment = separationEmail.signDocuments.attachment;
        }
      }
      if (separationEmail.emailType === 'last pay') {
        data.subject = separationEmail.lastPay.subject;
        data.to = separationEmail.lastPay.to;
        data.cc = separationEmail.lastPay.cc;
        data.bcc = separationEmail.lastPay.bcc;
        data.context = separationEmail.lastPay.message;
        // Handle multiple attachments
        if (separationEmail.lastPay.attachments && Array.isArray(separationEmail.lastPay.attachments) && separationEmail.lastPay.attachments.length > 0) {
          data.attachments = separationEmail.lastPay.attachments;
        } else if (separationEmail.lastPay.attachment) {
          data.attachment = separationEmail.lastPay.attachment;
        }
      }
      if (separationEmail.emailType === 'quit claim') {
        data.subject = separationEmail.quitClaim.subject;
        data.to = separationEmail.quitClaim.to;
        data.cc = separationEmail.quitClaim.cc;
        data.bcc = separationEmail.quitClaim.bcc;
        data.context = separationEmail.quitClaim.message;
        // Handle multiple attachments
        if (separationEmail.quitClaim.attachments && Array.isArray(separationEmail.quitClaim.attachments) && separationEmail.quitClaim.attachments.length > 0) {
          data.attachments = separationEmail.quitClaim.attachments;
        } else if (separationEmail.quitClaim.attachment) {
          data.attachment = separationEmail.quitClaim.attachment;
        }
      }
      if (separationEmail.emailType === 'legal docs') {
        data.subject = separationEmail.legalDocs.subject;
        data.to = separationEmail.legalDocs.to;
        data.cc = separationEmail.legalDocs.cc;
        data.bcc = separationEmail.legalDocs.bcc;
        data.context = separationEmail.legalDocs.message;
      }
    } else {
      data = {
        type_of_action: separationEmail.actionType,
        type_of_email: separationEmail.emailType,
        date_received: separationEmail.dateReceived,
      };
    }
    
    let config: any;
    
    // Check if there are attachments (multiple or single)
    const hasAttachments = (data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0) || data.attachment;
    
    // If attachments exist, use FormData
    if (hasAttachments) {
      const formData = new FormData();
      
      // Handle multiple attachments for sign documents
      if (data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0) {
        const fileAttachments: File[] = [];
        const urlAttachments: string[] = [];
        
        data.attachments.forEach((attachment: File | string) => {
          if (attachment instanceof File) {
            fileAttachments.push(attachment);
          } else if (typeof attachment === 'string') {
            urlAttachments.push(attachment);
          }
        });
        
        // Append file attachments
        fileAttachments.forEach((file) => {
          formData.append('attachments', file);
        });
        
        // Append URL attachments as JSON
        if (urlAttachments.length > 0) {
          formData.append('attachment_urls', JSON.stringify(urlAttachments));
        }
      } else if (data.attachment) {
        // Single attachment (backward compatibility)
        formData.append('attachment', data.attachment);
      }
      
      // Append other fields
      Object.keys(data).forEach(key => {
        if (key === 'attachment' || key === 'attachments') {
          return; // Handled separately above
        } else if (key === 'to' || key === 'cc' || key === 'bcc') {
          // Ensure email fields are arrays before stringifying
          const emailArray = Array.isArray(data[key]) ? data[key] : [data[key]];
          formData.append(key, JSON.stringify(emailArray));
        } else {
          formData.append(key, data[key]);
        }
      });
      
      config = {
        method: 'PATCH',
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      };
    } else {
      // No attachment, use JSON
      config = {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(data),
      };
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/separation/${separationEmail.id}/`, config);
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

function usePatchSeparation() {
  const query = useMutation((separationEmail: T_SeparationEmail) => sendSeparationEmail(separationEmail));

  return query;
}

export default usePatchSeparation;
